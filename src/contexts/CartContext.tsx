import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, MenuItemVariant } from '@/types/types';

export interface ExtendedCartItem extends CartItem {
  id: string;
  restaurant_id: string;
  restaurant_name?: string;
}

interface CartContextType {
  cart: ExtendedCartItem[];
  cartOpen: boolean;
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string, variant?: MenuItemVariant, portionSize?: string, notes?: string) => void;
  updateCartItemQuantity: (cartItemId: string, change: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  getItemPrice: (item: MenuItem, variant?: MenuItemVariant, portionSize?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dineqr_cart';
const CART_RESTAURANT_KEY = 'dineqr_cart_restaurant';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ExtendedCartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedRestaurant = localStorage.getItem(CART_RESTAURANT_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
      
      if (savedRestaurant) {
        const { id, name } = JSON.parse(savedRestaurant);
        setRestaurantId(id);
        setRestaurantName(name);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_RESTAURANT_KEY);
        setRestaurantId(null);
        setRestaurantName(null);
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Calculate item price based on variant and portion size
  const getItemPrice = (item: MenuItem, variant?: MenuItemVariant, portionSize?: string): number => {
    // If item has portions and a portion size is specified, find the variant price
    if (item.has_portions && portionSize && item.variants) {
      const portionVariant = item.variants.find(v => v.name.toLowerCase() === portionSize.toLowerCase());
      if (portionVariant) {
        return portionVariant.price;
      }
    }
    // Otherwise use variant price or base price
    return variant?.price || item.price;
  };

  // Add item to cart
  const addToCart = (
    item: MenuItem,
    newRestaurantId: string,
    newRestaurantName: string,
    variant?: MenuItemVariant,
    portionSize?: string,
    notes?: string
  ) => {
    // Check if cart has items from a different restaurant
    if (restaurantId && restaurantId !== newRestaurantId) {
      // Clear cart if switching restaurants
      const confirmSwitch = window.confirm(
        `Your cart contains items from ${restaurantName}. Do you want to clear it and add items from ${newRestaurantName}?`
      );
      
      if (!confirmSwitch) {
        return;
      }
      
      setCart([]);
    }

    // Update restaurant info
    if (!restaurantId || restaurantId !== newRestaurantId) {
      setRestaurantId(newRestaurantId);
      setRestaurantName(newRestaurantName);
      localStorage.setItem(CART_RESTAURANT_KEY, JSON.stringify({ id: newRestaurantId, name: newRestaurantName }));
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.menu_item.id === item.id &&
        cartItem.selectedVariant?.name === variant?.name &&
        cartItem.portionSize === portionSize &&
        cartItem.notes === notes
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: ExtendedCartItem = {
        id: `${item.id}-${variant?.name || 'default'}-${portionSize || 'full'}-${Date.now()}`,
        menu_item: item,
        quantity: 1,
        selectedVariant: variant,
        portionSize,
        notes,
        restaurant_id: newRestaurantId,
        restaurant_name: newRestaurantName,
      };
      setCart([...cart, newCartItem]);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = (cartItemId: string, change: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === cartItemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is ExtendedCartItem => item !== null);
      
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_RESTAURANT_KEY);
  };

  const value: CartContextType = {
    cart,
    cartOpen,
    restaurantId,
    restaurantName,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    setCartOpen,
    getItemPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
