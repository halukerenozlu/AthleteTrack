import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox"; // Translated comment.
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Loader2,
  Moon,
  Sun,
  LockKeyhole,
} from "lucide-react"; // Translated comment.
import { authApi } from "@/api/authApi";
import { toast } from "sonner"; // Translated comment.

export default function LoginPage() {
  const navigate = useNavigate();

  // Translated comment.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translated comment.
  const [isAgreed, setIsAgreed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Translated comment.
  useEffect(() => {
    // Translated comment.
    const savedTheme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(savedTheme === "dark");

    // Translated comment.
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);

    // Translated comment.
    toast.info("Tema değiştirildi.", {
      description:
        "Not: Bu özellik deneyseldir ve şimdilik sadece giriş ekranında aktiftir.",
      duration: 4000,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Translated comment.
    if (!isAgreed) {
      setError("Lütfen giriş yapabilmek için gizlilik sözleşmesini onaylayın.");
      setLoading(false);
      return;
    }

    // Translated comment.
    if (!email.toLowerCase().endsWith("@athletetrack.com")) {
      setError(
        "Sadece kurumsal (@athletetrack.com) e-posta adresleri ile giriş yapabilirsiniz."
      );
      setLoading(false);
      return;
    }

    try {
      const user = await authApi.login({ email, password });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error: unknown) {
      // Translated comment.
      const err = error as { response?: { data?: { message?: string } } };
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Giriş başarısız! Email veya şifre hatalı."
      );
    } finally {
      setLoading(false);
    }
  };

  // Translated comment.
  const scrollToFooter = () => {
    navigate("/");
    // Translated comment.
    setTimeout(() => {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      {/* Translated comment. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Translated comment. */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Ana Sayfaya Dön
        </Link>

        {/* Translated comment. */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-background border-input hover:bg-accent hover:text-accent-foreground"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Translated comment. */}
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border relative z-10 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Koç Girişi
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            AthleteTrack paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Translated comment. */}
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center flex items-center justify-center gap-2">
              <LockKeyhole className="h-4 w-4" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Translated comment. */}
            <div className="flex items-start space-x-2 p-3 border border-border rounded-md bg-muted/30">
              <Checkbox
                id="terms"
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                >
                  Kullanım şartlarını onaylıyorum
                </Label>
                <p className="text-xs text-muted-foreground">
                  Giriş yapabilmek için{" "}
                  <span className="underline cursor-pointer hover:text-primary">
                    KVKK
                  </span>{" "}
                  ve{" "}
                  <span className="underline cursor-pointer hover:text-primary">
                    Gizlilik Sözleşmesi
                  </span>
                  'ni okudum, kabul ediyorum.
                </p>
              </div>
            </div>

            {/* Translated comment. */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${
                !isAgreed ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek: kerem@athletetrack.com"
                  required
                  disabled={!isAgreed} // Translated comment.
                  className="bg-background border-input focus:border-blue-500 text-foreground placeholder:text-muted-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Şifre
                  </Label>
                  {/* Translated comment. */}
                  <button
                    type="button"
                    onClick={scrollToFooter}
                    className="text-sm text-blue-500 hover:text-blue-400 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Şifremi unuttum?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={!isAgreed} // Translated comment.
                  className="bg-background border-input focus:border-blue-500 text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !isAgreed} // Translated comment.
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
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Hesabınız yok mu?{" "}
            <button
              onClick={scrollToFooter}
              className="text-blue-500 hover:text-blue-400 hover:underline bg-transparent border-0 cursor-pointer"
            >
              Yönetici ile iletişime geçin
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
