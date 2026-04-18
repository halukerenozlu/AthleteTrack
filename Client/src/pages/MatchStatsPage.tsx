import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  Trophy,
  Timer,
  Footprints,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { matchStatsApi } from "@/api/matchStatsApi";
import type { MatchStatItem } from "@/types";

export default function MatchStatsPage() {
  const { id } = useParams();
  const [stats, setStats] = useState<MatchStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await matchStatsApi.getStats(parseInt(id));
        setStats(data);
      } catch {
        toast.error("Veriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Translated comment.
  const handleChange = (
    athleteId: number,
    field: keyof MatchStatItem,
    value: string
  ) => {
    const numValue = parseFloat(value); // Translated comment.
    if (isNaN(numValue) && value !== "") return; // Translated comment.

    setStats((prev) =>
      prev.map((item) =>
        item.athleteId === athleteId
          ? { ...item, [field]: value === "" ? 0 : numValue }
          : item
      )
    );
  };

  // Translated comment.
  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await matchStatsApi.saveStats({
        matchId: parseInt(id),
        stats: stats.map((s) => ({
          athleteId: s.athleteId,
          minutesPlayed: s.minutesPlayed,
          goals: s.goals,
          assists: s.assists,
          rating: s.rating,
          distanceCovered: s.distanceCovered,
        })),
      });
      toast.success("İstatistikler kaydedildi! Skor güncellendi. ⚽");
    } catch {
      toast.error("Kaydetme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Translated comment. */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/matches">
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">Maç Karnesi</h2>
            <p className="text-zinc-400 text-sm">
              Oyuncu performanslarını girin.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
        >
          {isSaving ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Kaydediliyor" : "Kaydet & Skoru İşle"}
        </Button>
      </div>

      {/* Translated comment. */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Kadro & İstatistikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400 w-[250px]">
                  Oyuncu
                </TableHead>
                <TableHead className="text-center text-zinc-400">
                  <div className="flex items-center justify-center gap-1">
                    <Timer className="w-3 h-3" /> Süre (dk)
                  </div>
                </TableHead>
                <TableHead className="text-center text-zinc-400">Gol</TableHead>
                <TableHead className="text-center text-zinc-400">
                  Asist
                </TableHead>
                <TableHead className="text-center text-zinc-400">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" /> Puan (1-10)
                  </div>
                </TableHead>
                <TableHead className="text-center text-zinc-400">
                  <div className="flex items-center justify-center gap-1">
                    <Footprints className="w-3 h-3" /> Koşu (km)
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-zinc-500"
                  >
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : stats.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-zinc-500"
                  >
                    Takımda oyuncu yok.
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((item) => (
                  <TableRow
                    key={item.athleteId}
                    className="border-zinc-800 hover:bg-zinc-900/20"
                  >
                    {/* Translated comment. */}
                    <TableCell className="font-medium text-white flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-700">
                        {item.athleteImage ? (
                          <AvatarImage
                            src={`data:image/jpeg;base64,${item.athleteImage}`}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          {item.athleteName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white">{item.athleteName}</div>
                        <div className="text-xs text-zinc-500">
                          {item.position} #{item.jerseyNumber}
                        </div>
                      </div>
                    </TableCell>

                    {/* Translated comment. */}
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        className="w-16 h-8 text-center bg-zinc-950 border-zinc-800 text-white mx-auto"
                        value={item.minutesPlayed}
                        onChange={(e) =>
                          handleChange(
                            item.athleteId,
                            "minutesPlayed",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        className="w-16 h-8 text-center bg-zinc-950 border-zinc-800 text-white font-bold mx-auto focus:border-green-500"
                        value={item.goals}
                        onChange={(e) =>
                          handleChange(item.athleteId, "goals", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        className="w-16 h-8 text-center bg-zinc-950 border-zinc-800 text-white mx-auto"
                        value={item.assists}
                        onChange={(e) =>
                          handleChange(
                            item.athleteId,
                            "assists",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        className="w-16 h-8 text-center bg-zinc-950 border-zinc-800 text-white mx-auto"
                        max={10}
                        value={item.rating}
                        onChange={(e) =>
                          handleChange(item.athleteId, "rating", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        className="w-20 h-8 text-center bg-zinc-950 border-zinc-800 text-white mx-auto"
                        step="0.1"
                        value={item.distanceCovered}
                        onChange={(e) =>
                          handleChange(
                            item.athleteId,
                            "distanceCovered",
                            e.target.value
                          )
                        }
                      />
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
