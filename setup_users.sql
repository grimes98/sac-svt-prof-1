-- ============================================================
--  جدول المستخدمين (إدارة يدوية من لوحة الإدارة)
--  الصق في Supabase → SQL Editor → Run
-- ============================================================

create table if not exists public.users (
  id                uuid primary key default gen_random_uuid(),
  name              text,
  email             text unique not null,
  password          text not null,
  type              text not null default 'user',   -- user | admin
  subscription_days integer default 30,
  created_at        timestamptz not null default now(),
  expires_at        timestamptz
);

-- حساب تاريخ الانتهاء تلقائيًا من عدد الأيام عند الإضافة/التعديل
create or replace function public.set_user_expiry()
returns trigger language plpgsql as $$
begin
  if new.type = 'admin' then
    new.expires_at := null;                       -- الأدمين بلا انتهاء
  elsif new.subscription_days is not null then
    new.expires_at := now() + (new.subscription_days || ' days')::interval;
  end if;
  return new;
end; $$;

drop trigger if exists trg_user_expiry on public.users;
create trigger trg_user_expiry
  before insert or update of subscription_days, type on public.users
  for each row execute function public.set_user_expiry();

-- الصلاحيات (RLS) — التطبيق محمي بكلمة مرور الأدمين، فنسمح بالعمليات
alter table public.users enable row level security;

drop policy if exists "users_all" on public.users;
create policy "users_all" on public.users
  for all to anon, authenticated
  using (true) with check (true);

-- حساب أدمين افتراضي (بدّلي الإيميل/كلمة المرور بعد التشغيل)
insert into public.users (name, email, password, type)
values ('قريمس أماني', 'grimesamani98@gmail.com', 'admin123', 'admin')
on conflict (email) do nothing;

-- ============================================================
--  ✅ انتهى.
--  - user  = اشتراك محدود بعدد الأيام (expires_at)
--  - admin = بلا انتهاء (Illimité)
-- ============================================================
