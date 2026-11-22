import Link from "next/link";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  code: string;
  breadcrumb: string;
  stats?: { label: string; value: string }[];
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  code,
  breadcrumb,
  stats,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-alabaster pt-28 pb-16 text-obsidian sm:pt-36 sm:pb-20">
      <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          <div className="flex items-center gap-2">
            <Link href="/" className="transition hover:text-cobalt">
              HOME
            </Link>
            <span className="text-black/25">/</span>
            <span className="text-cobalt">{breadcrumb}</span>
          </div>
          <span className="rounded-full bg-white px-3.5 py-1 text-[10px] font-medium text-obsidian shadow-sm">
            {code}
          </span>
        </div>

        <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
          {eyebrow}
        </p>

        <h1 className="lusion-display mt-3 max-w-5xl text-[clamp(2.75rem,7vw,6.5rem)] text-obsidian">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-[1.55] text-obsidian/75 sm:text-lg">
          {subtitle}
        </p>

        {stats && stats.length > 0 && (
          <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-6">
                <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                  {s.label}
                </p>
                <p className="lusion-display mt-2 text-3xl text-obsidian sm:text-4xl">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Signature Lusion + Registration Crosshair Divider */}
        <div
          aria-hidden="true"
          className="mt-12 flex items-center justify-between font-mono text-base text-obsidian/45"
        >
          <span>+</span>
          <span>+</span>
          <span>+</span>
          <span>+</span>
        </div>
      </div>
    </section>
  );
}
