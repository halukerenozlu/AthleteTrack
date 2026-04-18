import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Ruler, Weight, Activity } from "lucide-react"; // Translated comment.
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
import { Badge } from "@/components/ui/badge";
import { athleteApi } from "@/api/athleteApi";
import type { Athlete } from "@/types";

export default function TeamDetailsPage() {
  const { id } = useParams();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const teamName = athletes.length > 0 ? athletes[0].teamName : "Takım Detayı";
  const API_URL = "http://localhost:5028/api";

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await athleteApi.getAthletesByTeam(parseInt(id));
        setAthletes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Translated comment.
  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height)
      return { value: "-", color: "text-zinc-500", label: "Veri Yok" };

    // Translated comment.
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const value = bmi.toFixed(1);

    if (bmi < 18.5) return { value, color: "text-blue-400", label: "Zayıf" };
    if (bmi >= 18.5 && bmi < 25)
      return { value, color: "text-emerald-400", label: "Normal" };
    if (bmi >= 25 && bmi < 30)
      return { value, color: "text-orange-400", label: "Fazla Kilo" };
    return { value, color: "text-red-500", label: "Obez" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Translated comment. */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/teams">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {loading ? "Yükleniyor..." : teamName}
          </h2>
          <p className="text-zinc-400 text-sm">
            Bu takımdaki kayıtlı oyuncular ve fiziksel analizleri.
          </p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Oyuncu Listesi ({athletes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Oyuncu</TableHead>
                <TableHead className="text-zinc-400">Mevki</TableHead>
                <TableHead className="text-zinc-400">Yaş</TableHead>
                <TableHead className="text-zinc-400">Boy</TableHead>
                <TableHead className="text-zinc-400">Kilo</TableHead>
                {/* Translated comment. */}
                <TableHead className="text-zinc-400">VKE (BMI)</TableHead>
                <TableHead className="text-right text-zinc-400">
                  İletişim
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-zinc-500"
                  >
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : athletes.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-zinc-500"
                  >
                    Bu takıma henüz oyuncu eklenmemiş.
                  </TableCell>
                </TableRow>
              ) : (
                athletes.map((athlete) => {
                  // Translated comment.
                  const bmi = calculateBMI(athlete.weight, athlete.height);

                  return (
                    <TableRow
                      key={athlete.id}
                      className="border-zinc-800 hover:bg-zinc-900/20"
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
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                        >
                          {athlete.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {athlete.age}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Ruler className="h-3 w-3 text-zinc-500" />{" "}
                          {athlete.height} cm
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Weight className="h-3 w-3 text-zinc-500" />{" "}
                          {athlete.weight} kg
                        </div>
                      </TableCell>

                      {/* Translated comment. */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold ${bmi.color} flex items-center gap-1`}
                          >
                            <Activity className="h-3 w-3" /> {bmi.value}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {bmi.label}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right text-zinc-400 text-sm">
                        {athlete.phone || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
