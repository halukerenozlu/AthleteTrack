import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamDetailsPage() {
  const { id } = useParams(); // URL'den ID'yi al (teams/1)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/teams">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-white">
          Takım Detayı (ID: {id})
        </h2>
      </div>
      <div className="p-10 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500">
        Burada seçilen takımın oyuncu listesi ve grafikleri olacak.
      </div>
    </div>
  );
}
