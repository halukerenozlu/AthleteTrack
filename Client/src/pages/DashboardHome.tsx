import { useState, useEffect, useCallback } from "react";
import { Users, Activity, Calendar, Stethoscope, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/StatCard"; // StatCard bileşenini çağırdık
import { dashboardApi } from "@/api/dashboardApi";
import type { DashboardSummary } from "@/types";
import { toast } from "sonner";
// Grafikler için Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardHome() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      // Backend'den özet verileri çekiyoruz
      const data = await dashboardApi.getSummary(user.id);
      setSummary(data);
    } catch (error) {
      console.error(error);
      toast.error("Özet veriler yüklenemedi. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="text-zinc-500 text-center py-20 animate-pulse">
        Analizler yükleniyor...
      </div>
    );
  }

  // Eğer veri yoksa veya hata varsa
  if (!summary) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. İSTATİSTİK KARTLARI (Gerçek Veri) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Sporcu"
          value={summary.totalAthletes.toString()}
          icon={<Users className="text-blue-500" />}
          change="Aktif Kayıt"
        />
        <StatCard
          title="Aktif Sakatlık"
          value={summary.activeInjuries.toString()}
          icon={<Stethoscope className="text-red-500" />}
          change="Tedavi gören"
          trend="down"
        />
        <StatCard
          title="Katılım Oranı"
          value={`%${summary.attendanceRate}`}
          icon={<Activity className="text-emerald-500" />}
          change="Son 30 Gün"
        />
        <StatCard
          title="Sıradaki Maç"
          value={summary.nextMatchDate}
          icon={<Calendar className="text-purple-500" />}
          change="Fikstür"
        />
      </div>

      {/* 2. GRAFİKLER (Takım Dağılımı) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOL: Çubuk Grafik */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Takım Oyuncu Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {/* Recharts Grafiği */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.teamStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="teamName"
                  stroke="#888"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#888"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ fill: "#27272a" }}
                />
                <Bar
                  dataKey="athleteCount"
                  name="Oyuncu Sayısı"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                >
                  {summary.teamStats.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#2563eb" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SAĞ: Sakatlık Durumu (Görsel Kart) */}
        <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col justify-center items-center p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>

          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            {/* Daire Efekti */}
            <div className="absolute inset-0 rounded-full border-8 border-zinc-800"></div>
            {/* Kırmızı Daire Dilimi (Sakatlık varsa) */}
            {summary.activeInjuries > 0 && (
              <div className="absolute inset-0 rounded-full border-8 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rotate-45 animate-spin-slow"></div>
            )}

            <div className="text-center">
              <span className="text-5xl font-bold text-white">
                {summary.activeInjuries}
              </span>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                Sakat
              </p>
            </div>
          </div>

          <div className="mt-2 text-center z-10">
            <h3 className="text-white font-medium text-lg">Sağlık Raporu</h3>
            <p className="text-sm text-zinc-400 mt-2 px-4 leading-relaxed">
              Toplam{" "}
              <span className="text-white font-bold">
                {summary.totalAthletes}
              </span>{" "}
              sporcudan{" "}
              <span className="text-red-400 font-bold">
                {summary.activeInjuries}
              </span>{" "}
              tanesi şu an tedavi görüyor.
            </p>
          </div>
        </Card>
      </div>

      {/* 3. SON AKTİVİTELER TABLOSU */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Son Aktiviteler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Aktivite</TableHead>
                <TableHead className="text-right text-zinc-400">
                  Tarih
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.recentActivities.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={2}
                    className="text-center py-8 text-zinc-500"
                  >
                    Henüz aktivite yok.
                  </TableCell>
                </TableRow>
              ) : (
                summary.recentActivities.map((item, i) => (
                  <TableRow
                    key={i}
                    className="border-zinc-800 hover:bg-zinc-900/20"
                  >
                    <TableCell className="font-medium text-zinc-200 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                      {item.title}
                    </TableCell>
                    <TableCell className="text-right text-zinc-400 text-sm">
                      {item.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
