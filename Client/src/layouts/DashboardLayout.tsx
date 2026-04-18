import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarItem } from "@/components/dashboard/SidebarItem";
import {
  Users,
  Calendar,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Shield,
  Stethoscope,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner"; // Translated comment.

export default function DashboardLayout() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5028/api";

  const [user, setUser] = useState<{
    id: number;
    username: string;
    fullName: string;
    role: string;
  } | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName = user?.fullName || user?.username || "Hocam";
  // Translated comment.
  const firstName = displayName.split(" ")[0];

  return (
    // Translated comment.
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Translated comment. */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AthleteTrack</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Özet"
            path="/dashboard"
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Sporcular"
            path="/dashboard/athletes"
          />
          <SidebarItem
            icon={<Shield size={20} />}
            label="Takımlar"
            path="/dashboard/teams"
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Antrenmanlar"
            path="/dashboard/trainings"
          />
          <SidebarItem
            icon={<Stethoscope size={20} />}
            label="Sağlık Merkezi"
            path="/dashboard/health"
          />
          {/* Translated comment. */}
          <SidebarItem
            icon={<Trophy size={20} />}
            label="Fikstür / Maçlar"
            path="/dashboard/matches"
          />
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Ayarlar"
            path="/dashboard/settings"
          />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-red-400 hover:text-red-300 hover:bg-red-900/10 cursor-pointer"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>

        {/* Translated comment. */}
        <div className="p-4 bg-zinc-900/50 flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={
                user?.id
                  ? `${API_URL}/auth/profile-image/${user.id}`
                  : undefined
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-800 text-zinc-400">
              {user ? user.fullName.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user ? user.fullName : "Misafir Kullanıcı"}
            </span>
            <span className="text-xs text-zinc-400">
              {user ? user.role : "Giriş Yapılmadı"}
            </span>
          </div>
        </div>
      </aside>

      {/* Translated comment. */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* Translated comment. */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold capitalize tracking-tight">
              Hoşgeldin, {firstName} Hocam 👋
            </h1>
            <p className="text-zinc-400 text-sm">
              Bugün {today}, antrenman saati yaklaşıyor.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Genel arama..."
                className="pl-8 bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white placeholder:text-zinc-500"
                // Translated comment.
                onKeyDown={(e) => {
                  if (e.key === "Enter") toast.info("Küresel Arama Yakında...");
                }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white"
              // Translated comment.
              onClick={() => toast.info("Bildirim özelliği çok yakında...")}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar className="md:hidden">
              <AvatarFallback>KA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
