export const metadata = {
  title: "Доставка и оплата — Екатерина Дроздова",
  description: "Доставка, оплата, упаковка и индивидуальный заказ интерьерной керамики.",
};

export default function DeliveryPage() {
  const items = [
    ["Доставка", "Отправка по России после согласования удобного способа и стоимости доставки."],
    ["Оплата", "Оплата производится после подтверждения наличия, деталей изделия и доставки."],
    ["Упаковка", "Каждое изделие бережно упаковывается с учетом хрупкости керамики."],
    ["Индивидуальный заказ", "Можно обсудить похожий объект по мотивам проданной работы или новую форму."],
  ];

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-text">Доставка и оплата</p>
      <h1 className="mt-[clamp(0.8rem,1.3vw,1.4rem)] max-w-[58rem] font-serif leading-none text-graphite">
        Бережный путь от мастерской до дома
      </h1>
      <div className="mt-[clamp(2.2rem,4vw,5rem)] grid grid-cols-4 gap-[clamp(1rem,1.6vw,2rem)]">
        {items.map(([title, text]) => (
          <div className="rounded-lg bg-surface p-6" key={title}>
            <h2 className="delivery-card-title font-serif text-3xl text-graphite">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
