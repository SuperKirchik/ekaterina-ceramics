import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroDepth } from "@/components/HeroDepth";
import { getCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

const processSteps = [
  {
    title: "Форма",
    text: "Процесс создания формы бывает разным. Это может быть точное воплощение эскиза или лишь частичное следование заданному вектору, направление которому задает мастер, а само движение и детали диктует материал. Форма может рождаться на гончарном круге или быть более живой - созданной вручную, с помощью лепки. Продолжительность этого этапа зависит от сложности и размера работы и может занимать от одного до четырех дней.",
  },
  {
    title: "Время",
    text: "Когда форма определена и глина застыла в том самом мгновении, начинается медленная, бережная сушка с постепенным доведением формы до совершенства. Каждый этап этого процесса возможен лишь при определенном состоянии керамической массы, поэтому он требует времени - от четырех до семи дней.",
  },
  {
    title: "Огонь",
    text: "После полного высыхания форма отправляется на первый обжиг при 950 °C. Это предварительная подготовка к финальному, высокотемпературному глазурному обжигу. Затем керамика покрывается глазурью и проходит второй обжиг при 1200 °C. После этого работа обретает завершенный вид, твердость и каменную прочность.",
  },
];

export default function Home() {
  const collections = getCollections();

  return (
    <>
      <HeroDepth />
      <section className="hidden">
        <img
          alt=""
          className="absolute inset-0 h-[112%] w-full -translate-y-[6%] scale-105 object-cover"
          decoding="async"
          fetchPriority="high"
          src="/hero-waterfall.png"
        />
        <div className="absolute inset-0 bg-[#26252a]/35" />
        <div className="container-page relative flex min-h-[82vh] items-center justify-center pb-16 pt-28">
          <div className="max-w-4xl text-center text-white fade-up">
            <p className="eyebrow-text mb-5 uppercase">
              <span className="block sm:inline">Интерьерная керамика</span>{" "}
              <span className="block sm:inline">Екатерины Дроздовой</span>
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                className="rounded-full border border-white bg-transparent px-9 py-4 text-base font-medium text-white transition hover:bg-white hover:text-background"
                href="/catalog"
              >
                Каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page content-auto py-[clamp(4rem,7vw,8rem)]">
        <div className="mb-[clamp(2rem,3.5vw,4rem)] flex items-end justify-between gap-[clamp(1rem,2vw,2rem)]">
          <div>
            <p className="text-[clamp(1rem,1.3vw,1.6rem)] uppercase tracking-[0.24em] text-muted-text">
              Коллекции
            </p>
          </div>
          <Link className="quiet-link inline-flex text-[clamp(1rem,1.3vw,1.6rem)]" href="/collections">
            Все коллекции
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-[clamp(0.8rem,1.35vw,1.4rem)]">
          {collections.map((collection) => (
            <Link
              className="collection-card group block min-w-0"
              href={`/collections/${collection.slug}`}
              key={collection.slug}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  decoding="async"
                  loading="lazy"
                  src={collection.image || "/brand-logo.png"}
                />
              </div>
              <div className="pt-[clamp(1rem,1.6vw,1.7rem)]">
                <div className="flex items-center justify-between">
                  <h3 className="collection-card-title min-w-0 font-serif text-graphite">
                    {collection.title}
                  </h3>
                  <ArrowUpRight size={18} />
                </div>
                <p className="mt-[clamp(0.5rem,0.9vw,1rem)] text-[clamp(0.85rem,1vw,1.2rem)] leading-[1.25] text-muted-text">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="philosophy-bg-section content-auto py-[clamp(8rem,12vw,14rem)]">
        <div className="container-page flex justify-end">
          <div className="w-[30vw] min-w-[18rem] max-w-[34rem]">
            <p className="text-[clamp(1rem,1.15vw,1.35rem)] uppercase tracking-[0.24em] text-white/75">
              Философия
            </p>
            <p className="mt-[clamp(0.8rem,1.3vw,1.4rem)] font-serif leading-[0.98] text-white">
              Моя миссия - создавать тихий диалог между человеком и
              пространством.
            </p>
            <p className="mt-[clamp(1rem,1.6vw,1.8rem)] text-[clamp(1.05rem,1.22vw,1.55rem)] leading-[1.12] text-white/82">
              Через шероховатость камня, глубину нейтральных оттенков и
              гармонию ароматов напоминать о тепле земли, шепоте природы и
              ценности простоты.
            </p>
          </div>
        </div>
      </section>

      <section className="content-auto bg-graphite py-[clamp(3rem,4.2vw,4.6rem)] text-surface">
        <div className="container-page mx-auto grid max-w-[min(1080px,82vw)] grid-cols-[minmax(16rem,0.9fr)_1.1fr] items-center gap-[clamp(1.4rem,2.5vw,3rem)]">
          <img
            alt="Екатерина Дроздова"
            className="mx-auto aspect-[4/5] w-full max-w-[clamp(24rem,28vw,42rem)] object-cover object-[center_35%]"
            decoding="async"
            loading="lazy"
            src="/master-photo.png"
          />
          <div>
            <p className="text-[clamp(0.95rem,1.1vw,1.35rem)] uppercase tracking-[0.24em] text-surface/65">
              О мастере
            </p>
            <h2 className="mt-[clamp(0.8rem,1.3vw,1.4rem)] font-serif">
              Екатерина Дроздова
            </h2>
            <p className="mt-[clamp(0.8rem,1.3vw,1.4rem)] max-w-[44rem] text-[clamp(0.95rem,1.05vw,1.3rem)] leading-[1.28] text-surface/75">
              Меня зовут Екатерина Дроздова. В своей мастерской я создаю
              авторскую керамику ручной работы с 2024 года. Имея
              математическое образование и врожденную тягу к структуре, я
              всегда стремилась упорядочивать и гармонизировать пространство
              вокруг себя. Керамика стала для меня способом создавать красоту
              через форму, фактуру и материал. В своих работах я ищу баланс
              между природой, человеком и собственным ощущением прекрасного,
              создавая объекты, которые делают пространство живым и
              наполненным.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page content-auto py-[clamp(4rem,7vw,8rem)]">
        <p className="font-serif text-graphite">
          Процесс
        </p>
        <div className="mt-[clamp(2rem,3.5vw,4rem)] grid grid-cols-3 gap-[clamp(1rem,2.2vw,2.8rem)]">
          {processSteps.map((step, index) => (
            <div className="border-t border-border pt-[clamp(1.2rem,2vw,2.4rem)]" key={step.title}>
              <span className="text-[clamp(1rem,1.25vw,1.55rem)] leading-none text-muted-text">
                0{index + 1}
              </span>
              <h3 className="mt-[clamp(1rem,1.6vw,1.8rem)] font-serif text-graphite">
                {step.title}
              </h3>
              <p className="mt-[clamp(1rem,1.5vw,1.7rem)] text-[clamp(0.9rem,1vw,1.2rem)] leading-[1.32] text-muted-text">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
