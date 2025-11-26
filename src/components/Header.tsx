import { ShoppingCart } from 'lucide-react';

interface Props {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
}

export function Header({ totalCount, pendingCount, completedCount }: Props) {
  return (
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
  );
}
