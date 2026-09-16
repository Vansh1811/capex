INSERT INTO public.site_settings (key, value) VALUES
  ('brand_wordmark', 'CAPEX'),
  ('logo_tagline', 'Construction & Engineering')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;