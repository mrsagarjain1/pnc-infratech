import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactDesk } from "@/components/ContactDesk";
import { COMPANY_INFO } from "@/data/site-data";

export const metadata: Metadata = {
  title: "Contact Us & Business Enquiry",
  description:
    "Connect with PNC Infratech Limited Corporate Office (PNC Tower, Agra) and Registered Office (NBCC Plaza, New Delhi) or file a direct project enquiry.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CORPORATE HEADQUARTERS & BUSINESS ENQUIRY"
        title="Let’s Talk Infrastructure."
        subtitle="Reach our corporate office at PNC Tower, Agra, our registered office at NBCC Plaza, New Delhi, or initiate a direct tender, vendor, or investor enquiry below."
        code="DESK // AGRA & NEW DELHI"
        breadcrumb="Contact"
        stats={[
          { label: "Corporate Office", value: "Agra, UP" },
          { label: "Registered Office", value: "New Delhi" },
          { label: "Company Secretary", value: "Mr. Kumar Jain" },
          { label: "Direct Line", value: COMPANY_INFO.corporateOffice.phone },
        ]}
      />

      <section className="bg-alabaster pb-24 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <ContactDesk />
        </div>
      </section>
    </>
  );
}
