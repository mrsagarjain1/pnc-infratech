"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { projects } from "@/data/projects";
import type {
  Project,
  ProjectStatus,
  Sector,
  StateName,
} from "@/data/project-types";
import {
  SECTORS,
  STATE_PRESENCE,
  getProjectCountsBySector,
} from "@/data/site-data";

const SECTOR_LABELS: Record<Sector, string> = {
  highway: "Highways & Expressways",
  airport: "Airports & Runways",
  bridge: "Bridges",
  water: "Water & Irrigation",
  rail: "Rail Corridors",
  industrial: "Industrial Estate",
  coal: "Coal Mining",
  power: "Power Sector",
};

const SECTOR_IMAGES: Record<Sector, string> = {
  highway: "/images/real/cloverleaf-interchange.jpg",
  airport: "/images/real/airport-runway.jpg",
  bridge: "/images/real/ganga-river-bridge.jpg",
  water: "/images/real/water-canal-reservoir.jpg",
  rail: "/images/real/dedicated-rail-viaduct.jpg",
  industrial: "/images/real/smart-toll-industrial.jpg",
  coal: "/images/real/samruddhi-corridor.jpg",
  power: "/images/real/purvanchal-twilight.jpg",
};

const VALID_SECTORS = new Set<Sector>([
  "highway",
  "bridge",
  "airport",
  "rail",
  "water",
  "industrial",
  "coal",
  "power",
]);

const VALID_STATES = new Set<StateName>(STATE_PRESENCE.map((s) => s.name));
const SECTOR_COUNTS = getProjectCountsBySector();

