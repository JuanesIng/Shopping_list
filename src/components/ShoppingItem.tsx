import { X, CheckCircle2, Circle } from 'lucide-react';
import type { ShoppingItem } from '../types/shopping';

interface Props {
  item: ShoppingItem;
  onToggle: (id: string, purchased: boolean) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItemCard({ item, onToggle, onDelete }: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 p-4 transition-all duration-200 hover:shadow-lg ${
        item.purchased
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 hover:border-green-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(item.id, item.purchased)}
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
            item.purchased ? 'line-through text-gray-500' : 'text-gray-800'
          }`}
        >
          {item.name}
        </span>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
