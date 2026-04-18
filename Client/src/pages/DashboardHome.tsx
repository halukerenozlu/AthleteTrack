import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Activity,
  Calendar,
  Stethoscope,
  Trophy,
  Medal,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard"; // StatCard component
import { dashboardApi } from "@/api/dashboardApi";
import type { DashboardSummary } from "@/types";
import { toast } from "sonner";
// Charts for Recharts
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
      // Fetch summary data from backend
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

  // If data is missing or an error occurs
  if (!summary) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. STAT CARDS (Live Data) */}
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

      {/* 2. CHARTS (Team Distribution and Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Bar chart (team athlete counts) */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Takım Oyuncu Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
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

        {/* RIGHT: Injury status (visual card) */}
        <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col justify-center items-center p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>

          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            {/* Daire Efekti */}
            <div className="absolute inset-0 rounded-full border-8 border-zinc-800"></div>
            {/* Red circle segment (renders when injuries exist) */}
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

      {/* 3. LOWER SECTION: ACTIVITIES AND LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: RECENT ACTIVITIES (wide - 2 units) */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
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
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.type === "Injury"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          } shadow-[0_0_8px_rgba(59,130,246,0.8)]`}
                        ></div>
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

        {/* RIGHT: TOP PERFORMERS / LEADERBOARD (narrow - 1 unit) */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Liderlik Tablosu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* A. Top scorers */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" /> Gol Krallığı
              </h4>
              <div className="space-y-3">
                {summary.topScorers.length === 0 ? (
                  <p className="text-xs text-zinc-500">Veri yok</p>
                ) : (
                  summary.topScorers.map((p) => (
                    <div
                      key={p.athleteId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-700">
                          {p.image ? (
                            <AvatarImage
                              src={`data:image/jpeg;base64,${p.image}`}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-zinc-800 text-xs">
                            {p.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {p.name}
                          </p>
                          <p className="text-xs text-zinc-500">{p.teamName}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-orange-400 font-bold"
                      >
                        {p.value} Gol
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-800 my-4"></div>

            {/* B. Highest rated players */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <Medal className="h-4 w-4 text-purple-500" /> En Yüksek Puan
              </h4>
              <div className="space-y-3">
                {summary.topRatedPlayers.length === 0 ? (
                  <p className="text-xs text-zinc-500">Veri yok</p>
                ) : (
                  summary.topRatedPlayers.map((p) => (
                    <div
                      key={p.athleteId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-700">
                          {p.image ? (
                            <AvatarImage
                              src={`data:image/jpeg;base64,${p.image}`}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-zinc-800 text-xs">
                            {p.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {p.name}
                          </p>
                          <p className="text-xs text-zinc-500">{p.teamName}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-purple-400 font-bold"
                      >
                        {p.value}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
