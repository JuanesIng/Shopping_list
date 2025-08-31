import type { ShoppingItem } from '../types/shopping';
import { ShoppingItemCard } from './ShoppingItem';
import { ShoppingCart } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
  onToggle: (id: string, purchased: boolean) => void;
  onDelete: (id: string) => void;
}

export function ShoppingList({ items, onToggle, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Tu lista está vacía</p>
        <p className="text-gray-400">Agrega tu primer producto arriba</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ShoppingItemCard
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
