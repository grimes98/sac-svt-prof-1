-- ✅ تسجيل وثائق الأستاذ في قاعدة البيانات (روابط Google Drive مباشرة)
-- لا حاجة للرفع — فقط الصق هذا في Supabase SQL Editor واضغط Run

insert into public.files (title, category, level, description, url, path) values
  ('دليل الأستاذ - الثانية متوسط', 'وثائق', '2م', '', 'https://drive.google.com/file/d/1elFQKeNCqdSz1ftfqXUx8R8O_kZTo8I4/view', 'drive:1elFQKeNCqdSz1ftfqXUx8R8O_kZTo8I4'),
  ('دليل الأستاذ - الثالثة متوسط', 'وثائق', '3م', '', 'https://drive.google.com/file/d/1EJWVOLxKq7FLB_vKT6w66KPnKN1xdD0T/view', 'drive:1EJWVOLxKq7FLB_vKT6w66KPnKN1xdD0T'),
  ('المخطط السنوي - الأولى متوسط', 'وثائق', '1م', '', 'https://drive.google.com/file/d/1NY4374qLReKxFlky8raqF14HYBX7prJB/view', 'drive:1NY4374qLReKxFlky8raqF14HYBX7prJB'),
  ('المخطط السنوي - الثانية متوسط', 'وثائق', '2م', '', 'https://drive.google.com/file/d/1TSc--ow8gcweg5GaQbfRmwhh0gp80vPP/view', 'drive:1TSc--ow8gcweg5GaQbfRmwhh0gp80vPP'),
  ('المخطط السنوي - الثالثة متوسط', 'وثائق', '3م', '', 'https://drive.google.com/file/d/12WjTFbzt0K_yKrcdiRRxuwu-bG7v_8fV/view', 'drive:12WjTFbzt0K_yKrcdiRRxuwu-bG7v_8fV'),
  ('المخطط السنوي - الرابعة متوسط', 'وثائق', '4م', '', 'https://drive.google.com/file/d/1K6yK76b2SeyATwzqMkP_bAF0tbaB3-Py/view', 'drive:1K6yK76b2SeyATwzqMkP_bAF0tbaB3-Py'),
  ('المنهاج 2016', 'وثائق', 'عام', '', 'https://drive.google.com/file/d/1mpl8z0_3PbvZnE4ScHW_H5MoQjwyezsr/view', 'drive:1mpl8z0_3PbvZnE4ScHW_H5MoQjwyezsr'),
  ('الوثيقة المرافقة - الأولى متوسط', 'وثائق', '1م', '', 'https://drive.google.com/file/d/1kL-gAf4QIbFXE1jIWb_0mCWi9282KLm2/view', 'drive:1kL-gAf4QIbFXE1jIWb_0mCWi9282KLm2'),
  ('الكتاب المدرسي - الأولى متوسط', 'كتب', '1م', '', 'https://drive.google.com/file/d/18WB8B58Bpve6XOCsIh99w9ZL25CeOjNg/view', 'drive:18WB8B58Bpve6XOCsIh99w9ZL25CeOjNg'),
  ('الكتاب المدرسي - الثالثة متوسط', 'كتب', '3م', '', 'https://drive.google.com/file/d/1XnneIn5nru1z8jClnd375EZVFf9-zQX2/view', 'drive:1XnneIn5nru1z8jClnd375EZVFf9-zQX2'),
  ('كتاب العلوم الطبيعية 2م - الجيل الثاني', 'كتب', '2م', '', 'https://drive.google.com/file/d/1FCi9EQCmDGXuqoeAQk_5rmAGrDE_8Sm9/view', 'drive:1FCi9EQCmDGXuqoeAQk_5rmAGrDE_8Sm9'),
  ('كتاب العلوم الطبيعية 4م - الجيل الثاني', 'كتب', '4م', '', 'https://drive.google.com/file/d/1zmfA0MJfIRPH0WdK8uc_qbiCt7H4ycnB/view', 'drive:1zmfA0MJfIRPH0WdK8uc_qbiCt7H4ycnB'),
  ('دليل بناء الاختبارات', 'وثائق', 'عام', '', 'https://drive.google.com/file/d/1ZXqir1G8s1RGqYh1a2q5ambrIIKBqTTE/view', 'drive:1ZXqir1G8s1RGqYh1a2q5ambrIIKBqTTE');