import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft, Loader2 } from "lucide-react";
import { authApi } from "@/api/authApi"; // API fonksiyonumuz

export default function LoginPage() {
  const navigate = useNavigate();

  // State'ler (Verileri tutmak için)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- YENİ EKLENEN KISIM (DOMAİN KONTROLÜ) ---
    if (!email.toLowerCase().endsWith("@athletetrack.com")) {
      setError(
        "Sadece kurumsal (@athletetrack.com) e-posta adresleri ile giriş yapabilirsiniz."
      );
      setLoading(false);
      return; // İşlemi durdur, sunucuya gitme.
    }
    // -------------------------------------------
    try {
      // 1. API'ye istek at
      const user = await authApi.login({ email, password });

      // 2. Başarılıysa kullanıcıyı tarayıcı hafızasına (LocalStorage) kaydet
      // (Böylece diğer sayfalarda ismini gösterebileceğiz)
      localStorage.setItem("user", JSON.stringify(user));

      // 3. Dashboard'a yönlendir
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setError("Giriş başarısız! Email veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Ana Sayfaya Dön
      </Link>

      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-sm text-white relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Koç Girişi
          </CardTitle>
          <CardDescription className="text-gray-400">
            AthleteTrack paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hata Mesajı */}
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek: kerem@athletetrack.com"
                required
                className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-200">
                  Şifre
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Şifremi unuttum?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş
                  Yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Hesabınız yok mu?{" "}
            <Link
              to="/contact"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Yönetici ile iletişime geçin
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
