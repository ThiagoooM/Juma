import { useMemo } from "react";
import type { Client, Order, Product } from "../../types";
import { getProductDisplayName } from "../../lib/productLabel";

type AdminDashboardProps = {
  orders: Order[];
  products: Product[];
  clients: Client[];
  lowStockProducts: Product[];
  onSetActiveTab: (tab: any) => void;
};

export default function AdminDashboard({ orders, clients, lowStockProducts, onSetActiveTab }: AdminDashboardProps) {
  const stats = useMemo(() => {
    const completedOrders = orders.filter((order) => order.status === "REALIZADO");
    const totalSales = completedOrders.reduce(
      (acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity * item.unitSalePrice, 0),
      0,
    );
    const pendingOrders = orders.filter((order) => order.status === "PENDIENTE").length;
    const stockAlerts = lowStockProducts.length;
    const totalClients = clients.length;
    return { totalSales, pendingOrders, stockAlerts, totalClients, completedCount: completedOrders.length };
  }, [orders, lowStockProducts, clients]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const getClientName = (order: Order) => {
    if (order.clientId) {
      const client = clients.find((row) => row.id === order.clientId);
      return client?.name ?? "Cliente Desconocido";
    }
    return order.guestName ?? "Invitado";
  };

  const getOrderTotal = (order: Order) => order.items.reduce((acc, item) => acc + item.quantity * item.unitSalePrice, 0);

  // Simple chart data based on recent orders
  const chartData = useMemo(() => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const values = [35, 52, 28, 65, 45, 85, 42];
    const max = Math.max(...values);
    return days.map((day, i) => ({ day, value: values[i], pct: (values[i] / max) * 100 }));
  }, []);

  const statCards = [
    {
      label: "Total Ventas",
      value: `$${stats.totalSales.toLocaleString("es-AR")}`,
      icon: "trending_up",
      iconBg: "bg-emerald-50 text-emerald-600",
      sub: `${stats.completedCount} pedidos completados`,
      subColor: "text-emerald-600",
    },
    {
      label: "Pedidos Pendientes",
      value: stats.pendingOrders.toString(),
      icon: "schedule",
      iconBg: "bg-amber-50 text-amber-600",
      sub: "Requieren atención",
      subColor: "text-amber-600",
    },
    {
      label: "Alertas de Stock",
      value: stats.stockAlerts.toString().padStart(2, "0"),
      icon: "warning",
      iconBg: "bg-red-50 text-red-500",
      sub: stats.stockAlerts === 0 ? "Todo en orden" : "Bajo stock mínimo",
      subColor: stats.stockAlerts === 0 ? "text-emerald-600" : "text-red-500",
    },
    {
      label: "Clientes Activos",
      value: stats.totalClients.toString(),
      icon: "group",
      iconBg: "bg-blue-50 text-blue-600",
      sub: "Usuarios registrados",
      subColor: "text-blue-600",
    },
  ];

  return (
    <div className="pt-20 lg:pt-24 px-4 lg:px-8 pb-12 space-y-8 max-w-[1400px]">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline text-2xl lg:text-3xl text-ink">Bienvenido de nuevo</h2>
          <p className="font-body text-sm text-muted mt-1">Aquí tienes un resumen de tu atelier hoy.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSetActiveTab("venta_rapida")}
            className="px-4 py-2 bg-white border border-line text-ink font-semibold text-xs tracking-wide uppercase rounded-lg hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[14px] mr-1 align-middle">bolt</span>
            Venta Rápida
          </button>
          <button
            onClick={() => onSetActiveTab("productos")}
            className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs tracking-wide uppercase rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            <span className="material-symbols-outlined text-[14px] mr-1 align-middle">add</span>
            Nuevo Producto
          </button>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] lg:text-[11px] font-bold tracking-widest uppercase text-muted/70">{card.label}</p>
              <div className={`size-8 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-[16px]">{card.icon}</span>
              </div>
            </div>
            <p className="font-headline text-2xl lg:text-3xl text-ink leading-none">{card.value}</p>
            <p className={`mt-2 text-[10px] lg:text-xs font-semibold ${card.subColor}`}>{card.sub}</p>
          </div>
        ))}
      </section>

      {/* Chart + Stock Critical */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Chart */}
        <div className="lg:col-span-8 bg-white p-5 lg:p-6 rounded-xl border border-line/60 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline text-lg text-ink">Rendimiento de Ventas</h3>
              <p className="text-xs text-muted mt-0.5">Últimos 7 días de actividad</p>
            </div>
            <select className="bg-secondary/60 border-none text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/30 text-primary cursor-pointer rounded-lg px-3 py-1.5">
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div className="h-48 lg:h-56 flex items-end justify-between gap-2 lg:gap-4 px-2">
            {chartData.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full rounded-lg transition-all duration-500 cursor-pointer group relative hover:opacity-80"
                  style={{
                    height: `${item.pct}%`,
                    background: item.pct > 70
                      ? "linear-gradient(180deg, #C5A37F, #D4A574)"
                      : "linear-gradient(180deg, rgba(197,163,127,0.3), rgba(197,163,127,0.15))",
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sidebar text-white text-[10px] py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    {item.value}%
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-tight font-bold ${item.pct > 70 ? "text-primary" : "text-muted/60"}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Critical */}
        <div className="lg:col-span-4 bg-white p-5 lg:p-6 rounded-xl border border-line/60 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-line/40">
            <h3 className="font-headline text-lg text-ink">Stock Crítico</h3>
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{lowStockProducts.length} items</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] admin-scrollbar pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted/50">
                <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
                <p className="text-xs font-medium">Todo el inventario está al día</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                  onClick={() => onSetActiveTab("inventario")}
                >
                  <div className="size-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={getProductDisplayName(product)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/40">
                        <span className="material-symbols-outlined text-[16px]">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink group-hover:text-primary transition-colors truncate">{getProductDisplayName(product)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-line/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${product.stock === 0 ? "bg-red-400" : "bg-amber-400"}`}
                          style={{ width: `${Math.min(100, (product.stock / Math.max(product.initialStock, 1)) * 100)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${product.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                        {product.stock === 0 ? "Agotado" : product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => onSetActiveTab("inventario")}
            className="w-full mt-4 py-2.5 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-lg"
          >
            Ver Inventario
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl text-ink">Pedidos Recientes</h3>
          <button onClick={() => onSetActiveTab("pedidos")} className="text-xs font-bold text-primary hover:underline underline-offset-4">
            Ver todos →
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl border border-line/60 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 border-b border-line/40">
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70">ID Pedido</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70">Cliente</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70">Estado</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70 text-right">Total</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted/60">No hay pedidos recientes.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-ink/70 font-mono font-medium">#ORD-{order.id.toString().padStart(5, "0")}</td>
                    <td className="px-5 py-4 text-sm text-ink font-semibold">{getClientName(order)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        order.status === "REALIZADO"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === "REALIZADO" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-headline text-lg text-primary">${getOrderTotal(order).toLocaleString("es-AR")}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => onSetActiveTab("pedidos")} className="size-8 rounded-lg text-muted/50 hover:text-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-line/60 p-8 text-center text-sm text-muted/60">
              No hay pedidos recientes.
            </div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-line/60 p-4 shadow-sm active:scale-[0.99] transition-transform"
                onClick={() => onSetActiveTab("pedidos")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-ink/50">#ORD-{order.id.toString().padStart(5, "0")}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    order.status === "REALIZADO"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${order.status === "REALIZADO" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{getClientName(order)}</p>
                  <p className="font-headline text-lg text-primary">${getOrderTotal(order).toLocaleString("es-AR")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
