import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog"; // <-- EKLENDİ
import { injuryApi } from "@/api/injuryApi";
import { athleteApi } from "@/api/athleteApi";
import type { Injury, InjuryType, Athlete } from "@/types";

export default function InjuriesPage() {
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog Data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [injuryToDelete, setInjuryToDelete] = useState<number | null>(null); // <-- SİLME İÇİN STATE

  // Dropdown Listeleri
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [injuryTypes, setInjuryTypes] = useState<InjuryType[]>([]);

  // Form
  const [formData, setFormData] = useState({
    athleteId: "",
    typeId: "",
    date: new Date().toISOString().split("T")[0], // Bugün
    returnDate: "",
    notes: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- VERİLERİ ÇEK ---
  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      const [injuriesData, athletesData, typesData] = await Promise.all([
        injuryApi.getInjuries(user.id),
        athleteApi.getAllAthletes(user.id),
        injuryApi.getTypes(),
      ]);
      setInjuries(injuriesData);
      setAthletes(athletesData);
      setInjuryTypes(typesData);
    } catch (error) {
      console.error(error);
      toast.error("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- SAKATLIK BİLDİR ---
  const handleCreate = async () => {
    if (!formData.athleteId || !formData.typeId || !formData.date) {
      toast.warning("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      await injuryApi.createInjury({
        athleteId: parseInt(formData.athleteId),
        injuryTypeId: parseInt(formData.typeId),
        injuryDate: new Date(formData.date).toISOString(),
        expectedReturnDate: formData.returnDate
          ? new Date(formData.returnDate).toISOString()
          : undefined,
        notes: formData.notes,
      });

      toast.success("Sakatlık kaydı oluşturuldu.");
      setIsDialogOpen(false);
      setFormData({
        athleteId: "",
        typeId: "",
        date: new Date().toISOString().split("T")[0],
        returnDate: "",
        notes: "",
      }); // Reset
      fetchData();
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DURUM DEĞİŞTİR (İYİLEŞTİ/SAKAT) ---
  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await injuryApi.toggleStatus(id);

      setInjuries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !currentStatus } : item
        )
      );

      if (currentStatus)
        toast.success("Oyuncu iyileşti olarak işaretlendi! 🎉");
      else toast.info("Oyuncu tekrar sakat listesine alındı.");
    } catch {
      toast.error("İşlem başarısız.");
    }
  };

  // --- SİLME İŞLEMİ (YENİ FONKSİYON) ---
  const confirmDelete = async () => {
    if (!injuryToDelete) return;

    try {
      await injuryApi.deleteInjury(injuryToDelete);
      setInjuries((prev) => prev.filter((i) => i.id !== injuryToDelete));
      toast.success("Kayıt silindi. 🗑️");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setInjuryToDelete(null); // Dialogu kapat
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Sağlık Merkezi
          </h2>
          <p className="text-zinc-400">
            Oyuncu sağlık durumlarını ve sakatlık geçmişini takip edin.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> Sakatlık Bildir
        </Button>
      </div>

      {/* LİSTE */}
      {loading ? (
        <div className="text-zinc-500 text-center py-10">
          <Loader2 className="animate-spin h-6 w-6 mx-auto" />
        </div>
      ) : injuries.length === 0 ? (
        <div className="p-10 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500">
          Kayıtlı sakatlık verisi yok.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {injuries.map((injury) => (
            <Card
              key={injury.id}
              className={`border transition-all ${
                injury.isActive
                  ? "bg-red-950/10 border-red-900/50 hover:border-red-500/50"
                  : "bg-zinc-900/50 border-zinc-800 opacity-75 hover:opacity-100"
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-zinc-800">
                    {injury.athleteImage ? (
                      <AvatarImage
                        src={`data:image/jpeg;base64,${injury.athleteImage}`}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">
                      {injury.athleteName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-white">
                      {injury.athleteName}
                    </CardTitle>
                    <div className="text-sm text-zinc-400">
                      {injury.teamName}
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    injury.isActive
                      ? "bg-red-600 text-white"
                      : "bg-emerald-600 text-white"
                  }
                >
                  {injury.isActive ? "Tedavide" : "İyileşti"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" /> Teşhis:
                  </span>
                  <span className="text-white font-medium">
                    {injury.injuryTypeName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Sakatlanma:
                  </span>
                  <span className="text-white">
                    {format(parseISO(injury.injuryDate), "d MMM yyyy", {
                      locale: tr,
                    })}
                  </span>
                </div>

                {injury.expectedReturnDate && injury.isActive && (
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-xs text-center text-blue-400">
                    Tahmini Dönüş:{" "}
                    {format(
                      parseISO(injury.expectedReturnDate),
                      "d MMMM yyyy",
                      { locale: tr }
                    )}
                  </div>
                )}

                {injury.notes && (
                  <div className="text-xs text-zinc-500 italic border-l-2 border-zinc-700 pl-2">
                    "{injury.notes}"
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 border-t border-zinc-800/50 flex justify-between">
                {/* SİLME BUTONU: Sadece ID'yi state'e atar */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-500 hover:text-red-500"
                  onClick={() => setInjuryToDelete(injury.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Sil
                </Button>

                <Button
                  size="sm"
                  variant={injury.isActive ? "default" : "outline"}
                  className={
                    injury.isActive
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "border-zinc-700"
                  }
                  onClick={() => toggleStatus(injury.id, injury.isActive)}
                >
                  {injury.isActive ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> İyileşti
                      İşaretle
                    </>
                  ) : (
                    "Tekrar Aktif Et"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Sakatlık Bildir</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Oyuncu</Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, athleteId: v })
                }
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Oyuncu seçin" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white z-[9999]">
                  {athletes.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.fullName} ({a.teamName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sakatlık Türü</Label>
              <Select
                onValueChange={(v) => setFormData({ ...formData, typeId: v })}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Teşhis seçin" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white z-[9999]">
                  {injuryTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sakatlanma Tarihi</Label>
                <Input
                  type="date"
                  className="bg-zinc-950 border-zinc-800 block w-full"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tahmini Dönüş (Opsiyonel)</Label>
                <Input
                  type="date"
                  className="bg-zinc-950 border-zinc-800 block w-full"
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Doktor Notları</Label>
              <Textarea
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="Durum açıklaması..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 w-full text-white"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- SİLME UYARISI (ALERT DIALOG) --- */}
      <AlertDialog
        open={!!injuryToDelete}
        onOpenChange={() => setInjuryToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Kaydı silmek istiyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bu işlem geri alınamaz. Sakatlık kaydı kalıcı olarak silinecektir.
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
