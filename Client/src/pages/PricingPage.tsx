import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} /> Ana Sayfaya Dön
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Esnek Fiyatlandırma</h1>
          <p className="text-zinc-400">
            Kulübünüzün büyüklüğüne göre en uygun paketi seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Amatör Paket */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Amatör</CardTitle>
              <CardDescription>Küçük kulüpler için</CardDescription>
              <div className="text-3xl font-bold mt-4">
                ₺499{" "}
                <span className="text-sm font-normal text-zinc-400">
                  /ay + %3 KDV
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> 100 Sporcu Kapasitesi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Temel İstatistikler
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Temel Güvenlik Özellikleri
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Sakatlık Takibi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Bildirim Sistemi (mobil)
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Bildirim Sistemi (mobil)
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Bildirim Sistemi (mobil)
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-zinc-800 hover:bg-zinc-700">
                  Seç
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Profesyonel Paket */}
          <Card className="bg-zinc-900 border-blue-500/50 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs px-3 py-1">
              POPÜLER
            </div>
            <CardHeader>
              <CardTitle>Profesyonel</CardTitle>
              <CardDescription>Gelişmiş akademiler için</CardDescription>
              <div className="text-3xl font-bold mt-4">
                ₺899{" "}
                <span className="text-sm font-normal text-zinc-400">
                  /ay + %5 KDV
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2">
                  <h3 /> Amatör Pakete Ek Olarak:
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> 300 Sporcu Kapasitesi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Detaylı Performans Analizi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Gelişmiş Güvenlik
                  Özellikleri
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Antrenman Planlama
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Antreman Video Analizi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Doküman indirme
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Hemen Başla
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Enterprise Paket */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Kulüp</CardTitle>
              <CardDescription>
                Süper Lig ve 1. Lig takımları için
              </CardDescription>
              <div className="text-3xl font-bold mt-4">
                Özel{" "}
                <span className="text-sm font-normal text-zinc-400">
                  /teklif + KDV
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2">
                  <h3 /> Profesyonel Pakete Ek Olarak:
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Özel Entegrasyon
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> 7/24 Destek
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Ek Sporcu Kapasitesi
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Bildirim Sistemi (mobil)
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Yerel Yedekleme seçeneği
                </li>
                <li className="flex gap-2">
                  <Check className="text-blue-500" /> Mobil Uygulama Desteği
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-zinc-800 hover:bg-zinc-700">
                  İletişime Geç
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
