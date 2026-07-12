-- ==============================================================================
-- 🗑️ كود مسح وإعادة إنشاء جدول المستخدمين (profiles & users) من الصفر في Supabase 🗑️
-- انسخ هذا الكود كاملاً والصقه في: Supabase → SQL Editor → New query → اضغط Run
-- ==============================================================================

-- 1️⃣ حذف الجداول القديمة (profiles و users) نهائياً مع كافة المشغلات التابعة لها
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.set_user_expiry() CASCADE;

-- 2️⃣ إنشاء جدول المستخدمين والمسؤولين الجديد (users) بمواصفات المنصة الشاملة
CREATE TABLE public.users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT,
  email             TEXT UNIQUE NOT NULL,
  password          TEXT NOT NULL,
  type              TEXT NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
  subscription_days INTEGER DEFAULT 30,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at        TIMESTAMPTZ
);

-- 3️⃣ دالة ومشغل (Trigger) لحساب وتحديث تاريخ انتهاء صلاحية اشتراك المستخدم تلقائياً
CREATE OR REPLACE FUNCTION public.set_user_expiry()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.type = 'admin' THEN
    NEW.expires_at := NULL;                       -- المسؤول بلا تاريخ انتهاء (صلاحية دائمة)
  ELSIF NEW.subscription_days IS NOT NULL THEN
    NEW.expires_at := now() + (NEW.subscription_days || ' days')::interval;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_user_expiry
  BEFORE INSERT OR UPDATE OF subscription_days, type ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_user_expiry();

-- 4️⃣ تفعيل حماية الصفوف (RLS) والسماح لكافة العمليات لمنصتك
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_all_policy" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5️⃣ إدراج الحسابات الافتراضية الجاهزة فوراً لبدء العمل دون تأخير
INSERT INTO public.users (name, email, password, type, subscription_days)
VALUES ('مسؤول المنصة (الأدمين)', 'admin@sac-svt.dz', 'admin123', 'admin', NULL);

INSERT INTO public.users (name, email, password, type, subscription_days)
VALUES ('قريمس أماني (الأدمين)', 'grimesamani98@gmail.com', 'admin123', 'admin', NULL);

INSERT INTO public.users (name, email, password, type, subscription_days)
VALUES ('الأستاذ التجريبي (wided)', 'grimaldiwidad@gmail.com', '1234', 'user', 30);

-- ==============================================================================
-- ✅ تم مسح الجداول القديمة وإنشاء الجدول الجديد بنجاح! قاعدة بياناتك الآن نظيفة ومربوطة 100%.
-- ==============================================================================
