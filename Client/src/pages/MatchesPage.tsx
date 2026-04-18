import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Shield,
  Trash2,
  Loader2,
  Trophy,
  PlayCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { matchApi } from "@/api/matchApi";
import { teamApi } from "@/api/teamApi";
import type { Match, Team } from "@/types";

export default function MatchesPage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog & Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null);

  // Team List (for dropdown)
  const [teams, setTeams] = useState<Team[]>([]);

  // Form
  const [formData, setFormData] = useState({
    teamId: "",
    opponent: "",
    date: "",
    time: "14:00",
    location: "home", // home veya away
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      const [matchesData, teamsData] = await Promise.all([
        matchApi.getMatches(user.id),
        teamApi.getMyTeams(user.id),
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
    } catch {
      toast.error("Fikstür yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ADD MATCH ---
  const handleCreate = async () => {
    if (!formData.teamId || !formData.opponent || !formData.date) {
      toast.warning("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTimeStr = `${formData.date}T${formData.time}:00`;

      await matchApi.createMatch({
        matchDate: new Date(dateTimeStr).toISOString(),
        opponent: formData.opponent,
        isHome: formData.location === "home",
        teamId: parseInt(formData.teamId),
      });

      toast.success("Maç fikstüre eklendi! ⚽");
      setIsDialogOpen(false);
      setFormData({ ...formData, opponent: "", date: "" }); // Reset
      fetchData();
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE ---
  const confirmDelete = async () => {
    if (!matchToDelete) return;
    try {
      await matchApi.deleteMatch(matchToDelete);
      setMatches((prev) => prev.filter((m) => m.id !== matchToDelete));
      toast.success("Maç silindi.");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setMatchToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Fikstür & Maçlar
          </h2>
          <p className="text-zinc-400">
            Takımlarınızın maç takvimini ve skorlarını yönetin.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Maç Ekle
        </Button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-zinc-500 text-center py-10">
          <Loader2 className="animate-spin h-6 w-6 mx-auto" />
        </div>
      ) : matches.length === 0 ? (
        <div className="p-10 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500">
          Henüz planlanmış maç yok.
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card
              key={match.id}
              className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left side: Date and Team */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg p-3 w-20 h-20 text-center">
                    <span className="text-xs text-zinc-500 uppercase font-bold">
                      {format(parseISO(match.matchDate), "MMM", { locale: tr })}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {format(parseISO(match.matchDate), "dd")}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {format(parseISO(match.matchDate), "HH:mm")}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="text-blue-400 border-blue-500/30 bg-blue-500/10"
                      >
                        {match.teamName}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-400"
                      >
                        {match.isHome ? "İç Saha" : "Deplasman"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-zinc-500" />
                      vs {match.opponent}
                    </h3>
                  </div>
                </div>

                {/* Orta: Skor (Varsa) */}
                <div className="text-center min-w-[100px]">
                  {match.status === "Tamamlandı" ? (
                    <div className="text-2xl font-black text-white bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-800">
                      {match.teamScore} - {match.opponentScore}
                    </div>
                  ) : (
                    <Badge className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">
                      Planlandı
                    </Badge>
                  )}
                </div>

                {/* Right: Actions (buttons here) */}
                <div className="flex items-center gap-2">
                  {/* FIX: Show button for both Completed and Planned statuses */}
                  {match.status === "Tamamlandı" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() =>
                        navigate(`/dashboard/matches/${match.id}/stats`)
                      }
                    >
                      <Trophy className="h-4 w-4 mr-2" /> İstatistikler
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                      onClick={() =>
                        navigate(`/dashboard/matches/${match.id}/stats`)
                      }
                    >
                      <PlayCircle className="h-4 w-4 mr-2" /> Skor Gir / Başlat
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => setMatchToDelete(match.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Yeni Maç Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Takım</Label>
              <Select
                onValueChange={(v) => setFormData({ ...formData, teamId: v })}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Takım seçin" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white z-[9999]">
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rakip Takım</Label>
                <Input
                  className="bg-zinc-950 border-zinc-800 text-white"
                  placeholder="Örn: Galatasaray U19"
                  value={formData.opponent}
                  onChange={(e) =>
                    setFormData({ ...formData, opponent: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Saha</Label>
                <Select
                  onValueChange={(v) =>
                    setFormData({ ...formData, location: v })
                  }
                  defaultValue="home"
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white z-[9999]">
                    <SelectItem value="home">İç Saha (Ev Sahibi)</SelectItem>
                    <SelectItem value="away">Deplasman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tarih</Label>
                <Input
                  type="date"
                  max="9999-12-31"
                  className="bg-zinc-950 border-zinc-800 text-white block w-full"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Saat</Label>
                <Input
                  type="time"
                  className="bg-zinc-950 border-zinc-800 text-white block w-full"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 w-full text-white"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE WARNING --- */}
      <AlertDialog
        open={!!matchToDelete}
        onOpenChange={() => setMatchToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Maçı silmek istiyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
