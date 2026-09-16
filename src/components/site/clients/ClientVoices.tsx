import { Reveal } from "@/components/site/home/Reveal";

const VOICES = [
  {
    id: "v1",
    quote:
      "Capex delivered our HVAC scope on schedule with impeccable commissioning documentation. Repeat business was an easy decision.",
    role: "Facilities Head",
    context: "Enterprise Client, Noida",
    status: "PLACEHOLDER — PENDING CLIENT APPROVAL",
  },
  {
    id: "v2",
    quote:
      "Their fire-fighting installation cleared inspection first-time. Skilled crews and transparent SLAs make them a dependable partner.",
    role: "PMC Lead",
    context: "Commercial Tower, Delhi-NCR",
    status: "PLACEHOLDER — PENDING CLIENT APPROVAL",
  },
  {
    id: "v3",
    quote:
      "Executed 150 KM of 11/33 KV cable-laying for our smart-city program with disciplined HSE compliance and clean handover.",
    role: "Project Director",
    context: "Smart City Program, Bihar",
    status: "PLACEHOLDER — PENDING CLIENT APPROVAL",
  },
];

export function ClientVoices() {
  return (
    <section
      aria-label="Client Voices"
      data-tone="dark"
      className="bg-[var(--brand-deep)] text-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        {/* TOP LABEL */}
        <Reveal>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#cc8b59]" />
            <span className="font-tech text-[10px] uppercase tracking-widest text-white/80">
              CLIENT VOICES
            </span>
          </div>
        </Reveal>

        {/* HEADING */}
        <Reveal delay={100}>
          <h2 className="mt-8 max-w-2xl font-display text-4xl font-normal leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-[56px]">
            What partners say about
            <br className="hidden md:block" /> working with us.
          </h2>
        </Reveal>

        {/* THREE CARDS ROW */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((voice, i) => (
            <Reveal key={voice.id} delay={150 + i * 100} className="flex">
              <div className="flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 transition-colors hover:bg-white/[0.05]">
                {/* QUOTE MARK */}
                <span
                  aria-hidden="true"
                  className="font-display text-5xl leading-none text-[#cc8b59]/90"
                >
                  &ldquo;
                </span>

                {/* TEXT */}
                <p className="mb-12 mt-6 flex-1 text-balance font-body text-base leading-relaxed text-white/90 md:text-lg">
                  {voice.quote}
                </p>

                {/* FOOTER */}
                <div className="border-t border-white/10 pt-6">
                  <p className="font-tech text-[11px] font-medium uppercase tracking-[0.05em] text-white">
                    {voice.role}
                  </p>
                  <p className="mt-1 font-tech text-[10px] uppercase tracking-widest text-white/50">
                    {voice.context}
                  </p>
                  <p className="mt-4 font-tech text-[9px] uppercase tracking-widest text-[#cc8b59]/80">
                    {voice.status}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
