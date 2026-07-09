import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1.5fr_1fr_1fr] gap-[clamp(1.5rem,3vw,4rem)] px-[clamp(1.25rem,2.8vw,2.5rem)] py-[clamp(3rem,5vw,6rem)]">
        <div>
          <img
            alt="Екатерина Дроздова"
            className="h-auto w-[clamp(10rem,16vw,17.5rem)] max-w-full object-contain"
            src="/brand-logo.png"
          />
          <p className="mt-[clamp(1rem,1.6vw,1.8rem)] max-w-[32rem] text-[clamp(0.85rem,0.95vw,1.1rem)] leading-[1.3] text-muted-text">
            Авторская интерьерная керамика, светильники, ароматы и объекты для
            дома, созданные вручную в тихом ритме мастерской.
          </p>
        </div>
        <div className="flex flex-col gap-[clamp(0.6rem,0.9vw,1rem)] text-[clamp(0.85rem,0.95vw,1.1rem)] text-graphite">
          <Link href="/catalog">Каталог</Link>
          <Link href="/collections">Коллекции</Link>
          <Link href="/delivery">Доставка и оплата</Link>
        </div>
        <div className="flex flex-col gap-[clamp(0.6rem,0.9vw,1rem)] text-[clamp(0.85rem,0.95vw,1.1rem)] text-graphite">
          <a href="https://www.instagram.com/blue.birdceramics" rel="noreferrer" target="_blank">
            Instagram
          </a>
          <a href="https://vk.ru/drozdovaekaterinacer" rel="noreferrer" target="_blank">
            VK
          </a>
          <a href="mailto:bikbova_katya@mail.ru">bikbova_katya@mail.ru</a>
          <span className="text-muted-text">Политика конфиденциальности</span>
        </div>
      </div>
    </footer>
  );
}
