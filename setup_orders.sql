-- ==============================================================================
-- 🌟 كود إعداد جدول ومرفقات طلبات الخدمات المخصصة (service_orders & sac-uploads) 🌟
-- انسخ هذا الكود كاملاً والصقه في: Supabase → SQL Editor → New query → اضغط Run
-- ==============================================================================

-- 1️⃣ جدول طلبات الخدمات المخصصة (service_orders) -------------------------------
CREATE TABLE IF NOT EXISTS public.service_orders (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,
  name        TEXT NOT NULL,
  contact     TEXT NOT NULL,
  level       TEXT,
  package     TEXT,
  details     TEXT,
  target_date TEXT,
  file_name   TEXT,
  file_url    TEXT,
  status      TEXT DEFAULT 'قيد المعالجة والإنجاز 🚀',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_orders_created_at_idx ON public.service_orders (created_at DESC);
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_orders_select" ON public.service_orders;
CREATE POLICY "service_orders_select" ON public.service_orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_orders_insert" ON public.service_orders;
CREATE POLICY "service_orders_insert" ON public.service_orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "service_orders_update" ON public.service_orders;
CREATE POLICY "service_orders_update" ON public.service_orders FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_orders_delete" ON public.service_orders;
CREATE POLICY "service_orders_delete" ON public.service_orders FOR DELETE TO anon, authenticated USING (true);


-- 2️⃣ حاوية التخزين السحابي لمرفقات طلبات الخدمات (sac-uploads bucket) -----------
INSERT INTO storage.buckets (id, name, public)
VALUES ('sac-uploads', 'sac-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "storage_read_sac_uploads" ON storage.objects;
CREATE POLICY "storage_read_sac_uploads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'sac-uploads');

DROP POLICY IF EXISTS "storage_insert_sac_uploads" ON storage.objects;
CREATE POLICY "storage_insert_sac_uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'sac-uploads');

DROP POLICY IF EXISTS "storage_update_sac_uploads" ON storage.objects;
CREATE POLICY "storage_update_sac_uploads" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'sac-uploads');

DROP POLICY IF EXISTS "storage_delete_sac_uploads" ON storage.objects;
CREATE POLICY "storage_delete_sac_uploads" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'sac-uploads');
