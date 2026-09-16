/**
 * Database types — MINIMAL SUBMISSIONS ONLY.
 *
 * The site's content types (Project, Service, Sector, Person, Client,
 * Credential, Office…) are application types that live in the corpus modules
 * (src/lib/*-corpus.ts) and site-data.ts. The database is not a content
 * source, so it generates no content types here. What remains is the shape
 * of the two submission RPCs — the only database surface the website uses.
 */

export type SubmitFormSubmissionArgs = {
  p_form_type: string;
  p_name: string | null;
  p_email: string | null;
  p_phone: string | null;
  p_subject: string | null;
  p_message: string | null;
  p_data: Record<string, string>;
  p_ip_hash: string;
  p_user_agent_hash: string | null;
  p_practice?: string | null;
  p_service_slug?: string | null;
};

export type SubmitCredentialRequestArgs = {
  p_name: string;
  p_company: string | null;
  p_email: string;
  p_phone: string | null;
  p_credential: string;
  p_message: string | null;
  p_ip_hash: string;
  p_user_agent_hash: string | null;
};

/** The submissions-only database surface consumed by createClient<T>. */
export type SubmissionDatabase = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      submit_form_submission: {
        Args: SubmitFormSubmissionArgs;
        Returns: string;
      };
      submit_credential_request: {
        Args: SubmitCredentialRequestArgs;
        Returns: string;
      };
    };
  };
};
