import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Plus, Upload, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { athleteApi } from "@/api/athleteApi";
import { teamApi } from "@/api/teamApi";
import { api } from "@/api/axiosConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { Team, Athlete } from "@/types";

interface Position {
  id: number;
  name: string;
  shortName: string;
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog and form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
    null
  );
  const [athleteToDelete, setAthleteToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    height: "",
    weight: "",
    phone: "",
    teamId: "",
    positionId: "",
    birthDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API_URL = "http://localhost:5028/api";

  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setLoading(true);
      const [athletesData, teamsData, positionsData] = await Promise.all([
        athleteApi.getAllAthletes(user.id),
        teamApi.getMyTeams(user.id),
        api.get<Position[]>("/lookups/positions").then((res) => res.data),
      ]);

      setAthletes(athletesData);
      setTeams(teamsData);
      setPositions(positionsData);
    } catch (error) {
      console.error("Data loading error", error);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (athlete?: Athlete) => {
    if (athlete) {
      setIsEditMode(true);
      setSelectedAthleteId(athlete.id);

      const names = athlete.fullName.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      const foundTeam = teams.find((t) => t.name === athlete.teamName);
      const foundPosition = positions.find((p) => p.name === athlete.position);

      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        jerseyNumber: athlete.jerseyNumber?.toString() || "",
        height: athlete.height?.toString() || "",
        weight: athlete.weight?.toString() || "",
        phone: athlete.phone || "",
        teamId: foundTeam ? foundTeam.id.toString() : "",
        positionId: foundPosition ? foundPosition.id.toString() : "",
        birthDate: athlete.birthDate ? athlete.birthDate.split("T")[0] : "",
      });
    } else {
      setIsEditMode(false);
      setSelectedAthleteId(null);
      setFormData({
        firstName: "",
        lastName: "",
        jerseyNumber: "",
        height: "",
        weight: "",
        phone: "",
        teamId: "",
        positionId: "",
        birthDate: "",
      });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  // --- SAVE ACTION (VALIDATIONS ADDED) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Required field validation
    if (!formData.teamId || !formData.positionId) {
      toast.warning("Lütfen takım ve mevki seçin.");
      return;
    }

    // 2. Extreme value validation (NEW) 🛡️
    const jersey = parseInt(formData.jerseyNumber);
    const height = parseInt(formData.height);
    const weight = parseFloat(formData.weight);

    if (jersey > 99 || jersey < 1) {
      toast.warning("Forma numarası 1-99 arasında olmalıdır.");
      return;
    }
    if (height > 250 || height < 100) {
      toast.warning("Boy 100-250 cm arasında olmalıdır.");
      return;
    }
    if (weight > 150 || weight < 50) {
      toast.warning("Kilo 50-150 kg arasında olmalıdır.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        jerseyNumber: formData.jerseyNumber ? jersey : undefined,
        height: height || 0,
        weight: weight || 0,
        phone: formData.phone,
        teamId: parseInt(formData.teamId),
        positionId: parseInt(formData.positionId),
        birthDate: formData.birthDate || new Date().toISOString(),
      };

      if (isEditMode && selectedAthleteId) {
        await athleteApi.updateAthlete(selectedAthleteId, payload);

        if (selectedFile) {
          await athleteApi.uploadPhoto(selectedAthleteId, selectedFile);
        }
        toast.success("Sporcu güncellendi! ✅");
      } else {
        const newAthlete = await athleteApi.addAthlete(payload);
        const createdAthlete = newAthlete as { id: number };

        if (selectedFile && createdAthlete.id) {
          await athleteApi.uploadPhoto(createdAthlete.id, selectedFile);
        }
        toast.success("Sporcu eklendi! 🎉");
      }

      setIsDialogOpen(false);
      fetchData();
    } catch {
      toast.error("İşlem başarısız.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!athleteToDelete) return;
    try {
      await athleteApi.deleteAthlete(athleteToDelete);
      setAthletes(athletes.filter((a) => a.id !== athleteToDelete));
      toast.success("Sporcu silindi.");
    } catch {
      toast.error("Silme başarısız.");
    } finally {
      setAthleteToDelete(null);
    }
  };

  const filteredAthletes = athletes.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Sporcular
          </h2>
          <p className="text-zinc-400">Tüm takımlardaki oyuncu havuzunuz.</p>
        </div>

        <Button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Sporcu Ekle
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="İsim, takım veya mevki ara..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">
            Oyuncu Listesi ({filteredAthletes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Oyuncu</TableHead>
                <TableHead className="text-zinc-400">Takım</TableHead>
                <TableHead className="text-zinc-400">Mevki</TableHead>
                <TableHead className="text-zinc-400">Yaş</TableHead>
                <TableHead className="text-zinc-400">Forma</TableHead>
                <TableHead className="text-right text-zinc-400">
                  İşlem
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
              ) : filteredAthletes.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-zinc-500"
                  >
                    {searchTerm
                      ? "Sonuç bulunamadı."
                      : "Henüz kayıtlı sporcu yok."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAthletes.map((athlete) => (
                  <TableRow
                    key={athlete.id}
                    className="border-zinc-800 hover:bg-transparent transition-colors"
                  >
                    <TableCell className="font-medium text-white flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-700">
                        {athlete.hasImage ? (
                          <AvatarImage
                            src={`${API_URL}/athletes/image/${
                              athlete.id
                            }?v=${Date.now()}`}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          {athlete.fullName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {athlete.fullName}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300 border-zinc-700"
                      >
                        {athlete.teamName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                      >
                        {athlete.position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {athlete.age > 0 ? athlete.age : "-"}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      #{athlete.jerseyNumber || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                          onClick={() => openModal(athlete)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Profil
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => setAthleteToDelete(athlete.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Sporcu Düzenle" : "Yeni Sporcu Kaydı"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Takımınıza yeni bir oyuncu eklemek için bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="flex justify-center mb-4">
              <div
                className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-zinc-800/80 transition-all overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <Upload className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs">Fotoğraf</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-zinc-300">
                  Ad
                </Label>
                <Input
                  id="firstName"
                  className="bg-zinc-950 border-zinc-800"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-zinc-300">
                  Soyad
                </Label>
                <Input
                  id="lastName"
                  className="bg-zinc-950 border-zinc-800"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Takım</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(v) => setFormData({ ...formData, teamId: v })}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Takım seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Mevki</Label>
                <Select
                  value={formData.positionId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, positionId: v })
                  }
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Mevki seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} ({p.shortName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Protection against extreme values added */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jersey" className="text-zinc-300">
                  Forma No
                </Label>
                <Input
                  id="jersey"
                  type="number"
                  max={99}
                  min={1}
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.jerseyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, jerseyNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-zinc-300">
                  Boy (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  max={250}
                  min={100}
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-zinc-300">
                  Kilo (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  max={150}
                  min={50}
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-zinc-300">
                  Doğum Tarihi
                </Label>
                {/* Date constraint */}
                <Input
                  id="birthDate"
                  type="date"
                  max="9999-12-31"
                  className="bg-zinc-950 border-zinc-800 block w-full"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  className="bg-zinc-950 border-zinc-800"
                  placeholder="0555..."
                  maxLength={11}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
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
                  "Kaydet"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!athleteToDelete}
        onOpenChange={() => setAthleteToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sporcuyu silmek istiyor musunuz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bu işlem geri alınamaz. Sporcuya ait tüm geçmiş veriler
              (sakatlıklar, istatistikler) silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
