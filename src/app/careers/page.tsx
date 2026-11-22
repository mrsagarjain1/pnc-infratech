import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CareersBoard } from "@/components/CareersBoard";
import { CAREER_OPENINGS } from "@/data/site-data";

export const metadata: Metadata = {
  title: "Careers & Open Engineering Mandates",
  description:
    "Explore 17 open leadership, civil engineering, highway EPC, water supply (JJM), HAM O&M, finance, GST, and Toll Management System (TMS) positions at PNC Infratech Limited.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="BUILD INDIA’S NEXT-GENERATION ARTERIES"
        title="Careers at PNC Infratech."
        subtitle="Join multidisciplinary project coordinators, structural design engineers, FIDIC contract specialists, water-supply leaders, and HAM O&M teams operating across 16 Indian states."
        code="TALENT // 17 OPENINGS"
        breadcrumb="Careers"
        stats={[
          { label: "Published Vacancies", value: `${CAREER_OPENINGS.length} Roles` },
          { label: "Vacancy Series", value: "PC-01 – HAM04" },
          { label: "HR Desk", value: "hr@pncinfratech.com" },
          { label: "Policy", value: "Zero Fee · Direct" },
        ]}
      />

      <section className="bg-alabaster pb-24 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <CareersBoard />
        </div>
      </section>
    </>
  );
}
