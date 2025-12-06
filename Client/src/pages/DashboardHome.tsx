import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Activity, Calendar, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardHome() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Sporcu"
          value="124"
          icon={<Users className="text-blue-500" />}
          change="+4 yeni"
        />
        <StatCard
          title="Aktif Sakatlık"
          value="3"
          icon={<Stethoscope className="text-red-500" />}
          change="2 kritik"
          trend="down"
        />
        <StatCard
          title="Katılım Oranı"
          value="%87"
          icon={<Activity className="text-emerald-500" />}
          change="Son hafta"
        />
        <StatCard
          title="Sıradaki Maç"
          value="2 Gün"
          icon={<Calendar className="text-purple-500" />}
          change="vs Beşiktaş U19"
        />
      </div>

      {/* GRAFİKLER (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Performans Trendi
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-zinc-800/50">
            <p className="text-zinc-500">
              Grafik Alanı (Recharts Buraya Gelecek)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Sakatlık Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-zinc-800/50">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/20 flex items-center justify-center">
              <span className="text-xl font-bold text-zinc-300">%12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SON AKTİVİTELER TABLOSU */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                <TableHead className="text-zinc-400">Sporcu Adı</TableHead>
                <TableHead className="text-zinc-400">Takım</TableHead>
                <TableHead className="text-zinc-400">Durum</TableHead>
                <TableHead className="text-right text-zinc-400">
                  Son Antrenman
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((item, i) => (
                <TableRow
                  key={i}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell className="font-medium text-zinc-200">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-zinc-400">{item.team}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Sakat" ? "destructive" : "default"
                      }
                      className={
                        item.status === "Aktif"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : ""
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-400">
                    {item.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Dummy Data (Backend gelene kadar sahte veri)
const recentActivities = [
  {
    name: "Ahmet Yılmaz",
    team: "U19 Takımı",
    status: "Aktif",
    date: "Bugün, 09:00",
  },
  {
    name: "Mehmet Demir",
    team: "A Takım",
    status: "Sakat",
    date: "Dün, 14:30",
  },
  {
    name: "Caner Erkin",
    team: "U16 Takımı",
    status: "Aktif",
    date: "28 Kasım",
  },
  { name: "Burak Yılmaz", team: "A Takım", status: "Aktif", date: "28 Kasım" },
  { name: "Arda Güler", team: "U19 Takımı", status: "Aktif", date: "27 Kasım" },
];