export function ProjectsExplorer() {
  const searchParams = useSearchParams();
  const initialSectorParam = searchParams.get("sector") as Sector | null;
  const initialStateParam = searchParams.get("state") as StateName | null;

  const [sector, setSector] = useState<Sector | "all">(
    initialSectorParam && VALID_SECTORS.has(initialSectorParam)
      ? initialSectorParam
      : "all",
  );
  const [stateFilter, setStateFilter] = useState<StateName | "all">(
    initialStateParam && VALID_STATES.has(initialStateParam)
      ? initialStateParam
      : "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | Exclude<ProjectStatus, null>
  >("all");
  const [deliveryFilter, setDeliveryFilter] = useState<
    "all" | "EPC" | "BOT/HAM"
  >("all");
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (sector !== "all" && p.sector !== sector) return false;
      if (stateFilter !== "all" && !p.states.includes(stateFilter)) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (deliveryFilter !== "all" && p.delivery !== deliveryFilter) return false;
      if (q) {
        const hay =
          `${p.name} ${p.employer} ${p.locationLabel} ${p.id} ${p.sector} ${p.delivery ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sector, stateFilter, statusFilter, deliveryFilter, query]);

  const resetFilters = () => {
    setSector("all");
    setStateFilter("all");
    setStatusFilter("all");
    setDeliveryFilter("all");
    setQuery("");
  };

  const hasFilters =
    sector !== "all" ||
    stateFilter !== "all" ||
    statusFilter !== "all" ||
    deliveryFilter !== "all" ||
    query.trim() !== "";

  return (
    <div className="space-y-8">
      {/* Sector Selector Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setSector("all")}
          className={`rounded-[16px] p-5 text-left transition ${
            sector === "all"
              ? "bg-cobalt text-white shadow-lg shadow-cobalt/20"
              : "bg-white text-obsidian shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:bg-alabaster-deep"
          }`}
        >
          <p
            className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
              sector === "all" ? "text-lime" : "text-cobalt"
            }`}
          >
            ALL VERTICALS
          </p>
          <p className="lusion-display mt-1.5 text-3xl">
            {projects.length} Mandates
          </p>
          <p
            className={`mt-1 text-xs ${
              sector === "all" ? "text-white/80" : "text-muted"
            }`}
          >
            Complete REA-captured portfolio
          </p>
        </button>

        {(
          [
            "highway",
            "airport",
            "water",
            "bridge",
            "rail",
            "power",
            "industrial",
          ] as Sector[]
        ).map((sec) => {
          const active = sector === sec;
          return (
            <button
              key={sec}
              type="button"
              onClick={() => setSector(sec)}
              className={`rounded-[16px] p-5 text-left transition ${
                active
                  ? "bg-cobalt text-white shadow-lg shadow-cobalt/20"
                  : "bg-white text-obsidian shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:bg-alabaster-deep"
              }`}
            >
              <p
                className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
                  active ? "text-lime" : "text-cobalt"
                }`}
              >
                {SECTOR_LABELS[sec]}
              </p>
              <p className="lusion-display mt-1.5 text-3xl">
                {SECTOR_COUNTS[sec]}
              </p>
              <p
                className={`mt-1 truncate text-xs ${
                  active ? "text-white/80" : "text-muted"
                }`}
              >
                {SECTORS.find((s) => s.id === sec)?.tagline ??
                  "Specialized infrastructure execution"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-[20px] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <label htmlFor="project-search" className="sr-only">
              Search 137 projects by name, NH number, city, or authority
            </label>
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expressway, NH number, airport, bridge, employer (e.g. NHAI, Ganga, Varanasi)..."
              className="w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian placeholder:text-muted/70 focus:ring-2 focus:ring-cobalt focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="state-filter" className="sr-only">
              Filter by State
            </label>
            <select
              id="state-filter"
              value={stateFilter}
              onChange={(e) =>
                setStateFilter(e.target.value as StateName | "all")
              }
              className="w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
            >
              <option value="all">All 16 States</option>
              {STATE_PRESENCE.map((st) => (
                <option key={st.name} value={st.name}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="status-filter" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | Exclude<ProjectStatus, null>,
                )
              }
              className="w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="operating">Operating (O&amp;M)</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="delivery-filter" className="sr-only">
              Filter by Delivery Format
            </label>
            <select
              id="delivery-filter"
              value={deliveryFilter}
              onChange={(e) =>
                setDeliveryFilter(e.target.value as "all" | "EPC" | "BOT/HAM")
              }
              className="w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
            >
              <option value="all">All Modes</option>
              <option value="EPC">EPC Mode</option>
              <option value="BOT/HAM">BOT / HAM</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
          <span>
            SHOWING <strong className="text-obsidian">{filtered.length}</strong>{" "}
            OF {projects.length} CATALOGUED MANDATES
          </span>
          <div className="flex items-center gap-3">
            {sector !== "coal" && (
              <button
                type="button"
                onClick={() => setSector("coal")}
                className="text-cobalt hover:underline"
              >
                + Coal Mining ({SECTOR_COUNTS.coal})
              </button>
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-obsidian px-3.5 py-1 text-[10px] text-white transition hover:bg-cobalt"
              >
                RESET FILTERS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] bg-white p-12 text-center shadow-sm">
          <p className="font-display text-2xl font-normal text-obsidian">
            No matching infrastructure mandates found.
          </p>
          <p className="mt-2 text-sm text-muted">
            Try widening your state, sector, or keyword filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-full bg-cobalt px-6 py-2.5 font-mono text-xs font-medium text-white"
          >
            SHOW ALL {projects.length} PROJECTS
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedProject(proj)}
              className="group flex flex-col justify-between rounded-[16px] bg-white p-6 text-left shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(26,47,251,0.12)]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                  <span className="rounded-full bg-alabaster px-2.5 py-0.5 font-medium text-cobalt uppercase">
                    {SECTOR_LABELS[proj.sector]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {proj.delivery && (
                      <span className="rounded-full bg-alabaster-deep px-2.5 py-0.5 text-obsidian">
                        {proj.delivery}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 uppercase ${
                        proj.status === "ongoing"
                          ? "bg-cobalt text-white"
                          : proj.status === "operating"
                            ? "bg-obsidian text-lime"
                            : "bg-alabaster text-muted"
                      }`}
                    >
                      {proj.status ?? "Active"}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 line-clamp-3 text-[15px] leading-snug font-medium text-obsidian transition-colors group-hover:text-cobalt">
                  {proj.name}
                </h3>
              </div>

              <div className="mt-5 border-t border-black/8 pt-3.5 text-xs">
                <p className="truncate font-medium text-obsidian/80">
                  {proj.employer}
                </p>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-muted">
                  <span>{proj.states.join(" · ")}</span>
                  <span className="text-cobalt">Dossier →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Slide-over Project Dossier Drawer */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/55 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="thin-scroll relative h-full w-full max-w-xl overflow-y-auto bg-white p-6 text-obsidian shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs font-medium text-cobalt uppercase">
                MANDATE DOSSIER // ID {selectedProject.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-full bg-alabaster px-4 py-1.5 font-mono text-[11px] font-medium text-obsidian transition hover:bg-obsidian hover:text-white"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-[15px] bg-obsidian-soft">
              <Image
                src={SECTOR_IMAGES[selectedProject.sector]}
                alt={SECTOR_LABELS[selectedProject.sector]}
                fill
                sizes="560px"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3.5 py-1 font-mono text-[10px] font-medium text-obsidian uppercase shadow-sm">
                {SECTOR_LABELS[selectedProject.sector]}
              </span>
            </div>

            <h3
              id="dossier-title"
              className="mt-6 font-display text-2xl leading-snug font-normal tracking-tight text-obsidian"
            >
              {selectedProject.name}
            </h3>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[14px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Employer / Authority
                </dt>
                <dd className="mt-1 text-sm font-medium text-obsidian">
                  {selectedProject.employer}
                </dd>
              </div>
              <div className="rounded-[14px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  State / Location
                </dt>
                <dd className="mt-1 text-sm font-medium text-obsidian">
                  {selectedProject.states.join(", ")}
                </dd>
              </div>
              <div className="rounded-[14px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Execution Status
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-cobalt uppercase">
                  {selectedProject.status ?? "Listed Active"}
                </dd>
              </div>
              <div className="rounded-[14px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Delivery Format
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-obsidian">
                  {selectedProject.delivery ?? "Turnkey / Contract"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-[14px] bg-obsidian p-5 font-mono text-[11px] text-white/80">
              <p className="text-lime uppercase">PROVENANCE // REA CAPTURE</p>
              <p className="mt-1.5 leading-relaxed">
                Verbatim specification extracted from{" "}
                <span className="text-white">
                  pncinfratech.com/{selectedProject.source}
                </span>
                . Source location label: &ldquo;{selectedProject.locationLabel}
                &rdquo;.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
