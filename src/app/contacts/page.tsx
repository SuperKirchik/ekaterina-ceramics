import { Camera, Send } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Контакты - Екатерина Дроздова",
  description: "Связаться с мастерской Екатерины Дроздовой.",
};

export default function ContactsPage() {
  return (
    <section className="container-page grid grid-cols-12 gap-[clamp(1.8rem,3vw,4rem)] py-[clamp(3.5rem,5vw,6rem)]">
      <div className="col-span-5">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-text">Контакты</p>
        <h1 className="mt-[clamp(0.8rem,1.3vw,1.4rem)] font-serif text-graphite">
          Написать в мастерскую
        </h1>
        <div className="mt-8 space-y-4 text-muted-text">
          <a
            className="flex items-center gap-3 text-graphite"
            href="https://www.instagram.com/blue.birdceramics"
            rel="noreferrer"
            target="_blank"
          >
            <Camera size={18} /> Instagram
          </a>
          <a
            className="flex items-center gap-3 text-graphite"
            href="https://vk.ru/drozdovaekaterinacer"
            rel="noreferrer"
            target="_blank"
          >
            <Send size={18} /> VK
          </a>
          <a className="quiet-link inline-flex" href="mailto:bikbova_katya@mail.ru">
            bikbova_katya@mail.ru
          </a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
