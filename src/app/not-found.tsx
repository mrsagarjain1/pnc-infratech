import { LusionPill } from "@/components/LusionPill";

export default function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-alabaster px-[max(4vw,20px)] pt-32 pb-20 text-obsidian">
      <div className="max-w-xl rounded-[20px] bg-white p-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <p className="font-mono text-xs tracking-[0.14em] text-cobalt uppercase">
          CHAINAGE NOT FOUND // 404
        </p>
        <h1 className="lusion-display mt-3 text-4xl text-obsidian sm:text-5xl">
          Off the Mapped Corridor.
        </h1>
        <p className="mt-4 text-sm text-muted">
          The route you requested does not match an active section of the PNC
          Infratech Limited portal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LusionPill label="RETURN HOME" href="/" variant="dark" />
          <LusionPill label="137 PROJECTS" href="/projects" />
        </div>
      </div>
    </section>
  );
}
