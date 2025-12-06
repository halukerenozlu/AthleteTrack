import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  Activity,
  Calendar,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { heroSlides } from "../constants/heroSlides"; // Resimler buradan geliyor

// ============ UTILITY FUNCTIONS ============
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ============ COMPONENTS ============

function LiquidButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 text-white h-14 px-10 bg-blue-600 hover:bg-blue-700 overflow-hidden group",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Ana Sayfa", href: "#hero" },
    { name: "Özellikler", href: "#features" },
    { name: "İletişim", href: "#footer" },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  // Otomatik slayt geçişi
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Image */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:p-8 border-b border-white/10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            AthleteTrack
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-white/80 hover:text-white transition-colors duration-300 font-medium tracking-wide"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-white text-black hover:bg-gray-100 rounded-full font-bold transition-all transform hover:scale-105"
          >
            Giriş Yap
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-gray-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/95 z-30 md:hidden flex flex-col items-center justify-center space-y-8">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-white text-2xl font-bold"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 text-2xl font-bold"
          >
            Giriş Yap
          </button>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 mt-[-80px]">
        <div className="text-center text-white max-w-4xl animate-fade-in-up">
          <div className="inline-block px-3 py-1 mb-4 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-md">
            <span className="text-blue-400 text-sm font-semibold tracking-wider">
              YENİ NESİL SPOR TEKNOLOJİSİ
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
            VERİYLE YÖNET
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              ZAFERE ULAŞ
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide mb-10 text-gray-300 max-w-2xl mx-auto">
            Profesyonel kulüpler için sakatlık takibi, performans analizi ve
            takım yönetimi tek platformda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* GÜNCELLEME: Yönlendirme /login yerine /pricing yapıldı */}
            <LiquidButton onClick={() => navigate("/pricing")}>
              Hemen Başla
            </LiquidButton>
            <button
              onClick={() => scrollToSection("#features")}
              className="px-10 h-14 rounded-md border border-white/20 hover:bg-white/10 text-white font-medium transition-all"
            >
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ FEATURES SECTION ============
function FeaturesSection() {
  const features = [
    {
      icon: <Activity className="w-8 h-8 text-red-500" />,
      title: "Sakatlık Takibi",
      desc: "Oyuncuların sağlık durumunu anlık izleyin, sakatlık risklerini önceden tespit edin.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      title: "Performans Analizi",
      desc: "Maç ve antrenman verilerini detaylı grafiklerle analiz ederek gelişimi görün.",
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: "Takım Yönetimi",
      desc: "Tüm kadroyu, antrenman programlarını ve maç takvimini tek yerden yönetin.",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Hedef Odaklı",
      desc: "Sezonluk hedefler belirleyin ve oyuncuların bu hedeflere ulaşmasını sağlayın.",
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-500" />,
      title: "Güvenli Veri",
      desc: "Kulüp verileriniz yerel sistemimizde güvenle saklanır ve yedeklenir.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-pink-500" />,
      title: "Akıllı Takvim",
      desc: "Antrenman ve maçları çakışma olmadan planlayın, otomatik bildirimler gönderin.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-zinc-950 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Neden AthleteTrack?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Modern spor kulüplerinin ihtiyaç duyduğu tüm araçlar, kullanıcı
            dostu arayüzle elinizin altında.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group backdrop-blur-sm"
            >
              <div className="mb-6 p-3 bg-zinc-800/50 rounded-lg w-fit group-hover:bg-blue-500/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER SECTION ============
function Footer() {
  return (
    <footer
      id="footer"
      className="bg-black border-t border-white/10 py-12 text-white"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">AthleteTrack</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Spor kulüpleri için geliştirilmiş en kapsamlı veri analizi ve
              yönetim platformu. Başarı tesadüf değildir.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link
                  to="/features"
                  className="hover:text-blue-400 transition-colors"
                >
                  Özellikler
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-blue-400 transition-colors"
                >
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  SSS
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">İletişim</h4>
            <ul className="space-y-4 text-gray-400">
              <li>info@athletetrack.com</li>
              <li>+90 (212) 555 00 00</li>
              <li>Kütahya, Türkiye</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          © 2025 AthleteTrack. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE EXPORT ============
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
