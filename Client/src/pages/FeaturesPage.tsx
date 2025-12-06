import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const featuresList = [
    "Antrenman Katılım İstatistikleri",
    "Sporcu Performans Grafikleri",
    "Sporcu demografik bilgilerinin takibi",
    "Maç Takvimi Yönetimi",
    "Antrenman Planlama ve Takibi",
    "Sakatlık Yönetimi ve Raporlama",
    "Performans Analizi Araçları",
    "Bildirim ve Hatırlatıcı Sistemi",
    "Mobil Uyumlu Tasarım",
    "Gelişmiş Güvenlik Özellikleri",
    "Kulüp İçi İletişim Araçları",
    "Ve daha fazlası...",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} /> Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Tüm Özellikler
        </h1>
        <p className="text-xl text-zinc-400 mb-12">
          AthleteTrack, bir spor kulübünün ihtiyaç duyacağı her şeyi tek bir
          platformda sunar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresList.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg"
            >
              <CheckCircle2 className="text-blue-500 mr-4" />
              <span className="text-lg">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Denemeye Hazır mısınız?</h3>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Hemen Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
