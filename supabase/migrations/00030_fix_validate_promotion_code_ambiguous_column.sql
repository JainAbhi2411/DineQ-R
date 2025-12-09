/*
# Fix Ambiguous Column Reference in validate_promotion_code Function

## Issue
The validate_promotion_code function has an ambiguous column reference error when checking
per-customer usage limits. The query references 'promotion_id' without specifying the table,
which causes PostgreSQL to be unsure if it refers to the table column or a potential variable.

## Fix
Explicitly specify the table name (promotion_usage.promotion_id) in the WHERE clause to
eliminate ambiguity.

## Changes
- Updated validate_promotion_code function to use explicit table.column references
*/

CREATE OR REPLACE FUNCTION validate_promotion_code(
  p_code text,
  p_restaurant_id uuid,
  p_customer_id uuid,
  p_order_amount numeric
)
RETURNS TABLE (
  valid boolean,
  promotion_id uuid,
  discount_amount numeric,
  error_message text
) AS $$
DECLARE
  v_promotion promotions;
  v_customer_usage_count integer;
  v_calculated_discount numeric;
BEGIN
  -- Find the promotion
  SELECT * INTO v_promotion
  FROM promotions
  WHERE UPPER(code) = UPPER(p_code)
    AND restaurant_id = p_restaurant_id
    AND is_active = true
    AND start_date <= now()
    AND end_date >= now();

  -- Check if promotion exists
  IF v_promotion.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, 0::numeric, 'Invalid or expired promo code'::text;
    RETURN;
  END IF;

  -- Check minimum order amount
  IF p_order_amount < v_promotion.min_order_amount THEN
    RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 
      format('Minimum order amount is $%s', v_promotion.min_order_amount)::text;
    RETURN;
  END IF;

  -- Check total usage limit
  IF v_promotion.total_usage_limit IS NOT NULL 
     AND v_promotion.used_count >= v_promotion.total_usage_limit THEN
    RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 'Promotion usage limit reached'::text;
    RETURN;
  END IF;

  -- Check per-customer usage limit (FIXED: explicit table.column reference)
  IF v_promotion.usage_limit_per_customer IS NOT NULL THEN
    SELECT COUNT(*) INTO v_customer_usage_count
    FROM promotion_usage pu
    WHERE pu.promotion_id = v_promotion.id
      AND pu.customer_id = p_customer_id;

    IF v_customer_usage_count >= v_promotion.usage_limit_per_customer THEN
      RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 
        'You have already used this promotion'::text;
      RETURN;
    END IF;
  END IF;

  -- Calculate discount
  IF v_promotion.discount_type = 'PERCENTAGE' THEN
    v_calculated_discount := (p_order_amount * v_promotion.discount_value / 100);
    -- Apply max discount cap if exists
    IF v_promotion.max_discount IS NOT NULL 
       AND v_calculated_discount > v_promotion.max_discount THEN
      v_calculated_discount := v_promotion.max_discount;
    END IF;
  ELSE
    v_calculated_discount := v_promotion.discount_value;
  END IF;

  -- Ensure discount doesn't exceed order amount
  IF v_calculated_discount > p_order_amount THEN
    v_calculated_discount := p_order_amount;
  END IF;

  -- Return success
  RETURN QUERY SELECT true, v_promotion.id, v_calculated_discount, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;