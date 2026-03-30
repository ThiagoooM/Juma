export type AdminTopNavProps = {
  onLogout: () => void;
  onToggleSidebar: () => void;
};

export default function AdminTopNav({ onLogout, onToggleSidebar }: AdminTopNavProps) {
  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 glass-nav flex items-center px-4 lg:px-8 z-30 border-b border-line/50">
      {/* Mobile menu toggle */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden mr-3 size-9 flex items-center justify-center rounded-lg text-ink/60 hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60 text-[18px] group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full bg-secondary/60 border border-transparent focus:border-primary/20 focus:bg-white focus:shadow-sm py-2.5 pl-11 pr-4 text-sm font-body tracking-tight placeholder:text-muted/50 rounded-xl outline-none transition-all duration-200"
            placeholder="Buscar pedidos, productos o clientes..."
            type="text"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button className="relative size-9 flex items-center justify-center rounded-lg text-ink/50 hover:text-primary hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
        </button>
        <div className="hidden lg:block w-px h-6 bg-line/60" />
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-ink/60 hover:text-red-500 hover:bg-red-50 transition-colors"
          onClick={onLogout}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="hidden lg:inline font-body text-sm font-medium">Salir</span>
        </button>
      </div>
    </header>
  );
}
