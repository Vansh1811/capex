import { useState } from "react";
import type { ContactOffice } from "@/lib/site-data";

/**
 * Faq (Contact): the questions & answers register — a two-column editorial
 * block. The left column states the intent; the right column holds a
 * keyboard-accessible accordion: real buttons with aria-expanded/controls,
 * answers in regions that leave the accessibility tree when closed.
 * Every answer is composed from the verified company record (the corpora in
 * src/lib/*-corpus.ts, site_settings and about-content) — nothing invented;
 * where the record is conditional, the wording says so.
 */

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Offices of record for FAQ 3 — passed in from the same verified source the
 *  locations field used (site_settings → SITE_OFFICES via the route). */
function placesLine(offices: ContactOffice[]): string {
  const main = offices.find((o) => o.role.toLowerCase().includes("head"));
  const branches = offices.filter((o) => o !== main);
  return branches
    .map((o) => `${o.city} (${o.role.toLowerCase()})`)
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1");
}

const FAQS = (places: string): FaqItem[] => [
  {
    id: "faq-services",
    question: "What services does Capex provide?",
    answer:
      "Capex is a turnkey engineering provider: engineering, procurement, execution, testing, commissioning and handover under one contract. The work runs through two practices — Practice One covers UG utilities, electrical and CGD networks (cable laying, substation construction, city-gas distribution, LMC works, HDD and trenchless crossings), and Practice Two covers MEP, fire fighting and fire protection (HVAC systems, VRV/VRF, fire fighting and hydrant/sprinkler systems, integrated MEP). The full service register is on the Services page.",
  },
  {
    id: "faq-projects",
    question: "What types of projects does Capex undertake?",
    answer:
      "The documented record spans smart-city and metro infrastructure, oil & gas and city-gas distribution utilities, corporate and commercial buildings, healthcare environments, and industrial and manufacturing facilities — alongside education, hospitality, residential and public-sector work. Each service applies where the record documents it; the sector atlas on the Sectors page shows the detail.",
  },
  {
    id: "faq-presence",
    question: "Where does Capex operate?",
    answer: `Planning, design and coordination run from the corporate office in Noida, with ${places}. Project coverage follows the company's documented work across India — site deployment is arranged project by project rather than from additional branch locations.`,
  },
  {
    id: "faq-turnkey",
    question: "Does Capex handle a project from engineering through commissioning?",
    answer:
      "That is the documented delivery sequence: engineering → procurement → execution → testing → commissioning → handover, under the same accountable contract that signed the first drawing. The exact scope on any engagement depends on the project's requirements and the agreed contract — an enquiry does not automatically assume a full turnkey package.",
  },
  {
    id: "faq-testing",
    question: "Does Capex undertake testing and commissioning?",
    answer:
      "Yes — testing and commissioning sit inside the turnkey scope. The HVAC record documents commissioning with air and water balancing, functional performance testing, control-system verification, duct leakage testing, cooling-tower performance testing, sound and vibration testing, cleanroom testing, fume-hood testing and pre-construction plan review. Wings and utilities are proven section by section — segmented hydraulic and functional testing before handover. The applicable scope always depends on the system and the project.",
  },
  {
    id: "faq-ug-works",
    question: "Can Capex undertake underground and trenchless utility works?",
    answer:
      "Yes — underground electrical cable works (trenching, ducting, laying, jointing, reinstatement), ducting and gas-main works in MDPE and steel, LMC connection programmes, and HDD/trenchless crossings with the company's owned Drillto rig fleet (32 t, 28 t and 20 t, up to 32-tonne pullback). Capability figures travel with each service record on the Services page.",
  },
  {
    id: "faq-maintenance",
    question: "Does Capex provide maintenance or after-sales support?",
    answer:
      "The service record includes plant and AHU operation and after-sales maintenance support for installed systems. What can be offered depends on the service and the contract scope — it is agreed per engagement rather than promised as a standing 24/7 commitment. Raise it with the enquiry and Capex will answer from the record.",
  },
  {
    id: "faq-safety",
    question: "What safety practices does Capex follow?",
    answer:
      "The company record describes one safety regime applied on every site, for every worker: protective practice across hot work, lifting and rigging, eye and hand protection, and segmented hydraulic and functional testing before sections are signed off. Statutory certifications and third-party accreditations are published on the Credentials page only where the register documents them.",
  },
  {
    id: "faq-enquiry",
    question: "What information should I include in an enquiry?",
    answer:
      "Name and organization, the project's city and state, the service or system you have in mind, a few lines on the scope, and the expected timeline if you know it — plus an email or phone to reply to. If you are not yet sure which service applies, choose “Not sure yet”; the first conversation will sort it out.",
  },
  {
    id: "faq-credentials",
    question: "What company credentials or registrations does Capex hold?",
    answer:
      "The published register carries the Certificate of Incorporation (2012), PAN, Udyam (MSME) registration, GST registrations across Uttar Pradesh, Maharashtra, Bihar, Delhi and Haryana, ESI registration and MSME membership — each with its registry number of record. Documents are available on request through the Credentials page. Anything not documented there is not claimed here.",
  },
];

export function Faq({ offices }: { offices: ContactOffice[] }) {
  const faqs = FAQS(placesLine(offices));
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      aria-label="Questions and answers"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-4 md:px-10 md:pb-36 md:pt-8 lg:px-12 lg:pb-44">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* the statement */}
          <div className="lg:col-span-4">
            <p className="eyebrow-sans text-accent">Questions &amp; answers</p>
            <h2 className="mt-6 max-w-[12ch] font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[min(3.4vw,46px)]">
              A few things worth knowing.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[13px] leading-[1.85] text-muted-foreground md:text-[14px]">
              The short answers to what prospective clients ask most often. If your question is not
              here, ask it directly — the enquiry form above goes straight to the company.
            </p>
          </div>

          {/* the register */}
          <div className="lg:col-span-8">
            <ul className="border-t border-border">
              {faqs.map((f) => (
                <AccordionRow
                  key={f.id}
                  item={f}
                  open={open === f.id}
                  onToggle={() => setOpen(open === f.id ? null : f.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One accordion row: a real button + a region that leaves the accessibility
    tree when closed (visibility), animated with the site's easing. */
function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const answerId = `${item.id}-answer`;
  return (
    <li className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={answerId}
        id={item.id}
        className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
      >
        <span
          className={`font-display text-lg font-normal leading-[1.3] tracking-[-0.01em] transition-colors duration-300 md:text-xl ${
            open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
          }`}
        >
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className="relative mt-1.5 inline-flex h-3 w-3 shrink-0 items-center justify-center"
        >
          <span className="absolute h-px w-3 bg-foreground/60 transition-colors duration-300 group-hover:bg-foreground" />
          <span
            className={`absolute h-3 w-px bg-foreground/60 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-foreground ${
              open ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
        }`}
      >
        <div
          id={answerId}
          role="region"
          aria-labelledby={item.id}
          className={`overflow-hidden transition-[visibility,opacity] duration-400 ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <p className="max-w-[68ch] pb-6 pr-8 text-sm leading-[1.85] text-muted-foreground md:pr-12 md:text-[15px]">
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  );
}
