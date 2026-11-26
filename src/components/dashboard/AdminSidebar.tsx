import {
  CalendarHeart,
  LogOut,
  Palette,
  QrCode,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

export type AdminTabId =
  | "eventos"
  | "ordenes"
  | "templates"
  | "qr"
  | "abandonados"
  | "savedate";

export interface AdminSidebarCounts {
  ordenesPagadas: number;
  eventos: number;
  abandonados: number;
}

interface AdminSidebarProps {
  activeTab: AdminTabId;
  counts: AdminSidebarCounts;
  mobileOpen: boolean;
  onSelect: (tab: AdminTabId) => void;
  onLogout: () => void;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AdminTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: keyof AdminSidebarCounts;
}

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Ventas",
    items: [{ id: "ordenes", label: "Compradores & Ventas", icon: ShoppingBag, countKey: "ordenesPagadas" }],
  },
  {
    label: "Contenido",
    items: [
      { id: "eventos", label: "Invitaciones", icon: Sparkles, countKey: "eventos" },
      { id: "templates", label: "Templates", icon: Palette },
      { id: "savedate", label: "Save the Date", icon: CalendarHeart },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { id: "abandonados", label: "Carrito abandonado", icon: ShoppingCart, countKey: "abandonados" },
      { id: "qr", label: "Códigos QR", icon: QrCode },
    ],
  },
];

/**
 * Barra lateral del admin, modelada en el sidebar del template de dashboard
 * (grupos con etiqueta en mayúsculas, ítem activo con fondo tintado burdeos).
 * En escritorio vive fija a la izquierda (sticky, alto completo); en móvil
 * es un drawer que se abre con el botón hamburguesa del header.
 */
export default function AdminSidebar({
  activeTab,
  counts,
  mobileOpen,
  onSelect,
  onLogout,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r border-stone-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-4">
        <img src="/logo.png" alt="Click and Love" className="h-11 w-11 object-contain" />
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7A002A]">
              Admin
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-stone-400">Panel de Ventas & Eventos</p>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Cerrar menú"
          className="ml-auto rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 lg:hidden cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Navegación por grupos */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 pt-5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                const count = item.countKey ? counts[item.countKey] : undefined;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-[#7A002A]/10 font-bold text-[#7A002A]"
                          : "font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#7A002A]" : "text-stone-400"}`} />
                      <span className="truncate">{item.label}</span>
                      {typeof count === "number" && count > 0 && (
                        <span
                          className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            isActive ? "bg-[#7A002A] text-white" : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Salir */}
      <div className="border-t border-stone-200 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <LogOut className="h-4 w-4 shrink-0 text-stone-400" />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
