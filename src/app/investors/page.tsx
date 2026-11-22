import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InvestorVault } from "@/components/InvestorVault";
import { ANNUAL_REPORTS } from "@/data/site-data";

export const metadata: Metadata = {
  title: "Investors & SEBI (LODR) Reg 46 Disclosures",
  description:
    "PNC Infratech Limited Investor Relations Vault: 14 audited Annual Reports (FY 2014 to FY 2026), SEBI Regulation 46 disclosures, financial results, corporate presentations, and subsidiary accounts.",
};

export default function InvestorsPage() {
  return (
    <>
      <PageHero
        eyebrow="SHAREHOLDER GOVERNANCE · SEBI (LODR) REGULATION 46"
        title="Investor Relations & Financial Vault."
        subtitle="Transparent statutory reporting covering 14 audited Annual Reports (FY 2013–14 through FY 2025–26), quarterly financial results, corporate presentations, SPV subsidiary accounts, and dividend disclosures."
        code="INVESTORS // REG 46"
        breadcrumb="Investors"
        stats={[
          { label: "Annual Reports", value: `${ANNUAL_REPORTS.length} PDFs` },
          { label: "Latest Filing", value: "FY 2025–26" },
          { label: "Archive Span", value: "FY 14 – FY 26" },
          { label: "Compliance", value: "SEBI Reg 46" },
        ]}
      />

      <section className="bg-alabaster pb-24 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <InvestorVault />
        </div>
      </section>
    </>
  );
}
