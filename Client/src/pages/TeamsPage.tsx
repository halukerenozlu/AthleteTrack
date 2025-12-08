import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Users,
  Shield,
  Trash2,
  Search,
  Loader2,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner"; // Şık bildirimler
import { teamApi } from "@/api/teamApi";
import type { Team } from "@/types";

export default function TeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Arama State'i

  // Dialog State'leri
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // Silme Onay State'i
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

  // Form State'i
  const [formData, setFormData] = useState({ name: "", category: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- VERİLERİ GETİR ---
  const fetchTeams = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      const data = await teamApi.getMyTeams(user.id);
      setTeams(data);
    } catch {
      toast.error("Takımlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // --- ARAMA FİLTRESİ (Frontend Tarafında) ---
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- MODAL AÇMA (EKLEME veya DÜZENLEME) ---
  const openModal = (team?: Team) => {
    if (team) {
      // Düzenleme Modu
      setIsEditMode(true);
      setSelectedTeamId(team.id);
      setFormData({ name: team.name, category: team.category });
    } else {
      // Ekleme Modu
      setIsEditMode(false);
      setSelectedTeamId(null);
      setFormData({ name: "", category: "" });
    }
    setIsDialogOpen(true);
  };

  // --- FORMU KAYDET (EKLE veya GÜNCELLE) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.warning("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && selectedTeamId) {
        // GÜNCELLEME
        await teamApi.updateTeam(selectedTeamId, {
          ...formData,
          coachId: user.id,
        });
        toast.success("Takım başarıyla güncellendi! 🎉");
      } else {
        // YENİ EKLEME
        await teamApi.createTeam({
          ...formData,
          coachId: user.id,
        });
        toast.success("Yeni takım oluşturuldu! 🚀");
      }

      setIsDialogOpen(false);
      fetchTeams(); // Listeyi yenile
    } catch {
      toast.error("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TAKIM SİLME ---
  const confirmDelete = async () => {
    if (!teamToDelete) return;
    try {
      await teamApi.deleteTeam(teamToDelete);
      setTeams(teams.filter((t) => t.id !== teamToDelete));
      toast.success("Takım silindi.");
    } catch {
      toast.error("Silme başarısız.");
    } finally {
      setTeamToDelete(null); // Dialogu kapat
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ÜST KISIM */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Takımlarım
          </h2>
          <p className="text-zinc-400">
            Yönettiğiniz takımları buradan düzenleyebilirsiniz.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Takım Ekle
        </Button>
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Takım veya kategori ara..."
          className="pl-10 bg-zinc-900/50 border-zinc-800 text-white max-w-sm focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* İÇERİK ALANI */}
      {loading ? (
        <div className="text-zinc-500 text-center py-10 flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 mb-2" /> Yükleniyor...
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/20">
          <Shield className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium text-white">
            {searchQuery ? "Sonuç bulunamadı." : "Henüz takımınız yok."}
          </h3>
        </div>
      ) : (
        // KART LİSTESİ
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            // Card bileşenine 'relative' ve 'overflow-hidden' vererek süslemeyi kartın içine hapsediyoruz.
            <Card
              key={team.id}
              className="bg-zinc-900/50 border-zinc-800 hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              {/* SÜSLEME (Shield): 'absolute' pozisyon ile yerleştiriyoruz. */}
              {/* DÜZELTME: Butonla çakışmaması için 'bottom-4' yerine 'top-4' veya daha az negatif bir değer kullanabiliriz. */}
              {/* VEYA, butonu 'relative z-10' yaparak öne çıkarabiliriz. En temizi süslemeyi üstte tutmaktır. */}
              <Shield className="absolute -right-6 -top-6 h-36 w-36 text-zinc-800/20 group-hover:text-blue-900/20 transition-colors rotate-12 pointer-events-none" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-xl font-bold text-white truncate">
                  {team.name}
                </CardTitle>
                <div className="flex gap-2">
                  {/* DÜZENLE BUTONU */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => openModal(team)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {/* SİLME BUTONU (Onay kutusunu tetikler) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => setTeamToDelete(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 mb-4">
                  {team.category}
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Users className="h-4 w-4 text-zinc-500" />
                  <span className="font-bold text-white">
                    {team.playerCount}
                  </span>{" "}
                  Oyuncu
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-zinc-800/50">
                <Button
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 group-hover:bg-blue-600 group-hover:text-white transition-all"
                  onClick={() => navigate(`/dashboard/teams/${team.id}`)}
                >
                  Detaylar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- MODAL (DIALOG) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Takımı Düzenle" : "Yeni Takım Oluştur"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Takım bilgilerini aşağıdan yönetebilirsiniz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Takım Adı
              </Label>
              <Input
                id="name"
                placeholder="Örn: U19 Akademi"
                className="bg-zinc-950 border-zinc-800 focus:border-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-300">
                Kategori
              </Label>
              {/* DROPDOWN (SELECT) KULLANIMI */}
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800 focus:ring-blue-500">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="Altyapı">Altyapı</SelectItem>
                  <SelectItem value="A Takım">A Takım</SelectItem>
                  <SelectItem value="Futbol Okulu">Futbol Okulu</SelectItem>
                  <SelectItem value="Kadın Futbolu">Kadın Futbolu</SelectItem>
                  <SelectItem value="Amatör">Amatör</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : isEditMode ? (
                  "Güncelle"
                ) : (
                  "Oluştur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- SİLME ONAY KUTUSU (ALERT DIALOG) --- */}
      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={() => setTeamToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bu takımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz
              ve takıma bağlı veriler etkilenebilir.
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
