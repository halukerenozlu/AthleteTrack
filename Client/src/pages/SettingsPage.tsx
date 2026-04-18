import { useState, useRef } from "react";
import {
  User,
  Lock,
  Mail,
  Phone,
  Upload,
  AlertTriangle,
  Save,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authApi } from "@/api/authApi";

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email?: string; // Backend'den gelmeli
  role: string;
  isTemporaryPassword?: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = "http://localhost:5028/api";

  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // --- 1. PHOTO UPLOAD ---
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Dosya boyutu 2MB'dan büyük olamaz!");
      return;
    }

    try {
      await authApi.uploadPhoto(user.id, file);
      alert("Fotoğraf yüklendi! (Sayfayı yenileyince görünecek) 📸");
    } catch {
      alert("Fotoğraf yüklenirken hata oluştu.");
    }
  };

  // --- 2. PROFILE UPDATE ---
  const handleProfileUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const cleanName = fullName.trim();

      await authApi.updateProfile(user.id, {
        fullName: cleanName,
        phoneNumber: phone,
      });

      const updatedUser = { ...user, fullName: cleanName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFullName(cleanName);

      alert("Profil başarıyla güncellendi! ✅");
    } catch {
      alert("Güncelleme başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. PASSWORD CHANGE ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwords.new.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalıdır!");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("Yeni şifreler eşleşmiyor! ❌");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(user.id, {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      alert("Şifreniz başarıyla değiştirildi! 🔒");

      const updatedUser = { ...user, isTemporaryPassword: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: unknown) {
      const err = error as ApiError;
      alert(
        "Hata: " + (err.response?.data?.message || "Şifre değiştirilemedi.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-white">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Ayarlar
        </h2>
        <p className="text-zinc-400">
          Profil bilgilerinizi ve hesap güvenliğinizi yönetin.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" /> Profil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Shield className="w-4 h-4 mr-2" /> Güvenlik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-zinc-900/50 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription className="text-zinc-400">
                Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-zinc-700">
                  <AvatarImage
                    src={`${API_URL}/auth/profile-image/${
                      user.id
                    }?v=${Date.now()}`}
                  />
                  <AvatarFallback className="text-2xl bg-zinc-800">
                    {user.fullName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={handlePhotoClick}
                    variant="outline"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Fotoğraf Değiştir
                  </Button>
                  <p className="text-xs text-zinc-500">
                    JPG, GIF veya PNG. Maksimum 2MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Ad Soyad</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Ünvan / Rol</Label>
                  <Input
                    id="role"
                    defaultValue={user.role}
                    disabled
                    className="bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Adresi</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    {/* FIX: user.email is now displayed dynamically */}
                    <Input
                      id="email"
                      defaultValue={user.email}
                      disabled
                      className="pl-9 bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      id="phone"
                      placeholder="0555 123 45 67"
                      value={phone}
                      maxLength={11}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhone(val);
                      }}
                      className="pl-9 bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 ml-auto"
              >
                <Save className="w-4 h-4 mr-2" />{" "}
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-zinc-900/50 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Şifre ve Güvenlik</CardTitle>
              <CardDescription className="text-zinc-400">
                Hesap şifrenizi yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.isTemporaryPassword ? (
                <Alert
                  variant="destructive"
                  className="bg-yellow-500/10 border-yellow-500/50 text-yellow-500"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Güvenlik Uyarısı
                  </AlertTitle>
                  <AlertDescription>
                    Şu anda geçici şifre kullanıyorsunuz. Lütfen güvenliğiniz
                    için şifrenizi değiştirin.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Hesabınız Güvende
                  </AlertTitle>
                  <AlertDescription>
                    Şifreniz güncel ve güvenli.
                  </AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-md"
              >
                <div className="space-y-2">
                  <Label htmlFor="current-pass">Mevcut Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      id="current-pass"
                      type="password"
                      className="pl-9 bg-zinc-950 border-zinc-800 text-white"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-pass">Yeni Şifre</Label>
                  <Input
                    id="new-pass"
                    type="password"
                    className="bg-zinc-950 border-zinc-800 text-white"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pass">Yeni Şifre (Tekrar)</Label>
                  <Input
                    id="confirm-pass"
                    type="password"
                    className="bg-zinc-950 border-zinc-800 text-white"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
