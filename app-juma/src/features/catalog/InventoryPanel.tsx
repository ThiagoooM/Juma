import { useMemo, useState } from "react";
import type { Category, Product } from "../../types";
import { getProductDisplayName } from "../../lib/productLabel";

type InventoryPanelProps = {
  products: Product[];
  categories: Category[];
  lowStockProducts: Product[];
  onUpdateStock: (productId: number, newStock: number) => void;
  onSaveProductEdits: (productId: number, updates: Partial<Product>) => void;
};

function InventoryPanel({ products, categories, lowStockProducts, onUpdateStock, onSaveProductEdits }: InventoryPanelProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSubName, setEditSubName] = useState("");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.subName, product.categoryName || ""].some((value) =>
          (value || "").toLowerCase().includes(normalized),
        );
      const matchesCategory = !categoryFilter || String(product.categoryId ?? "") === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, categoryFilter]);

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditSubName(product.subName);
  };

  const saveEdit = (product: Product) => {
    const normalizedName = editName.trim();
    const normalizedSubName = editSubName.trim();
    if (!normalizedName && !normalizedSubName) return;
    onSaveProductEdits(product.id, {
      name: normalizedName || normalizedSubName,
      subName: normalizedSubName,
    });
    setEditingProductId(null);
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-12 bg-secondary min-h-screen text-ink">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-ink">Control de Inventario</h2>
          <p className="text-slate-500 mt-1">Supervisa niveles criticos de stock y actualiza cantidades.</p>
        </div>
      </div>

      {lowStockProducts.length > 0 ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex gap-3 shadow-sm items-start">
          <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
          <div>
            <h4 className="font-bold text-red-800 text-sm">Atencion: Productos con bajo stock</h4>
            <p className="text-sm text-red-700 mt-1">
              Los siguientes productos requieren reposicion inminente:{" "}
              <strong className="font-bold">{lowStockProducts.map((product) => getProductDisplayName(product)).join(", ")}</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex gap-3 shadow-sm items-center">
          <span className="material-symbols-outlined text-green-500">check_circle</span>
          <p className="text-sm font-bold text-green-800">El inventario se encuentra en niveles optimos. No hay productos en falta critica.</p>
        </div>
      )}

      <div className="bg-background rounded-xl border border-line overflow-hidden shadow-sm">
        <div className="p-4 border-b border-line flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <h3 className="font-bold text-lg text-ink">Existencias</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Buscar producto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="min-w-[220px] bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Producto</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Categoria</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Stock Actual</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ajuste Manual</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Editar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-soft dark:divide-slate-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/35 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {product.image ? (
                          <img src={product.image} alt={getProductDisplayName(product)} className="h-full w-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-ink block">{getProductDisplayName(product)}</span>
                        {editingProductId === product.id ? (
                          <div className="mt-2 flex flex-col gap-2">
                            <input
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Nombre visible"
                            />
                            <input
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                              value={editSubName}
                              onChange={(e) => setEditSubName(e.target.value)}
                              placeholder="Subnombre"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{product.categoryName || "Sin categoria"}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center font-bold px-3 py-1 rounded-full text-xs ${product.stock <= 2 ? "bg-red-100 text-red-700" : product.stock <= 10 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => onUpdateStock(product.id, Number(e.target.value))}
                          className="w-14 text-center text-sm font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateStock(product.id, product.stock + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {editingProductId === product.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(product)}
                          className="inline-flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">save</span>
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="inline-flex items-center gap-1 bg-tertiary/20 text-[#36506b] hover:bg-tertiary hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No hay productos en el inventario.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryPanel;
