-- ✅ حقيبة الترقية على GitHub (18 ملف) — عرض فقط بلا تحميل، بلا زر Google
-- ⚠️ استبدل USER/REPO باسم حسابك ومستودعك ثم شغّل في Supabase
-- إن كنت شغّلت insert_tarqia.sql (روابط Drive) من قبل، احذف القديم أولاً:
-- delete from public.files where category='الترقية';

insert into public.files (title, category, level, description, url, path) values
  ('التعليمية 1', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_01.pdf', 'gh_protected'),
  ('التعليمية 2', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_02.pdf', 'gh_protected'),
  ('تعليمية الاختصاص 1', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_03.pdf', 'gh_protected'),
  ('تعليمية الاختصاص 2', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_04.pdf', 'gh_protected'),
  ('تعليمية الاختصاص 3', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_05.pdf', 'gh_protected'),
  ('تعليمية الاختصاص 4', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_06.pdf', 'gh_protected'),
  ('تعليمية الاختصاص 5', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_07.pdf', 'gh_protected'),
  ('علوم التربية 1', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_08.pdf', 'gh_protected'),
  ('علوم التّربية 2', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_09.pdf', 'gh_protected'),
  ('علوم التربية 3', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_10.pdf', 'gh_protected'),
  ('علوم التربية 4', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_11.pdf', 'gh_protected'),
  ('هندسة التكوين 1', 'الترقية', 'عام', 'هندسة التكوين', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_12.pdf', 'gh_protected'),
  ('هندسة التّكوين 2', 'الترقية', 'عام', 'هندسة التكوين', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_13.pdf', 'gh_protected'),
  ('هندسة التّكوين 3', 'الترقية', 'عام', 'هندسة التكوين', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_14.pdf', 'gh_protected'),
  ('ملخص رائع و شامل في علوم التربية', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_15.pdf', 'gh_protected'),
  ('ملخص في هندسة التكوين', 'الترقية', 'عام', 'هندسة التكوين', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_16.pdf', 'gh_protected'),
  ('ملخصات خاصة بعلوم التربية و الديداكتيك', 'الترقية', 'عام', 'علوم التربية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_17.pdf', 'gh_protected'),
  ('تعليمية العلوم', 'الترقية', 'عام', 'التعليمية', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/tarqia_18.pdf', 'gh_protected');
