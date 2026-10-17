import { useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import type { ContactCapability } from "@/lib/site-data";

/**
 * Enquiry (Contact): the form as a carefully typeset enquiry document —
 * one outlined panel on warm ivory, fine warm-grey border, restrained
 * rounding, copper numbering. Questions read as a numbered sequence with
 * thin internal dividers; each engages quietly as the previous is answered
 * (progressive disclosure without wizard steps; every field stays in the
 * tab order and in the DOM the whole time).
 *
 * The service selector is an accessible multi-select (native checkboxes;
 * "Not sure yet" is the exclusive escape hatch that clears the list, and
 * choosing a service clears it). The technical contract is untouched:
 * submitEnquiry receives name/email/phone/company/practice/service_slug/
 * message + honeypot & timing telemetry, exactly as the RPC expects — the
 * primary selection travels in service_slug, the full selection in the
 * p_data record (services), so the backend shape is unchanged.
 */
export type EnquiryStatus = "idle" | "sending" | "sent" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(form: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Your name — so we know who we're speaking with.";
  if (!form.email.trim()) errors.email = "An email — so the reply has somewhere to go.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "That address looks incomplete — check the spelling.";
  if (!form.message.trim())
    errors.message = "A line or two about the work — whatever you know today.";
  return errors;
}

export function Enquiry({
  phone,
  email,
  capabilities,
  practiceIds,
}: {
  phone: string;
  email: string;
  capabilities: ContactCapability[];
  practiceIds: { one: string; two: string };
}) {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    place: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot — never shown to humans
  });
  const [practice, setPractice] = useState<"" | "one" | "two">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [notSure, setNotSure] = useState(false);
  const [status, setStatus] = useState<EnquiryStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [enqRef, setEnqRef] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function toggleService(slug: string) {
    setNotSure(false);
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }
  function toggleNotSure() {
    setNotSure((v) => {
      const next = !v;
      if (next) setSelected([]);
      return next;
    });
  }

  /** Which questions have opened up: each unlocks when the previous is engaged. */
  const opened = {
    org: form.name.trim().length > 0,
    place: form.name.trim().length > 0,
    need: form.organization.trim().length > 0 || form.place.trim().length > 0,
    more: practice !== "" || selected.length > 0 || notSure,
    reach: form.message.trim().length > 0,
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`#${`ct-${first}`}`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError(null);
    const primary = selected[0] ?? "";
    const primaryName = primary
      ? (capabilities.find((c) => c.slug === primary)?.name ?? primary)
      : "";
    try {
      const { submitEnquiry } = await import("@/lib/cms.functions");
      const res = await submitEnquiry({
        data: {
          form_type: "contact",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.organization.trim(),
          subject: primary
            ? selected.length > 1
              ? `Service: ${primaryName} (+${selected.length - 1} more)`
              : `Service: ${primaryName}`
            : practice
              ? "General enquiry — practice"
              : "General enquiry",
          message: [
            form.message.trim(),
            form.place.trim() && `Project location: ${form.place.trim()}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
          practice: practice ? practiceIds[practice] : "",
          service_slug: primary,
          website: form.website,
          elapsed_ms: Date.now() - startedAt.current,
          // the full selection rides in the JSON record — the RPC's p_data
          // shape (record of strings) is unchanged
          data: selected.length > 0 ? { services: selected.join(",") } : {},
        },
      });
      setEnqRef((res as { ref?: string | null }).ref ?? null);
      setStatus("sent");
    } catch {
      setServerError(null);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[4px] border border-border bg-[color:var(--card)] px-6 py-16 sm:px-10 md:px-14 md:py-20 lg:px-16">
        <Received
          enqRef={enqRef}
          phone={phone}
          email={email}
          onReset={() => {
            setStatus("idle");
            setForm({
              name: "",
              organization: "",
              place: "",
              email: "",
              phone: "",
              message: "",
              website: "",
            });
            setPractice("");
            setSelected([]);
            setNotSure(false);
            startedAt.current = Date.now();
          }}
        />
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="w-full"
      aria-label="Tell Capex about the work"
    >
      <Reveal>
        <div className="rounded-[4px] border border-border bg-[color:var(--card)] px-6 py-10 sm:px-8 md:px-12 md:py-14 lg:px-16 lg:py-16">
          {/* the document's heading — inside the panel, with the timing mark */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-8 md:pb-10">
            <h2 className="max-w-[16ch] font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-[min(3.6vw,50px)]">
              Tell us about the work.
            </h2>
            <p className="eyebrow-sans text-muted-foreground/70">Five questions · two minutes</p>
          </div>

          <div className="mt-2 md:mt-3">
            <Question number="01" label="Your name" hint="Who we're speaking with." unlocked>
              <LineInput
                id="ct-name"
                autoComplete="name"
                required
                maxLength={120}
                value={form.name}
                onChange={set("name")}
                error={errors.name}
                placeholder="Your name"
              />
            </Question>

            <Question
              number="02"
              label="Your organization"
              hint="Optional — a company, an authority, a team of one."
              unlocked={opened.org}
            >
              <LineInput
                id="ct-org"
                autoComplete="organization"
                maxLength={160}
                value={form.organization}
                onChange={set("organization")}
                placeholder="Organization"
              />
            </Question>

            <Question
              number="03"
              label="Where is the project?"
              hint="A city is enough at this stage."
              unlocked={opened.place}
            >
              <LineInput
                id="ct-place"
                autoComplete="address-level2"
                maxLength={160}
                value={form.place}
                onChange={set("place")}
                placeholder="City, state"
              />
            </Question>

            <Question
              number="04"
              label="What do you need?"
              hint="From the Capex service record — select what applies."
              unlocked={opened.need}
            >
              <fieldset>
                <legend className="sr-only">What do you need from Capex?</legend>
                {/* multi-select: native checkboxes, quiet square marks;
                    selecting any service clears "Not sure yet" */}
                <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {capabilities.map((c) => (
                    <ServiceCheck
                      key={c.slug}
                      id={`ct-need-${c.slug}`}
                      label={c.name}
                      checked={selected.includes(c.slug)}
                      onChange={() => toggleService(c.slug)}
                    />
                  ))}
                </div>
                <div className="mt-6 border-t border-border pt-5">
                  <ServiceCheck
                    id="ct-need-not-sure"
                    label="Not sure yet — help identify the service"
                    italic
                    checked={notSure}
                    onChange={toggleNotSure}
                  />
                </div>
                {/* practice context — the two practices, typed */}
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {(
                    [
                      { v: "one", l: "Practice One — UG Utilities, Electrical & CGD" },
                      { v: "two", l: "Practice Two — MEP, HVAC & Fire" },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.v}
                      type="button"
                      role="checkbox"
                      aria-checked={practice === p.v}
                      onClick={() => setPractice(practice === p.v ? "" : p.v)}
                      className={`font-tech text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                        practice === p.v
                          ? "text-accent"
                          : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {practice === p.v ? "■ " : "□ "}
                      {p.l}
                    </button>
                  ))}
                </div>
              </fieldset>
            </Question>

            <Question
              number="05"
              label="Tell us a little more"
              hint="Scope, timeline — whatever exists today."
              unlocked={opened.more}
            >
              <textarea
                id="ct-msg"
                required
                rows={5}
                maxLength={4000}
                value={form.message}
                onChange={(e) => set("message")(e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "ct-msg-error" : undefined}
                placeholder="A few lines about the work"
                className="w-full resize-none border-b border-foreground/25 bg-transparent pb-3 pt-2 font-display text-lg font-normal tracking-[-0.01em] text-foreground placeholder:text-muted-foreground/45 focus:border-foreground focus:outline-none"
              />
              {errors.message && (
                <p id="ct-msg-error" role="alert" className="mt-2 text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </Question>

            <Question
              number="06"
              label="How should we reach you?"
              hint="Email required; phone optional."
              unlocked={opened.reach}
            >
              <div className="grid gap-8 md:grid-cols-2">
                <LineInput
                  id="ct-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                  placeholder="Email address"
                />
                <LineInput
                  id="ct-phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="Phone (optional)"
                />
              </div>
            </Question>
          </div>

          {/* honeypot — visually hidden, ignored by humans, fatal to bots */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => set("website")(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {/* the panel's floor: alternatives + the submit action */}
          <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-sm text-[13px] leading-[1.7] text-muted-foreground">
              Prefer a voice? Call{" "}
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                {phone}
              </a>{" "}
              or write{" "}
              <a
                href={`mailto:${email}`}
                className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                {email}
              </a>
              .
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex w-fit items-center gap-4 font-display text-xl font-medium tracking-[-0.01em] text-foreground disabled:opacity-45 md:text-2xl"
            >
              <span className="relative pb-2">
                {status === "sending" ? "Sending…" : "Send enquiry"}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-full origin-left bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] scale-x-0 group-hover:scale-x-100 group-disabled:scale-x-0"
                />
              </span>
              <span
                aria-hidden="true"
                className="inline-block text-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2"
              >
                →
              </span>
            </button>
          </div>

          {status === "error" && (
            <p role="alert" className="mt-8 text-sm leading-relaxed text-destructive">
              The message could not be sent just now. Please try again — or call{" "}
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="underline underline-offset-4"
              >
                {phone}
              </a>
              , we keep the line open.
            </p>
          )}
          {serverError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {serverError}
            </p>
          )}
        </div>
      </Reveal>
    </form>
  );
}

/** One question: copper number + label + hint, sections divided by hairlines.
    Locked questions stay visible but quiet — never hidden from the tab
    order, never removed from the DOM. */
function Question({
  number,
  label,
  hint,
  unlocked,
  children,
}: {
  number: string;
  label: string;
  hint: string;
  unlocked: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`border-b border-border px-1 py-8 transition-opacity duration-700 ease-out md:px-2 md:py-9 ${
        unlocked ? "opacity-100" : "opacity-55"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="flex items-baseline gap-4 md:gap-5">
          <span className="font-tech text-[11px] tracking-[0.12em] text-accent">{number}</span>
          <label className="font-display text-xl font-normal tracking-[-0.015em] md:text-[22px]">
            <span className="sr-only">Question {number}: </span>
            {label}
          </label>
        </span>
        <span className="pl-9 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 md:pl-10">
          {hint}
        </span>
      </div>
      <div className="mt-6 md:mt-7 md:pl-10">{children}</div>
    </div>
  );
}

/** The accessible service checkbox: a native input (sr-only) + a quiet
    square mark + the service name. Keyboard and screen-reader semantics
    come free from the input; the mark is decoration. */
function ServiceCheck({
  id,
  label,
  checked,
  onChange,
  italic = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  italic?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex w-fit cursor-pointer items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative mt-0.5 grid h-[15px] w-[15px] shrink-0 place-items-center border transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
          checked
            ? "border-foreground bg-foreground"
            : "border-foreground/35 bg-transparent peer-hover:border-foreground/70"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
            <path
              d="M2.5 6.2 5 8.7l4-5.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`font-display text-[15px] font-normal tracking-[-0.01em] transition-colors md:text-base ${
          checked ? "text-foreground" : "text-foreground/75 hover:text-foreground"
        } ${italic ? "italic" : ""}`}
      >
        {label}
      </span>
    </label>
  );
}

/** The editorial input: type on a hairline, generous scale. */
function LineInput({
  id,
  type = "text",
  autoComplete,
  required,
  maxLength,
  value,
  onChange,
  error,
  placeholder,
}: {
  id: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <input
        id={id}
        type={type}
        inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        className="w-full border-0 border-b border-foreground/25 bg-transparent pb-3 pt-2 font-display text-lg font-normal tracking-[-0.01em] text-foreground placeholder:text-muted-foreground/45 focus:border-foreground focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** The received state — a restrained editorial confirmation, inside the panel. */
function Received({
  enqRef,
  phone,
  email,
  onReset,
}: {
  enqRef: string | null;
  phone: string;
  email: string;
  onReset: () => void;
}) {
  return (
    <div className="rise-line">
      <p className="eyebrow-sans text-muted-foreground/70">{enqRef ?? "Received"}</p>
      <h2 className="mt-8 max-w-[14ch] font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] sm:text-4xl lg:text-[min(4vw,56px)]">
        Message received.
      </h2>
      <p className="mt-6 max-w-md text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
        We&rsquo;ll be in touch. For anything urgent, the line stays open:
      </p>
      <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:gap-16">
        <a
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          className="group w-fit"
          aria-label={`Call Capex — ${phone}`}
        >
          <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
            Call
          </span>
          <span className="relative mt-2 inline-block font-display text-2xl font-medium tracking-[-0.01em] text-foreground">
            {phone}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
          </span>
        </a>
        <a href={`mailto:${email}`} className="group w-fit" aria-label={`Write Capex — ${email}`}>
          <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
            Write
          </span>
          <span className="relative mt-2 inline-block font-display text-2xl font-medium tracking-[-0.01em] text-foreground">
            {email}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
          </span>
        </a>
      </div>
      <button
        onClick={onReset}
        className="mt-14 border-b border-foreground/40 pb-2 text-sm font-medium text-foreground transition-colors hover:border-foreground"
      >
        Send another message
      </button>
    </div>
  );
}
