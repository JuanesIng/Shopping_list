import { Header } from './components/Header';
import { AddItemForm } from './components/AddItemForm';
import { ShoppingList } from './components/ShoppingList';
import { useShoppingList } from './hooks/useShoppingList';

function App() {
  const {
    items,
    addItem,
    togglePurchased,
    deleteItem,
    clearCompleted,
    completedCount,
    pendingCount,
    totalCount,
  } = useShoppingList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header con icono + contadores */}
        <Header totalCount={totalCount} pendingCount={pendingCount} completedCount={completedCount} />

        {/* Formulario */}
        <AddItemForm onAdd={addItem} />

        {/* Lista */}
        <ShoppingList
          items={items}
          onToggle={togglePurchased}
          onDelete={deleteItem}
        />

        {/* Botón eliminar completados */}
        {completedCount > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearCompleted}
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
