-- Создание таблицы обращений (contact_requests)
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    contact_method TEXT NOT NULL, -- 'telegram' или 'email'
    subject TEXT NOT NULL,         -- 'question', 'consultation', 'other'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Включение RLS (Row Level Security)
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Создание политик доступа (Policies)
CREATE POLICY "Allow public insert-only access to contact_requests"
    ON public.contact_requests FOR INSERT
    WITH CHECK (true); -- Любой посетитель сайта может оставить заявку

CREATE POLICY "Allow admin all access to contact_requests"
    ON public.contact_requests FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated'); -- Только авторизованный админ может читать/редактировать
