-- ==============================================================================
-- MAESTRO: Data API Grants (Required for Supabase post Oct 30)
-- ==============================================================================

-- 1. Contact Requests
GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO service_role;

-- 2. Bookings
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO service_role;

-- 3. Articles & Tools (Public Read, Admin Write)
GRANT SELECT ON public.articles, public.tools TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles, public.tools TO service_role;
