-- سجّل ملفات وثائق الأستاذ في قاعدة البيانات
-- ⚠️ استبدل  USER/REPO  باسم حسابك ومستودعك في GitHub قبل التشغيل
-- مثال: لو حسابك ahmed ومستودعك sac-files → cdn.jsdelivr.net/gh/ahmed/sac-files@main/...

insert into public.files (title, category, level, description, url, path) values
  ('دليل الأستاذ - الثانية متوسط', 'وثائق', '2م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/dalil_ostad_2m.pdf', 'dalil_ostad_2m.pdf'),
  ('دليل الأستاذ - الثالثة متوسط', 'وثائق', '3م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/dalil_ostad_3m.pdf', 'dalil_ostad_3m.pdf'),
  ('المخطط السنوي - الأولى متوسط', 'وثائق', '1م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/mokhatat_1m.pdf', 'mokhatat_1m.pdf'),
  ('المخطط السنوي - الثانية متوسط', 'وثائق', '2م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/mokhatat_2m.pdf', 'mokhatat_2m.pdf'),
  ('المخطط السنوي - الثالثة متوسط', 'وثائق', '3م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/mokhatat_3m.pdf', 'mokhatat_3m.pdf'),
  ('المخطط السنوي - الرابعة متوسط', 'وثائق', '4م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/mokhatat_4m.pdf', 'mokhatat_4m.pdf'),
  ('المنهاج 2016', 'وثائق', 'عام', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/minhaj_2016.pdf', 'minhaj_2016.pdf'),
  ('الوثيقة المرافقة - الأولى متوسط', 'وثائق', '1م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/wathika_morafika_1m.pdf', 'wathika_morafika_1m.pdf'),
  ('الكتاب المدرسي - الأولى متوسط', 'كتب', '1م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/ketab_1m.pdf', 'ketab_1m.pdf'),
  ('الكتاب المدرسي - الثالثة متوسط', 'كتب', '3م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/ketab_3m.pdf', 'ketab_3m.pdf'),
  ('كتاب العلوم الطبيعية 2م - الجيل الثاني', 'كتب', '2م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/ketab_2m_g2.pdf', 'ketab_2m_g2.pdf'),
  ('كتاب العلوم الطبيعية 4م - الجيل الثاني', 'كتب', '4م', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/ketab_4m_g2.pdf', 'ketab_4m_g2.pdf'),
  ('دليل بناء الاختبارات', 'وثائق', 'عام', '', 'https://cdn.jsdelivr.net/gh/USER/REPO@main/dalil_bina_ikhtibar.pdf', 'dalil_bina_ikhtibar.pdf');