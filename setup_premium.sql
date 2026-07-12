-- ============================================================
--  نظام المجاني/المدفوع لمنصة SAC · SVT prof
--  الصق في Supabase → SQL Editor → Run
-- ============================================================

-- 1) عمود "مجاني" على جدول الملفات (افتراضيًا كل الملفات مدفوعة) --------
alter table public.files add column if not exists is_free boolean not null default false;

-- 2) جعل عيّنة من كل قسم مجانية (أول 8 ملفات من كل قسم حسب الأقدم) ------
-- نصفّر أولاً
update public.files set is_free = false;

-- عيّنة مجانية: أقدم 8 ملفات من كل قسم
with ranked as (
  select id,
         row_number() over (partition by category order by created_at asc) as rn
  from public.files
)
update public.files f
set is_free = true
from ranked r
where f.id = r.id and r.rn <= 8;

-- ملاحظة: تقدري تغيّري ملفًا معيّنًا يدويًا لاحقًا:
--   update public.files set is_free = true  where id = 123;  -- اجعله مجاني
--   update public.files set is_free = false where id = 123;  -- اجعله مدفوع

-- 3) جدول ملفات المستخدمين (الاشتراكات) --------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  plan        text not null default 'free',      -- free | premium
  expires_at  timestamptz,                        -- تاريخ انتهاء الاشتراك
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- كل مستخدم يقرأ ملفه فقط
drop policy if exists "read_own_profile" on public.profiles;
create policy "read_own_profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

-- كل مستخدم ينشئ/يحدّث ملفه (الاسم فقط عند التسجيل)
drop policy if exists "insert_own_profile" on public.profiles;
create policy "insert_own_profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "update_own_profile" on public.profiles;
create policy "update_own_profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- 4) إنشاء ملف تلقائيًا عند تسجيل مستخدم جديد --------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, plan)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), 'free')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  ✅ انتهى. 
--  - الملفات المجانية: is_free = true (عيّنة 8 من كل قسم)
--  - الباقي مدفوع (يظهر مقفلًا لغير المشتركين)
--  - لتفعيل اشتراك أستاذ يدويًا (بعد الدفع):
--      update public.profiles
--      set plan='premium', expires_at = now() + interval '1 year'
--      where email = 'prof@example.com';
-- ============================================================
