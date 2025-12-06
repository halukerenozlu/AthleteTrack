import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} /> Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-center">
          Sıkça Sorulan Sorular
        </h1>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              AthleteTrack verilerimi nerede saklıyor?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Verileriniz, yerel sunucularımızda şifrelenmiş olarak saklanır ve
              KVKK uyumlu bir şekilde korunur.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              Mobil uygulaması var mı?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Şu an için web tarayıcısı üzerinden tüm cihazlarda (mobil, tablet,
              bilgisayar) responsive olarak çalışmaktadır. Mobil uygulamamız
              yakında mağazalarda olacak.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              Antrenör sayısı sınırı var mı?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Hayır, seçtiğiniz pakete bağlı olarak dilediğiniz kadar antrenör
              veya teknik ekip üyesi ekleyebilirsiniz.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              Aboneliğimi istediğim zaman iptal edebilir miyim?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Evet, taahhüt gerektirmeyen paketlerimizi dilediğiniz zaman iptal
              edebilirsiniz. İptal durumunda dönem sonuna kadar erişiminiz devam
              eder.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              Verilerimi dışa aktarabilir miyim?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Kesinlikle. Sporcu listelerinizi, antrenman raporlarınızı ve
              performans grafiklerinizi Excel veya PDF formatında tek tıkla
              indirebilirsiniz.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border-zinc-800">
            <AccordionTrigger className="text-lg hover:no-underline">
              Özel özellik isteğinde bulunabilir miyiz?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400">
              Kullanıcı geri bildirimlerine çok önem veriyoruz. Profesyonel ve
              Kulüp paketlerinde öncelikli özellik talep etme hakkınız
              bulunmaktadır.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
