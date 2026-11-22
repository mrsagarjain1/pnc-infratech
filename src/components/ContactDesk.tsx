"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/data/site-data";

const TOPICS = [
  "Highway / Expressway EPC",
  "BOT / HAM Concession",
  "Airport / Defence Runway",
  "Water Supply & Irrigation",
  "Investor Relations (SEBI Reg 46)",
  "Vendor / Sub-Contracting",
] as const;

export function ContactDesk() {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !details.trim()) return;
    setSent(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left: Crisp White Enquiry Studio Form */}
      <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-9 lg:col-span-7">
        <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
          BUSINESS ENQUIRY DESK
        </p>
        <h2 className="lusion-display mt-2 text-3xl text-obsidian sm:text-4xl">
          Initiate a Project or Corporate Enquiry
        </h2>
        <p className="mt-2.5 text-sm text-muted">
          Modernized from pncinfratech.com/enquiry.html — select a vertical and
          describe your project, tender, vendor, or shareholder requirement.
        </p>

        {sent ? (
          <div className="mt-7 rounded-[16px] bg-alabaster p-6 text-obsidian">
            <p className="font-mono text-xs font-medium text-cobalt uppercase">
              ✓ ENQUIRY RECORDED IN LOCAL DEMO
            </p>
            <h3 className="mt-2 font-display text-2xl font-normal">
              Thank you, {name}.
            </h3>
            <p className="mt-2 text-xs text-muted">
              Vertical: <strong className="text-obsidian">{topic}</strong> ·
              Contact: +91 {mobile}
            </p>
            <p className="mt-3 text-xs text-muted">
              For live corporate correspondence, reach{" "}
              {COMPANY_INFO.corporateOffice.companySecretary} on{" "}
              <a
                href={`tel:${COMPANY_INFO.corporateOffice.phone}`}
                className="text-cobalt underline"
              >
                {COMPANY_INFO.corporateOffice.phone}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setName("");
                setMobile("");
                setEmail("");
                setDetails("");
              }}
              className="mt-5 rounded-full bg-obsidian px-5 py-2.5 font-mono text-xs text-white hover:bg-cobalt"
            >
              SUBMIT ANOTHER ENQUIRY
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div>
              <span className="block font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                Select Infrastructure Vertical / Desk
              </span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition ${
                      topic === t
                        ? "bg-cobalt font-medium text-white"
                        : "bg-alabaster text-obsidian/75 hover:bg-alabaster-deep"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-[10px] text-muted uppercase"
                >
                  Enter Your Name *
                </label>
                <input
                  id="contact-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name / Organization"
                  className="mt-1.5 w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian placeholder:text-muted/60 focus:ring-2 focus:ring-cobalt focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block font-mono text-[10px] text-muted uppercase"
                >
                  Enter Your Phone Number *
                </label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-[14px] bg-alabaster-deep px-3.5 font-mono text-xs text-cobalt">
                    +91
                  </span>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Phone / Mobile"
                    className="w-full rounded-r-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian placeholder:text-muted/60 focus:ring-2 focus:ring-cobalt focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-[10px] text-muted uppercase"
              >
                Work Email (Optional)
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.in"
                className="mt-1.5 w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian placeholder:text-muted/60 focus:ring-2 focus:ring-cobalt focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="contact-details"
                className="block font-mono text-[10px] text-muted uppercase"
              >
                Describe Your Requirements in Detail *
              </label>
              <textarea
                id="contact-details"
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share corridor scope, tender reference, location, or shareholder query..."
                className="mt-1.5 w-full rounded-[14px] bg-alabaster px-4 py-3 text-xs text-obsidian placeholder:text-muted/60 focus:ring-2 focus:ring-cobalt focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="lusion-pill lusion-pill-dark"
            >
              <span className="lusion-pill-dot" aria-hidden="true" />
              <span className="lusion-pill-label">SEND ENQUIRY</span>
              <span className="lusion-pill-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>
        )}
      </div>

      {/* Right: Corporate & Registered Office Cards */}
      <div className="space-y-5 lg:col-span-5">
        <div className="rounded-[20px] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] text-cobalt uppercase">
            01 // {COMPANY_INFO.corporateOffice.label}
          </p>
          <h3 className="lusion-display mt-2 text-3xl text-obsidian">
            PNC Tower, Agra
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-obsidian/80">
            {COMPANY_INFO.corporateOffice.address}
          </p>
          <div className="mt-5 space-y-2 border-t border-black/8 pt-4 text-xs text-muted">
            <p>
              <span className="font-mono text-[10px] uppercase">
                Company Secretary:{" "}
              </span>
              <span className="font-medium text-obsidian">
                {COMPANY_INFO.corporateOffice.companySecretary}
              </span>
            </p>
            <p>
              <span className="font-mono text-[10px] uppercase">
                Direct Line:{" "}
              </span>
              <a
                href={`tel:${COMPANY_INFO.corporateOffice.phone}`}
                className="font-mono font-medium text-cobalt hover:underline"
              >
                {COMPANY_INFO.corporateOffice.phone}
              </a>
            </p>
            <p>
              <span className="font-mono text-[10px] uppercase">
                Recruitment Mail:{" "}
              </span>
              <a
                href={`mailto:${COMPANY_INFO.corporateOffice.email}`}
                className="font-mono font-medium text-obsidian hover:text-cobalt"
              >
                {COMPANY_INFO.corporateOffice.email}
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] text-cobalt uppercase">
            02 // {COMPANY_INFO.registeredOffice.label}
          </p>
          <h3 className="lusion-display mt-2 text-3xl text-obsidian">
            NBCC Plaza, New Delhi
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-obsidian/80">
            {COMPANY_INFO.registeredOffice.address}
          </p>
          <div className="mt-5 border-t border-black/8 pt-4 text-xs text-muted">
            Official Portal:{" "}
            <a
              href={COMPANY_INFO.registeredOffice.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-medium text-cobalt hover:underline"
            >
              www.pncinfratech.com ↗
            </a>
          </div>
        </div>

        <div className="rounded-[20px] bg-obsidian p-6 text-xs text-white">
          <p className="font-mono text-[10px] tracking-[0.12em] text-lime uppercase">
            SECURITY &amp; GOVERNANCE NOTICE
          </p>
          <p className="mt-2 leading-relaxed text-white/80">
            Verify all employment correspondence against official PNC Infratech
            channels. Download the{" "}
            <a
              href={COMPANY_INFO.documents.fraudWarningPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-lime"
            >
              Fraudulent Employment Offers Notice (PDF)
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
