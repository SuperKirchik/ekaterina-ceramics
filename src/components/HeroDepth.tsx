import Link from "next/link";

export function HeroDepth() {
  return (
    <section className="hero-bg-section relative min-h-[clamp(34rem,82vh,62rem)] overflow-hidden">
      <div className="container-page relative flex min-h-[clamp(34rem,82vh,62rem)] items-center justify-center pb-[clamp(3rem,4.5vw,5rem)] pt-[clamp(5rem,8vw,9rem)]">
        <div className="max-w-[min(64rem,78vw)] text-center text-white fade-up">
          <p className="eyebrow-text mb-5 uppercase">
            <span className="block sm:inline">Интерьерная керамика</span>{" "}
            <span className="block sm:inline">Екатерины Дроздовой</span>
          </p>
          <div className="mt-[clamp(1.8rem,3vw,3rem)] flex flex-wrap justify-center gap-[clamp(0.6rem,1vw,1rem)]">
            <Link
              className="rounded-full border border-white bg-transparent px-[clamp(2.4rem,4vw,4rem)] py-[clamp(0.9rem,1.35vw,1.5rem)] text-[clamp(1rem,1.15vw,1.25rem)] font-medium text-white transition hover:bg-white hover:text-background"
              href="/catalog"
            >
              Каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
