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

export default function DashboardLayout() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5028/api";
  // TİP TANIMI GÜNCELLENDİ:
  // Artık TypeScript 'id' ve 'username' alanlarını tanıyor.
  const [user, setUser] = useState<{
    id: number;
    username: string;
    fullName: string;
    role: string;
  } | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ÇIKIŞ YAP FONKSİYONU
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 1. DİNAMİK TARİH OLUŞTURMA (Türkçe)
  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long", // Cumartesi
    year: "numeric", // 2024
    month: "long", // Kasım
    day: "numeric", // 30
  });

  // 2. İSİM GÖSTERİMİ (DÜZELTİLDİ) ✅
  // Username ("keremhoca") yerine FullName'in ilk kelimesini ("Kerem") alıyoruz.
  // Böylece aşağıda "Kerem Hocam" diye boşluklu yazdırabileceğiz.
  const firstName =
    user?.fullName?.split(" ")[0] || user?.username || "Misafir";

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* ============ SABİT SIDEBAR ============ */}
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

          {/* ÇIKIŞ BUTONU */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-red-400 hover:text-red-300 hover:bg-red-900/10 cursor-pointer"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="p-4 bg-zinc-900/50 flex items-center gap-3">
          <Avatar>
            {/* DÜZELTME: Artık resmi Backend'den çekiyoruz */}
            {/* user.id varsa resim yolunu oluştur, yoksa null geç */}
            <AvatarImage
              src={
                user?.id
                  ? `${API_URL}/auth/profile-image/${user.id}`
                  : undefined
              }
              className="object-cover" // Resim düzgün dolsun
            />
            <AvatarFallback>
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

      {/* ============ DEĞİŞKEN İÇERİK ALANI ============ */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* SABİT TOP BAR */}
        <header className="flex justify-between items-center mb-8">
          <div>
            {/* BURASI GÜNCELLENDİ: İsim ve 'Hocam' arasına boşluk geldi */}
            <h1 className="text-2xl font-bold capitalize">
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
                placeholder="Sporcu ara..."
                className="pl-8 bg-zinc-900 border-zinc-800 focus:border-blue-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
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
