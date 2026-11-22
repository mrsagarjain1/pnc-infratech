import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "137 Infrastructure Projects Portfolio",
  description:
    "Explore all 137 EPC, BOT, Hybrid Annuity (HAM), Airport Runway, Major River Bridge, Water Supply, Rail Corridor, Industrial Estate, and Coal Mining mandates of PNC Infratech Limited.",
};

export default function ProjectsPage() {
  const ongoingCount = projects.filter(
    (p) => p.status === "ongoing" || p.status === null,
  ).length;
  const operatingCount = projects.filter(
    (p) => p.status === "operating",
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;

  return (
    <>
      <PageHero
        eyebrow="REA-CAPTURED NATIONAL PORTFOLIO · VERBATIM LEDGER"
        title="137 Mandates Across 16 States."
        subtitle="Filter every highway, expressway, airport runway, major bridge, water supply grid, rail corridor, industrial estate, and coal mining contract published by PNC Infratech Limited."
        code="PORTFOLIO // ALL VERTICALS"
        breadcrumb="Projects"
        stats={[
          { label: "Total Mandates", value: String(projects.length) },
          { label: "Ongoing & Active", value: String(ongoingCount) },
          { label: "Operating Concessions", value: String(operatingCount) },
          { label: "Completed Legacy", value: String(completedCount) },
        ]}
      />

      <section className="bg-alabaster pb-24 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <Suspense
            fallback={
              <div className="rounded-[20px] bg-white p-10 text-center font-mono text-xs text-muted">
                Loading 137 infrastructure mandates...
              </div>
            }
          >
            <ProjectsExplorer />
          </Suspense>
        </div>
      </section>
    </>
  );
}
