import { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (name: string) => void;
}

export function AddItemForm({ onAdd }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="¿Qué necesitas comprar?"
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
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
  );
}
