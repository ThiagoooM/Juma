import type { Tab } from "../../types";

type AdminSidebarProps = {
  activeTab: Tab;
  onSetActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ activeTab, onSetActiveTab, isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "catalogo", label: "Ver Tienda", icon: "storefront" },
    { id: "venta_rapida", label: "Venta Rápida", icon: "bolt" },
    { id: "inventario", label: "Inventario", icon: "inventory_2" },
    { id: "productos", label: "Productos", icon: "layers" },
    { id: "clientes", label: "Usuarios", icon: "group" },
    { id: "pedidos", label: "Pedidos", icon: "shopping_bag" },
    { id: "finanzas", label: "Finanzas", icon: "payments" },
    { id: "inicio_admin", label: "Configuración", icon: "settings" },
  ];

  const handleNav = (id: string) => {
    onSetActiveTab(id as Tab);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50
          sidebar-transition
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-5 pt-7 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
              J
            </div>
            <div>
              <h1 className="font-headline text-lg text-white tracking-tight leading-tight">Juma</h1>
              <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto admin-scrollbar">
          <p className="px-3 pt-2 pb-3 text-[9px] font-bold text-white/25 uppercase tracking-[0.2em]">Menú principal</p>
          {menuItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }
              `}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeTab === item.id ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}

          <p className="px-3 pt-5 pb-3 text-[9px] font-bold text-white/25 uppercase tracking-[0.2em]">Gestión</p>
          {menuItems.slice(3, 7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }
              `}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeTab === item.id ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}

          <p className="px-3 pt-5 pb-3 text-[9px] font-bold text-white/25 uppercase tracking-[0.2em]">Sistema</p>
          {menuItems.slice(7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }
              `}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeTab === item.id ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="mx-3 mb-4 p-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">Administrador</p>
              <p className="text-[10px] text-white/30 font-medium">Juma Accessory</p>
            </div>
            <div className="size-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
}
