import React, { useState, useEffect } from 'react';
import { Plus, X, ShoppingCart, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from './supabaseClient';
import type { ShoppingItem } from './types/shopping';

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  // Load items from localStorage on component mount
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

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{ name: newItemName.trim(), purchased: false }])
      .select()
      .single();

    if (error) console.error(error);
    else setItems(prev => [data, ...prev]);

    setNewItemName('');
  };

  const togglePurchased = async (id: string, purchased: boolean) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .update({ purchased: !purchased })
      .eq('id', id)
      .select()
      .single();

    if (error) console.error(error);
    else {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, purchased: !purchased } : item))
      );
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('shopping_items').delete().eq('id', id);
    if (error) console.error(error);
    else setItems(prev => prev.filter(item => item.id !== id));
  };

  const completedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500 rounded-full shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Lista de Compras</h1>
          </div>
          
          {totalCount > 0 && (
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-gray-600">Pendientes: {pendingCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Completados: {completedCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <form onSubmit={addItem} className="flex gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="¿Qué necesitas comprar?"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </form>
        </div>

        {/* Shopping List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Tu lista está vacía</p>
              <p className="text-gray-400">Agrega tu primer producto arriba</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-md border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                  item.purchased
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-100 hover:border-green-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePurchased(item.id, item.purchased)}
                    className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                      item.purchased
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-green-500'
                    }`}
                  >
                    {item.purchased ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  
                  <span
                    className={`flex-1 text-lg transition-all duration-200 ${
                      item.purchased
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear completed button */}
        {completedCount > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={async () => {
                const completedIds = items.filter(i => i.purchased).map(i => i.id);
                await supabase.from('shopping_items').delete().in('id', completedIds);
                setItems(prev => prev.filter(item => !item.purchased));
              }}
              className="px-6 py-2 text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-xl transition-all duration-200 hover:bg-red-50"
            >
              Eliminar completados ({completedCount})
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Conectado con Supabase • Datos en la nube</p>
        </div>
      </div>
    </div>
  );
}

export default App;