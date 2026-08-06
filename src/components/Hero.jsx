import Link from "next/link";

export default function Hero({ customProductId = null }) {
  return (
    <section className="relative bg-primary overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="font-sora font-bold text-secondary/[0.03] leading-none whitespace-nowrap"
          style={{ fontSize: "22vw" }}>
          FRAGMENTE
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #b8860b 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #b8860b 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 lg:py-36">
        <p className="text-xs uppercase tracking-[0.5em] text-accent font-semibold">
          Colección premium
        </p>

        <h1 className="mt-4 font-sora font-bold text-secondary leading-none"
          style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}>
          FRAGMENTE
        </h1>

        <div className="mt-5 w-16 h-px bg-accent" />

        <p className="mt-6 text-lg text-secondary/50 max-w-md leading-relaxed">
          Tu fragancia, tu identidad. Explorá nuestra colección o creá
          tu perfume exclusivo desde cero.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/categories"
            className="bg-accent text-white px-8 py-3.5 rounded-full font-semibold hover:brightness-110 transition-all text-sm"
          >
            Ver colección
          </Link>
          {customProductId && (
            <Link
              href={`/product/${customProductId}`}
              className="border border-secondary/20 text-secondary/80 px-8 py-3.5 rounded-full font-semibold hover:border-accent hover:text-accent transition-all text-sm"
            >
              Creá el tuyo →
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-secondary/5 py-3">
        <p className="text-center text-xs tracking-[0.5em] uppercase text-secondary/20 font-medium">
          Chanel · Dior · Tom Ford · Versace · YSL · Hermès · Lancôme · Chloé
        </p>
      </div>
    </section>
  );
}
