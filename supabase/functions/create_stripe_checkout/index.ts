import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const successUrlPath = '/payment-success?session_id={CHECKOUT_SESSION_ID}';
const cancelUrlPath = '/customer/cart';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  menu_item_id: string;
  menu_item_name: string;
  price: number;
  quantity: number;
  notes?: string;
  portion_size?: string;
  variant_name?: string;
  image_url?: string;
}

interface CheckoutRequest {
  restaurant_id: string;
  table_id?: string;
  items: OrderItem[];
  special_instructions?: string;
  currency?: string;
  promotion_id?: string;
  discount_amount?: number;
  promo_code?: string;
}

function ok(data: any): Response {
  return new Response(
    JSON.stringify({ code: "SUCCESS", message: "Success", data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function fail(msg: string, code = 400): Response {
  return new Response(
    JSON.stringify({ code: "FAIL", message: msg }),
    {
      status: code,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function validateCheckoutRequest(request: CheckoutRequest): void {
  if (!request.restaurant_id) {
    throw new Error("Restaurant ID is required");
  }
  if (!request.items?.length) {
    throw new Error("Order items cannot be empty");
  }
  for (const item of request.items) {
    if (!item.menu_item_id || !item.menu_item_name || item.price <= 0 || item.quantity <= 0) {
      throw new Error("Invalid item information");
    }
  }
}

async function createStripeCoupon(stripe: Stripe, discountAmount: number, currency: string): Promise<string> {
  const coupon = await stripe.coupons.create({
    amount_off: Math.round(discountAmount * 100),
    currency: currency,
    duration: 'once',
  });
  return coupon.id;
}

async function createCheckoutSession(
  stripe: Stripe,
  userId: string | null,
  request: CheckoutRequest,
  origin: string
) {
  const totalAmount = request.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const currency = (request.currency || 'usd').toLowerCase();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: userId,
      restaurant_id: request.restaurant_id,
      table_id: request.table_id || null,
      total_amount: totalAmount,
      currency: currency,
      status: "pending",
      payment_status: "pending",
      payment_method: "online",
      special_instructions: request.special_instructions || null,
      promotion_id: request.promotion_id || null,
      discount_amount: request.discount_amount || 0,
      promo_code: request.promo_code || null,
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(
      request.items.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || null,
        portion_size: item.portion_size || null,
        variant_name: item.variant_name || null,
      }))
    );

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  // Record promotion usage if a promo was applied
  if (request.promotion_id && userId && request.discount_amount) {
    const { error: promoError } = await supabase
      .from("promotion_usage")
      .insert({
        promotion_id: request.promotion_id,
        customer_id: userId,
        order_id: order.id,
        discount_amount: request.discount_amount,
      });
    
    if (promoError) {
      console.error("Failed to record promotion usage:", promoError);
      // Don't fail the order if promotion recording fails
    }
  }

  // Calculate discounted total for Stripe
  const discountedTotal = Math.max(0, totalAmount - (request.discount_amount || 0));

  const session = await stripe.checkout.sessions.create({
    line_items: request.items.map(item => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.menu_item_name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${origin}${successUrlPath}`,
    cancel_url: `${origin}${cancelUrlPath}`,
    payment_method_types: ['card'],
    metadata: {
      order_id: order.id,
      user_id: userId || "",
      restaurant_id: request.restaurant_id,
      table_id: request.table_id || "",
      promotion_id: request.promotion_id || "",
      promo_code: request.promo_code || "",
    },
    ...(request.discount_amount && request.discount_amount > 0 ? {
      discounts: [{
        coupon: await createStripeCoupon(stripe, request.discount_amount, currency),
      }],
    } : {}),
  });

  await supabase
    .from("orders")
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      payment_status: "processing",
    })
    .eq("id", order.id);

  return { order, session };
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const request = await req.json();
    validateCheckoutRequest(request);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user } } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null } };

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "";
    const { order, session } = await createCheckoutSession(
      stripe,
      user?.id || null,
      request,
      origin
    );

    return ok({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Payment processing failed", 500);
  }
});
