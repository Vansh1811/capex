import { useRef, useState } from "react";

/**
 * REQUEST FORM (Verification Desk): the document request as an instrument
 * of record inside the desk's bordered panel — numbered questions on
 * hairlines, restrained rectangular inputs with visible labels and focus
 * states, and a prominent Request → action. The requested document is
 * chosen from the register (or arrives pre-selected via #verification-desk
 * from an EvidenceSheet), the visitor says who they are, and the request is
 * persisted by the submit_credential_request RPC — the same atomic contract
 * as the enquiry (duplicate screen, rate limit, CREQ reference). The
 * credential records themselves remain static register content; only the
 * REQUEST is dynamic.
 */

type RequestStatus = "idle" | "sending" | "sent" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "credential", string>>;

const NOT_SURE = "not-sure";

/** The panel's input treatment — a restrained rectangle on a hairline. */
const FIELD_BORDER = "border-foreground/25 focus:border-foreground/70";
const FIELD_BORDER_ERROR = "border-destructive/70 focus:border-destructive";
const FIELD =
  "w-full bg-transparent px-3.5 py-2.5 font-display text-[17px] font-normal tracking-[-0.01em] text-foreground transition-colors duration-300 placeholder:text-muted-foreground/50 focus:outline-none";

function validate(form: { name: string; email: string; credential: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Your name — so we know who we're speaking with.";
  if (!form.email.trim()) errors.email = "An email — so the document has somewhere to go.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "That address looks incomplete — check the spelling.";
  if (!form.credential) errors.credential = "Choose the document you need — or 'Not sure yet'.";
  return errors;
}

export function RequestForm({
  documents,
  initialCredential = "",
  onSentRef,
}: {
  /** The document classes on file — titles from the verified register. */
  documents: { title: string; number: string }[];
  /** Pre-selected document title (from an EvidenceSheet request link). */
  initialCredential?: string;
  /** Notified with the CREQ reference after a successful request. */
  onSentRef?: (ref: string | null) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot — never shown to humans
  });
  const [credential, setCredential] = useState(initialCredential);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [creqRef, setCreqRef] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate({ ...form, credential });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      const id = first === "credential" ? "vd-doc" : `vd-${first}`;
      formRef.current?.querySelector<HTMLElement>(`#${id}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const { submitCredentialRequest } = await import("@/lib/cms.functions");
      const chosen =
        credential === NOT_SURE
          ? "Guidance — which document covers the requirement"
          : documents.find((d) => d.title === credential)
            ? `${credential} (${documents.find((d) => d.title === credential)!.number})`
            : credential;
      const res = await submitCredentialRequest({
        data: {
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          credential: chosen,
          message: form.message.trim(),
          website: form.website,
          elapsed_ms: Date.now() - startedAt.current,
        },
      });
      const ref = (res as { ref?: string | null }).ref ?? null;
      setCreqRef(ref);
      onSentRef?.(ref);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rise-line">
        <p className="eyebrow-sans text-muted-foreground/70">{creqRef ?? "Received"}</p>
        <h3 className="mt-6 max-w-[14ch] font-display text-3xl font-normal leading-[1.05] tracking-[-0.02em]">
          Request received.
        </h3>
        <p className="mt-6 max-w-md text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
          The document will be released to this address after verification. For anything urgent, the
          line stays open —{" "}
          <a
            href="/contact"
            className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            the open line
          </a>
          .
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              company: "",
              email: "",
              phone: "",
              message: "",
              website: "",
            });
            setCredential("");
            setCreqRef(null);
            startedAt.current = Date.now();
          }}
          className="mt-10 border-b border-foreground/40 pb-2 text-sm font-medium text-foreground transition-colors hover:border-foreground"
        >
          Request another document
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="w-full"
      aria-label="Request verification documents from Capex"
    >
      <div>
        <Question number="01" label="Your name" hint="Who we're speaking with." htmlFor="vd-name">
          <LineInput
            id="vd-name"
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
          hint="Optional — procurement, vendor enablement, a team of one."
          htmlFor="vd-org"
        >
          <LineInput
            id="vd-org"
            autoComplete="organization"
            maxLength={160}
            value={form.company}
            onChange={set("company")}
            placeholder="Organization"
          />
        </Question>

        <Question
          number="03"
          label="Which document?"
          hint="From the register — what the desk can release."
        >
          <div id="vd-doc" tabIndex={-1}>
            <div className="flex flex-wrap gap-x-7 gap-y-3 md:gap-x-9">
              {documents.map((d) => {
                const active = credential === d.title;
                return (
                  <button
                    key={d.title}
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => setCredential(active ? "" : d.title)}
                    className={`group relative pb-1.5 text-left font-display text-base font-normal tracking-[-0.01em] transition-colors duration-300 md:text-lg ${
                      active ? "text-foreground" : "text-muted-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {d.title}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        active
                          ? "scale-x-100 bg-accent"
                          : "scale-x-0 bg-foreground/50 group-hover:scale-x-100"
                      }`}
                    />
                  </button>
                );
              })}
              <button
                type="button"
                role="checkbox"
                aria-checked={credential === NOT_SURE}
                onClick={() => setCredential(credential === NOT_SURE ? "" : NOT_SURE)}
                className={`group relative pb-1.5 text-left font-display text-base font-normal italic tracking-[-0.01em] transition-colors duration-300 md:text-lg ${
                  credential === NOT_SURE
                    ? "text-foreground"
                    : "text-muted-foreground/80 hover:text-foreground"
                }`}
              >
                Not sure yet
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    credential === NOT_SURE
                      ? "scale-x-100 bg-accent"
                      : "scale-x-0 bg-foreground/50 group-hover:scale-x-100"
                  }`}
                />
              </button>
            </div>
            {errors.credential && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {errors.credential}
              </p>
            )}
          </div>
        </Question>

        <Question
          number="04"
          label="Anything to add?"
          hint="Optional — the requirement behind the request."
          htmlFor="vd-msg"
        >
          <textarea
            id="vd-msg"
            rows={3}
            maxLength={2000}
            value={form.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="Where the document is headed, what it must cover"
            className={`resize-none ${FIELD} ${FIELD_BORDER}`}
          />
        </Question>

        <Question
          number="05"
          label="How should we reach you?"
          hint="Email required; phone optional."
          htmlFor="vd-email"
        >
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <LineInput
              id="vd-email"
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
              id="vd-phone"
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

      <div className="mt-9 flex flex-col gap-6 border-t border-foreground/[0.12] pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[13px] leading-[1.7] text-muted-foreground">
          Documents are released against specific requests only — after the record is verified.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex w-full items-center justify-between gap-8 border border-foreground/30 bg-transparent px-6 py-3.5 font-display text-lg font-medium tracking-[-0.01em] text-foreground transition-colors duration-300 hover:border-foreground/70 disabled:opacity-45 sm:w-fit md:text-xl"
        >
          {status === "sending" ? "Sending…" : "Request"}
          <span
            aria-hidden="true"
            className="inline-block text-base transition-transform duration-300 group-hover:translate-x-1.5 md:text-lg"
          >
            →
          </span>
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-7 text-sm leading-relaxed text-destructive">
          The request could not be sent just now. Please try again — or use{" "}
          <a href="/contact" className="underline underline-offset-4">
            the open line
          </a>
          .
        </p>
      )}
    </form>
  );
}

/** One question: copper numeral + readable label + hint, a rule beneath. */
function Question({
  number,
  label,
  hint,
  htmlFor,
  children,
}: {
  number: string;
  label: string;
  hint: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const titleClass = "font-display text-lg font-normal tracking-[-0.01em] md:text-[1.3rem]";
  return (
    <div className="border-b border-foreground/[0.12] py-6 first:pt-0 md:py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1.5">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={titleClass}>
            <span className="sr-only">Question {number}: </span>
            <span className="font-tech text-[11px] tracking-[0.12em] text-accent">{number}</span>
            <span className="ml-3">{label}</span>
          </label>
        ) : (
          <span className={titleClass}>
            <span className="font-tech text-[11px] tracking-[0.12em] text-accent">{number}</span>
            <span className="ml-3">{label}</span>
          </span>
        )}
        <span className="text-[12px] uppercase leading-[1.5] tracking-[0.1em] text-muted-foreground/80">
          {hint}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** The panel input: hairline rectangle, transparent ground, clear focus. */
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
        className={`${FIELD} ${error ? FIELD_BORDER_ERROR : FIELD_BORDER}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
