-- ============================================================
--  إعداد رفع ملفات الأساتذة · منصة SAC · SVT prof
--  الصق هذا الكود في: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) أعمدة جديدة لتتبّع رفع الأساتذة ---------------------------
-- من رفع الملف (بريد الأستاذ) + امتداد الملف للعرض الصحيح
alter table public.files add column if not exists uploaded_by text;
alter table public.files add column if not exists file_ext   text;

-- 2) سياسات الحاوية (تأكيد) ----------------------------------
-- السماح للأساتذة المسجّلين برفع الملفات (موجودة سابقًا، نؤكّدها)
drop policy if exists "storage_insert_files" on storage.objects;
create policy "storage_insert_files"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'files');

-- 3) سياسات الجدول (تأكيد) -----------------------------------
-- السماح بالإضافة (الرفع) للجميع — اللوحة محمية بكلمة مرور من التطبيق
drop policy if exists "insert_files_public" on public.files;
create policy "insert_files_public"
  on public.files for insert
  to anon, authenticated
  with check (true);

-- ============================================================
--  انتهى ✅
--  الآن أي أستاذ مسجّل يمكنه رفع ملف من صفحة المكتبة،
--  ويظهر الملف تلقائيًا مجانيًا مع زر التحميل المباشر.
-- ============================================================
