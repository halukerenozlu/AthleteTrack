import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Trash2,
  Loader2,
} from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom"; // Translated comment.
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/alert-dialog"; // Translated comment.
import { trainingApi } from "@/api/trainingApi";
import { teamApi } from "@/api/teamApi";
import type { Training, TrainingType, Team } from "@/types";

export default function TrainingsPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  // Translated comment.
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null); // Translated comment.

  const [teams, setTeams] = useState<Team[]>([]);
  const [types, setTypes] = useState<TrainingType[]>([]);

  const [formData, setFormData] = useState({
    teamId: "",
    typeId: "",
    time: "17:00",
    duration: "90",
    notes: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Translated comment.
  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      const [trainingsData, teamsData, typesData] = await Promise.all([
        trainingApi.getTrainings(user.id),
        teamApi.getMyTeams(user.id),
        trainingApi.getTypes(),
      ]);
      setTrainings(trainingsData);
      setTeams(teamsData);
      setTypes(typesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Translated comment.
  const handleCreate = async () => {
    if (!date || !formData.teamId || !formData.typeId) {
      toast.warning("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const finalDateTime = new Date(`${dateString}T${formData.time}:00`);

      await trainingApi.createTraining({
        date: finalDateTime.toISOString(),
        durationMinutes: parseInt(formData.duration),
        notes: formData.notes,
        teamId: parseInt(formData.teamId),
        trainingTypeId: parseInt(formData.typeId),
      });

      toast.success("Antrenman başarıyla planlandı! 📅");
      setIsDialogOpen(false);
      setFormData((prev) => ({ ...prev, notes: "" }));
      fetchData();
    } catch {
      toast.error("Planlama başarısız.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Translated comment.
  const confirmDelete = async () => {
    if (!trainingToDelete) return; // Translated comment.

    try {
      await trainingApi.deleteTraining(trainingToDelete);

      // Translated comment.
      setTrainings((prev) => prev.filter((t) => t.id !== trainingToDelete));

      toast.success("Antrenman ve yoklamalar silindi. 🗑️");
    } catch (error) {
      console.error(error);
      toast.error("Silme işlemi başarısız oldu.");
    } finally {
      setTrainingToDelete(null); // Translated comment.
    }
  };

  const selectedDayTrainings = trainings.filter(
    (t) => date && isSameDay(parseISO(t.date), date)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Antrenman Takvimi
          </h2>
          <p className="text-zinc-400">
            Takımlarınızın antrenman programını yönetin.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Antrenman Planla
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Translated comment. */}
        <div className="lg:col-span-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={tr}
                className="rounded-md border border-zinc-800 bg-zinc-950 text-zinc-200 p-3"
                classNames={{
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
                  day_today:
                    "bg-zinc-800 text-white font-bold border border-zinc-600",
                  day: "hover:bg-zinc-800 hover:text-white rounded-md transition-colors w-9 h-9 text-zinc-300",
                  head_cell:
                    "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem]",
                  caption_label: "text-white font-medium pl-2",
                  nav_button:
                    "border border-zinc-800 hover:bg-zinc-800 text-white",
                }}
                modifiers={{
                  hasTraining: (day) =>
                    trainings.some((t) => isSameDay(parseISO(t.date), day)),
                }}
                modifiersStyles={{
                  hasTraining: {
                    textDecoration: "underline",
                    textDecorationColor: "#2563eb",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800 p-4 text-center">
              <span className="text-2xl font-bold text-white">
                {trainings.length}
              </span>
              <p className="text-xs text-zinc-500">Toplam İdman</p>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800 p-4 text-center">
              <span className="text-2xl font-bold text-emerald-500">
                {trainings.filter((t) => new Date(t.date) > new Date()).length}
              </span>
              <p className="text-xs text-zinc-500">Gelecek İdman</p>
            </Card>
          </div>
        </div>

        {/* Translated comment. */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <CalendarIcon className="text-blue-500" />
            {date
              ? format(date, "d MMMM yyyy, EEEE", { locale: tr })
              : "Tarih Seçiniz"}
          </h3>

          {loading ? (
            <div className="text-zinc-500 text-center py-10">
              <Loader2 className="animate-spin h-6 w-6 mx-auto" />
            </div>
          ) : selectedDayTrainings.length === 0 ? (
            <div className="p-10 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500">
              Bugün için planlanmış antrenman yok.
            </div>
          ) : (
            selectedDayTrainings.map((training) => (
              <Card
                key={training.id}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: training.colorCode || "#2563eb",
                      }}
                      className="text-white border-0"
                    >
                      {training.typeName}
                    </Badge>
                    <span className="text-lg font-bold text-white">
                      {training.teamName}
                    </span>
                  </div>
                  {/* Translated comment. */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTrainingToDelete(training.id)}
                    className="text-zinc-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {format(parseISO(training.date), "HH:mm")} (
                      {training.durationMinutes} dk)
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-emerald-500" />
                      {training.participantCount} Oyuncu
                    </div>
                  </div>
                  {training.notes && (
                    <div className="mt-3 p-3 bg-zinc-950 rounded-md text-sm text-zinc-300 border border-zinc-800">
                      <span className="text-zinc-500 font-semibold mr-2">
                        Not:
                      </span>
                      {training.notes}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                    {/* Translated comment. */}
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white"
                      onClick={() =>
                        navigate(`/dashboard/trainings/${training.id}`)
                      }
                    >
                      Yoklama Al / Detay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Translated comment. */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Yeni Antrenman Planla</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Takım</Label>
                <Select
                  onValueChange={(v) => setFormData({ ...formData, teamId: v })}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Seçiniz" />
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
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select
                  onValueChange={(v) => setFormData({ ...formData, typeId: v })}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white z-[9999]">
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Saat</Label>
                <Input
                  type="time"
                  className="bg-zinc-950 border-zinc-800 text-white"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Süre (dk)</Label>
                <Input
                  type="number"
                  className="bg-zinc-950 border-zinc-800 text-white"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notlar</Label>
              <Textarea
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="İdman içeriği..."
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Planla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Translated comment. */}
      {/* Translated comment. */}
      <AlertDialog
        open={!!trainingToDelete}
        onOpenChange={() => setTrainingToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Antrenmanı silmek istiyor musunuz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bu işlem geri alınamaz. Antrenmana ait tüm yoklama verileri de
              silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
              İptal
            </AlertDialogCancel>

            {/* Translated comment. */}
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
