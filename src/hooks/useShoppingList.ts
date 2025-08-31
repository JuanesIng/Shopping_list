import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { ShoppingItem } from '../types/shopping';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      else setItems(data || []);
    };
    fetchItems();
  }, []);

  const addItem = async (name: string) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{ name, purchased: false }])
      .select()
      .single();
    if (error) console.error(error);
    else setItems(prev => [data, ...prev]);
  };

  const togglePurchased = async (id: string, purchased: boolean) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .update({ purchased: !purchased })
      .eq('id', id)
      .select()
      .single();
    if (error) console.error(error);
    else setItems(prev => prev.map(i => (i.id === id ? data : i)));
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('shopping_items').delete().eq('id', id);
    if (error) console.error(error);
    else setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCompleted = async () => {
    const completedIds = items.filter(i => i.purchased).map(i => i.id);
    if (completedIds.length === 0) return;
    const { error } = await supabase.from('shopping_items').delete().in('id', completedIds);
    if (error) console.error(error);
    else setItems(prev => prev.filter(i => !i.purchased));
  };

  const completedCount = items.filter(i => i.purchased).length;
  const totalCount = items.length;
  const pendingCount = totalCount - completedCount;

  return {
    items,
    addItem,
    togglePurchased,
    deleteItem,
    clearCompleted,
    completedCount,
    pendingCount,
    totalCount,
  };
}
