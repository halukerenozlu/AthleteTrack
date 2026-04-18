import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export function SidebarItem({ icon, label, path }: SidebarItemProps) {
  const location = useLocation();

  // Translated comment.
  const isActive =
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
