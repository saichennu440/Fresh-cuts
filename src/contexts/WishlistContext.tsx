import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';
import { Database } from '../utils/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
  product: Product;
};

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch wishlist items whenever user changes
  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      // If user is not logged in, reset wishlist
      setWishlist([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlist(data as WishlistItem[]);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const addToWishlist = async (product: Product) => {
    try {
      if (!user) return;

      // Check if already in wishlist
      if (isInWishlist(product.id)) return;

      const { error } = await supabase.from('wishlist_items').insert({
        user_id: user.id,
        product_id: product.id,
      });

      if (error) throw error;

      // Refetch wishlist to get updated items
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      // Update local state
      setWishlist(wishlist.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const value = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}