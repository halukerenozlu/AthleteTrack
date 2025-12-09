import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Check, X, UserCheck, Loader2 } from "lucide-react";
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
import { trainingApi } from "@/api/trainingApi";
import type { AttendanceItem } from "@/types";

export default function TrainingDetailsPage() {
  const { id } = useParams();
  //const navigate = useNavigate();
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const API_URL = "http://localhost:5028/api";

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await trainingApi.getAttendance(parseInt(id));
        setAttendanceList(data);
      } catch {
        toast.error("Yoklama listesi yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // --- DURUM DEĞİŞTİR (VAR/YOK) ---
  const togglePresence = (athleteId: number) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.athleteId === athleteId
          ? { ...item, isPresent: !item.isPresent }
          : item
      )
    );
  };

  // --- PUAN DEĞİŞTİR ---
  const handleRatingChange = (athleteId: number, value: string) => {
    const rating = parseInt(value);
    if (value !== "" && (isNaN(rating) || rating < 1 || rating > 10)) return; // 1-10 arası kontrol

    setAttendanceList((prev) =>
      prev.map((item) =>
        item.athleteId === athleteId
          ? { ...item, performanceRating: value === "" ? undefined : rating }
          : item
      )
    );
  };

  // --- KAYDET ---
  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await trainingApi.saveAttendance({
        trainingId: parseInt(id),
        attendances: attendanceList.map((a) => ({
          athleteId: a.athleteId,
          isPresent: a.isPresent,
          performanceRating: a.performanceRating,
        })),
      });
      toast.success("Yoklama başarıyla kaydedildi! ✅");
      // İsteğe bağlı: Kaydettikten sonra geri dön
      // navigate("/dashboard/trainings");
    } catch {
      toast.error("Kaydetme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- İSTATİSTİKLER ---
  const presentCount = attendanceList.filter((a) => a.isPresent).length;
  const totalCount = attendanceList.length;

  // YENİ: Anlık Ortalama Hesaplama
  const totalScore = attendanceList.reduce(
    (acc, curr) => acc + (curr.performanceRating || 0),
    0
  );
  // Puan girilen oyuncu sayısı (0 puanları ortalamaya katmayalım diye)
  const ratedCount = attendanceList.filter(
    (a) => a.performanceRating && a.performanceRating > 0
  ).length;
  const averageScore =
    ratedCount > 0 ? (totalScore / ratedCount).toFixed(1) : "-";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/trainings">
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">Yoklama Listesi</h2>
            <p className="text-zinc-400 text-sm">
              Katılım:{" "}
              <span className="text-emerald-400 font-bold">{presentCount}</span>{" "}
              / {totalCount} Oyuncu
            </p>
            <p className="text-zinc-400 border-l border-zinc-700 pl-4">
              Takım Puanı:{" "}
              <span className="text-yellow-400 font-bold">{averageScore}</span>{" "}
              / 10
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
          {isSaving ? "Kaydediliyor" : "Değişiklikleri Kaydet"}
        </Button>
      </div>

      {/* LİSTE */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-500" />
            Oyuncu Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Oyuncu</TableHead>
                <TableHead className="text-center text-zinc-400">
                  Durum
                </TableHead>
                <TableHead className="text-right text-zinc-400">
                  Puan (1-10)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-10 text-zinc-500"
                  >
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : attendanceList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-10 text-zinc-500"
                  >
                    Bu antrenmana atanmış oyuncu yok.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceList.map((item) => (
                  <TableRow
                    key={item.athleteId}
                    className="border-zinc-800 hover:bg-zinc-900/20"
                  >
                    {/* OYUNCU İSMİ */}
                    <TableCell className="font-medium text-white flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-700">
                        <AvatarImage
                          src={`${API_URL}/athletes/image/${item.athleteId}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          {item.athleteName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={
                          item.isPresent
                            ? "text-white"
                            : "text-zinc-500 line-through decoration-zinc-600"
                        }
                      >
                        {item.athleteName}
                      </span>
                    </TableCell>

                    {/* DURUM BUTONU (GELDİ / GELMEDİ) */}
                    <TableCell className="text-center">
                      <button
                        onClick={() => togglePresence(item.athleteId)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          item.isPresent
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20"
                        }`}
                      >
                        {item.isPresent ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {item.isPresent ? "Geldi" : "Gelmedi"}
                      </button>
                    </TableCell>

                    {/* PERFORMANS PUANI (INPUT) */}
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="-"
                          className={`w-16 h-8 text-center bg-zinc-950 border-zinc-800 text-white font-bold focus:border-blue-500 ${
                            !item.isPresent
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!item.isPresent}
                          value={item.performanceRating || ""}
                          onChange={(e) =>
                            handleRatingChange(item.athleteId, e.target.value)
                          }
                        />
                      </div>
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
