-- CareNova Fictional Healthcare Platform - Supabase Seed & Schema Script
-- This script sets up tables and fictional seed data for CareNova demonstration.
-- Run this script inside the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query).

-- =========================================================================
-- 1. DOCTORS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  specialty_id TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 5,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.8,
  review_count INTEGER NOT NULL DEFAULT 100,
  image TEXT NOT NULL,
  bio TEXT NOT NULL,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  areas_of_expertise JSONB NOT NULL DEFAULT '[]'::jsonb,
  languages JSONB NOT NULL DEFAULT '["English"]'::jsonb,
  consultation_fee INTEGER NOT NULL DEFAULT 120,
  next_available TEXT NOT NULL DEFAULT 'Tomorrow · 10:00 AM',
  available_days JSONB NOT NULL DEFAULT '["Monday","Wednesday","Friday"]'::jsonb,
  location TEXT NOT NULL DEFAULT 'CareNova Central Medical Hub',
  telehealth_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS & Public Read Policy
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'doctors' AND policyname = 'Allow public select on doctors'
  ) THEN
    CREATE POLICY "Allow public select on doctors"
      ON public.doctors FOR SELECT
      USING (true);
  END IF;
END $$;

-- =========================================================================
-- 2. SERVICES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Stethoscope',
  common_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_to_expect TEXT NOT NULL,
  average_duration TEXT NOT NULL DEFAULT '30 - 45 min',
  lead_specialist_specialty TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS & Public Read Policy
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Allow public select on services'
  ) THEN
    CREATE POLICY "Allow public select on services"
      ON public.services FOR SELECT
      USING (true);
  END IF;
END $$;

-- =========================================================================
-- 3. APPOINTMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  doctor_id TEXT,
  specialty TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'in-clinic',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS & Public Insert Policy
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Allow public insert on appointments'
  ) THEN
    CREATE POLICY "Allow public insert on appointments"
      ON public.appointments FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- =========================================================================
-- 4. CONTACT MESSAGES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS & Public Insert Policy
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Allow public insert on contact_messages'
  ) THEN
    CREATE POLICY "Allow public insert on contact_messages"
      ON public.contact_messages FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- =========================================================================
-- 5. SEED DATA: FICTIONAL DOCTORS
-- =========================================================================
INSERT INTO public.doctors (
  id, name, title, specialty, specialty_id, experience_years, rating, review_count, image, bio,
  education, certifications, areas_of_expertise, languages, consultation_fee, next_available,
  available_days, location, telehealth_available
)
VALUES
  (
    'dr-anaya-sharma',
    'Dr. Anaya Sharma',
    'Consultant Cardiologist · MBBS, MD, DM',
    'Cardiology',
    'cardiology',
    12,
    4.9,
    142,
    '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg',
    'Dr. Anaya Sharma is a consultant cardiologist specializing in preventive cardiology, echocardiography, and non-invasive cardiovascular management with 12 years of clinical experience in this CareNova prototype.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (12 yrs exp)", "MD — General Medicine", "DM — Cardiology (Super-Speciality Training)"]'::jsonb,
    '["Board Certification in Clinical Cardiology (Prototype Demo)", "Fellowship in Non-Invasive Cardiac Imaging", "Echocardiography Excellence Certification"]'::jsonb,
    '["Preventive Cardiovascular Health", "Hypertension & Lipid Management", "Coronary Artery Assessment", "Advanced 2D/3D Echocardiography", "Cardiac Rhythm Monitoring"]'::jsonb,
    '["English", "Hindi", "Gujarati"]'::jsonb,
    160,
    'Today · 3:30 PM',
    '["Monday", "Wednesday", "Thursday", "Friday"]'::jsonb,
    'CareNova Central Medical Hub · Suite 402',
    TRUE
  ),
  (
    'dr-rohan-mehta',
    'Dr. Rohan Mehta',
    'Consultant Physician, Primary Care · MBBS, MD',
    'General Medicine',
    'general-medicine',
    9,
    4.8,
    198,
    '/src/assets/images/doctor_rohan_mehta_1791263891775.jpg',
    'Dr. Rohan Mehta provides comprehensive adult primary care with a special interest in chronic disease management, metabolic wellness, and routine preventive health screenings with 9 years of clinical experience.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (9 yrs exp)", "MD — Internal Medicine", "Postgraduate Certificate in Diabetes Care & Metabolic Health"]'::jsonb,
    '["Board Certification in Internal Medicine (Prototype Demo)", "Certified Clinical Diabetology Practitioner", "Advanced Clinical Life Support Certification"]'::jsonb,
    '["Comprehensive Adult Health Screenings", "Type 2 Diabetes & Metabolic Syndrome", "Hypertension Management", "Preventive Immunization & Health Audits", "Acute Illness Diagnostics"]'::jsonb,
    '["English", "Hindi", "Marathi"]'::jsonb,
    120,
    'Tomorrow · 10:00 AM',
    '["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"]'::jsonb,
    'CareNova Downtown Clinic · Floor 2',
    TRUE
  ),
  (
    'dr-kavya-patel',
    'Dr. Kavya Patel',
    'Consultant Dermatologist · MBBS, MD, DNB',
    'Dermatology',
    'dermatology',
    8,
    4.9,
    115,
    '/src/assets/images/doctor_kavya_patel_1791263902635.jpg',
    'Dr. Kavya Patel provides comprehensive medical and procedural dermatology for diverse skin types. Her clinical practice addresses inflammatory dermatoses, acne management, psoriasis therapies, and skin health surveillance with 8 years of clinical experience.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (8 yrs exp)", "MD — Dermatology, Venereology & Leprosy", "DNB — National Board in Dermatology"]'::jsonb,
    '["Fellowship in Clinical Dermatosurgery (Prototype Demo)", "Dermoscopy & Skin Imaging Certification", "Aesthetic & Clinical Dermatology Certificate"]'::jsonb,
    '["Full-Body Dermoscopy & Mole Checks", "Acne & Rosacea Treatment Protocols", "Atopic Dermatitis & Eczema Control", "Hair & Scalp Health Assessment", "Benign Lesion Cryotherapy & Excision"]'::jsonb,
    '["English", "Hindi", "Gujarati"]'::jsonb,
    145,
    'Thursday · 11:30 AM',
    '["Tuesday", "Thursday", "Friday"]'::jsonb,
    'CareNova Westside Pavilion · Suite 210',
    TRUE
  ),
  (
    'dr-arjun-rao',
    'Dr. Arjun Rao',
    'Consultant Orthopaedic Surgeon · MBBS, MS',
    'Orthopedics',
    'orthopedics',
    11,
    4.9,
    167,
    '/src/assets/images/doctor_arjun_rao_1791263913254.jpg',
    'Dr. Arjun Rao specializes in adult joint preservation, sports injury rehabilitation, and non-operative mobility management with 11 years of clinical experience.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (11 yrs exp)", "MS — Orthopaedics", "Fellowship in Joint Reconstruction & Arthroscopy"]'::jsonb,
    '["Board Certification in Orthopaedic Surgery (Prototype Demo)", "Sports Injury & Arthroscopic Surgery Fellow", "Joint Preservation & Cartilage Repair Fellow"]'::jsonb,
    '["Knee & Hip Osteoarthritis Management", "Sports Ligament & Tendon Injuries", "Minimally Invasive Joint Injections", "Rotator Cuff & Shoulder Pain", "Post-Traumatic Fracture Rehabilitation"]'::jsonb,
    '["English", "Kannada", "Telugu", "Hindi"]'::jsonb,
    175,
    'Wednesday · 2:00 PM',
    '["Monday", "Wednesday", "Friday"]'::jsonb,
    'CareNova Sports & Orthopedic Wing · Suite 510',
    FALSE
  ),
  (
    'dr-neha-kapoor',
    'Dr. Neha Kapoor',
    'Senior Paediatrician · MBBS, MD, DCH',
    'Pediatrics',
    'pediatrics',
    10,
    4.9,
    210,
    '/src/assets/images/doctor_neha_kapoor_1791263927560.jpg',
    'Dr. Neha Kapoor is dedicated to compassionate child healthcare from infancy through adolescence with 10 years of clinical experience, focusing on developmental tracking, preventative immunization, and parental guidance.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (10 yrs exp)", "MD — Paediatrics", "DCH — Diploma in Child Health"]'::jsonb,
    '["Board Certification in Paediatric Medicine (Prototype Demo)", "Paediatric Advanced Life Support Certification", "Neonatal Resuscitation & Care Certification"]'::jsonb,
    '["Well-Child Developmental Checkups", "Infant Nutrition & Growth Tracking", "Childhood Asthma & Allergy Care", "Immunization & Preventative Health", "Adolescent Health Guidance"]'::jsonb,
    '["English", "Hindi", "Punjabi"]'::jsonb,
    130,
    'Tomorrow · 1:30 PM',
    '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]'::jsonb,
    'CareNova Family & Child Center · Suite 105',
    TRUE
  ),
  (
    'dr-vihaan-shah',
    'Dr. Vihaan Shah',
    'Consultant Nutritionist & Lifestyle Physician · MBBS, MD',
    'Nutrition',
    'nutrition',
    7,
    4.8,
    94,
    '/src/assets/images/doctor_vihaan_shah_1791263940648.jpg',
    'Dr. Vihaan Shah combines clinical medicine with nutritional biochemistry to deliver customized medical nutrition therapy with 7 years of clinical experience.',
    '["MBBS — Bachelor of Medicine, Bachelor of Surgery (7 yrs exp)", "MD — Community & Lifestyle Medicine", "Postgraduate Diploma in Clinical Nutrition"]'::jsonb,
    '["Clinical Nutrition Specialist Certification (Prototype Demo)", "Diplomate in Lifestyle Medicine", "Metabolic Health & Glycemic Regulation Certification"]'::jsonb,
    '["Metabolic Health & Glycemic Regulation", "Cardioprotective Dietary Protocols", "GI Microbiome & Anti-Inflammatory Nutrition", "Athletic Performance Fueling", "Sustainable Habit Engineering"]'::jsonb,
    '["English", "Hindi", "Marathi"]'::jsonb,
    110,
    'Today · 4:45 PM',
    '["Tuesday", "Wednesday", "Thursday", "Saturday"]'::jsonb,
    'CareNova Wellness & Prevention Center · Suite 320',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  specialty = EXCLUDED.specialty,
  experience_years = EXCLUDED.experience_years,
  rating = EXCLUDED.rating,
  image = EXCLUDED.image,
  bio = EXCLUDED.bio,
  consultation_fee = EXCLUDED.consultation_fee;

-- =========================================================================
-- 6. SEED DATA: FICTIONAL SERVICES
-- =========================================================================
INSERT INTO public.services (
  id, name, slug, category, short_description, full_description, icon_name,
  common_conditions, what_to_expect, average_duration, lead_specialist_specialty
)
VALUES
  (
    'srv-general-medicine',
    'General Medicine',
    'general-medicine',
    'Primary Care',
    'Comprehensive adult health evaluations, disease prevention, acute symptoms triage, and ongoing chronic care coordination.',
    'Our General Medicine division serves as the central anchor of your healthcare journey. From diagnosing unexpected ailments to managing complex ongoing conditions like diabetes and high blood pressure, our primary care doctors coordinate comprehensive care tailored to your individual medical history.',
    'Stethoscope',
    '["Hypertension", "Type 2 Diabetes", "Seasonal Respiratory Infections", "Fatigue & Thyroid Imbalances", "Annual Physical Screenings"]'::jsonb,
    'A thorough 30-45 minute clinical review of your medical history, vitals check, physical exam, medication audit, and baseline lab orders if indicated.',
    '30 - 45 min',
    'General Medicine'
  ),
  (
    'srv-cardiology',
    'Cardiology',
    'cardiology',
    'Specialty Care',
    'Advanced cardiovascular risk assessment, diagnostic electrocardiograms, and customized heart health plans.',
    'CareNova Cardiology brings together non-invasive diagnostic precision and evidence-based clinical protocols. We assess heart rhythm, lipid biomarkers, vascular health, and arterial wellness to keep your cardiovascular system performing at its strongest.',
    'HeartPulse',
    '["Arrhythmia & Palpitations", "High Cholesterol (Hyperlipidemia)", "Coronary Artery Health", "Chest Discomfort Evaluation", "Family History Cardiac Risk"]'::jsonb,
    'Resting 12-lead ECG review, cardiovascular risk profiling, blood pressure dynamics mapping, and lifestyle prescription with targeted specialist follow-up.',
    '45 - 60 min',
    'Cardiology'
  ),
  (
    'srv-dermatology',
    'Dermatology',
    'dermatology',
    'Specialty Care',
    'Targeted skin assessments, dermoscopic mole surveillance, acne therapies, and chronic dermatological treatments.',
    'Our Dermatology service treats both clinical and aesthetic skin health. Using high-resolution polarized dermoscopy, our specialists diagnose skin conditions early, design personalized topical regimens, and treat stubborn conditions with patient-first precision.',
    'Sparkles',
    '["Acne Vulgaris & Cystic Breakouts", "Atypical Nevi (Mole Checks)", "Eczema & Atopic Dermatitis", "Psoriasis Flare-ups", "Alopecia & Scalp Disorders"]'::jsonb,
    'Complete head-to-toe or localized cutaneous exam under dermoscopic illumination, tissue photography if needed, and clear at-home therapeutic regimen.',
    '30 min',
    'Dermatology'
  ),
  (
    'srv-pediatrics',
    'Pediatrics',
    'pediatrics',
    'Family Care',
    'Gentle, attentive clinical care for newborns, children, and adolescents, including developmental milestones and immunizations.',
    'CareNova Pediatrics creates a welcoming, reassuring environment for young patients and parents alike. Our pediatricians focus on whole-child wellbeing: developmental tracking, sensory milestones, preventative nutrition, and acute pediatric triage.',
    'Baby',
    '["Pediatric Immunizations", "Childhood Asthma & Allergies", "Growth & Developmental Delays", "Ear Infections (Otitis Media)", "School & Sports Physicals"]'::jsonb,
    'Gentle exam in a child-friendly clinic suite, milestone questionnaire review, growth percentiles review, and plenty of time for parental questions.',
    '30 - 45 min',
    'Pediatrics'
  ),
  (
    'srv-orthopedics',
    'Orthopedics',
    'orthopedics',
    'Specialty Care',
    'Musculoskeletal pain management, joint preservation, sports injury evaluation, and conservative mobility rehabilitation.',
    'Our Orthopedics team is dedicated to restoring pain-free movement. Whether you are dealing with chronic back strain, acute athletic joint pain, or advancing degenerative arthritis, we offer comprehensive clinical diagnosis, digital imaging coordination, and tailored recovery paths.',
    'Activity',
    '["Knee Meniscus & Ligament Sprains", "Hip & Shoulder Osteoarthritis", "Rotator Cuff Tendinopathy", "Lower Back Strain & Sciatica", "Carpal Tunnel Syndrome"]'::jsonb,
    'Range of motion assessment, targeted joint stress testing, gait analysis, immediate referral for digital X-ray/MRI if indicated, and conservative rehab planning.',
    '40 min',
    'Orthopedics'
  ),
  (
    'srv-mental-wellness',
    'Mental Wellness',
    'mental-wellness',
    'Behavioral Health',
    'Confidential clinical assessments, stress and burnout mitigation, cognitive guidance, and collaborative emotional health plans.',
    'Mental health is foundational to overall vitality. CareNova provides a calm, stigma-free environment to discuss emotional wellbeing, work-induced burnout, anxiety patterns, and life adjustments with licensed behavioral healthcare practitioners.',
    'Brain',
    '["Workplace Burnout & Stress", "Mild-to-Moderate Anxiety", "Depressive Symptoms", "Sleep Cycle Disruptions", "Life Transition Challenges"]'::jsonb,
    'A confidential, empathetic 50-minute consultation exploring your concerns, validated psychometric screening tools, and an agreed-upon support strategy.',
    '50 min',
    'General Medicine'
  ),
  (
    'srv-nutrition',
    'Nutrition & Metabolic Health',
    'nutrition',
    'Lifestyle Medicine',
    'Evidence-based medical nutrition therapy, glycemic management, metabolic recovery, and sustainable dietary habit design.',
    'Food is medicine when applied with clinical precision. Our clinical nutritionists analyze your bloodwork, metabolism, daily routines, and food relationships to craft sustainable eating plans that optimize energy, reduce inflammation, and normalize blood markers.',
    'Salad',
    '["Prediabetes & Insulin Resistance", "Digestive Sensitivities & IBS", "Non-Alcoholic Fatty Liver (NAFLD)", "Cholesterol Optimization", "Post-Op Nutritional Guidance"]'::jsonb,
    'Detailed 7-day nutritional intake review, metabolic biomarker analysis, bioimpedance assessment, and a practical grocery/meal blueprint tailored to your palate.',
    '45 min',
    'Nutrition'
  ),
  (
    'srv-preventive-care',
    'Preventive Care',
    'preventive-care',
    'Wellness & Prevention',
    'Proactive full-body health audits, biometric diagnostics, age-stratified screening schedules, and longevity planning.',
    'Modern healthcare should prevent illness before it emerges. CareNova Preventive Care conducts holistic baseline audits: cardiovascular risk, metabolic health, cancer screening intervals, and environmental lifestyle risk factors to build your personal longevity roadmap.',
    'ShieldCheck',
    '["Annual Executive Health Audits", "Family Genetic Risk Mapping", "Vaccine Schedules", "Bone Density Surveillance", "Cardiovascular Risk Stratification"]'::jsonb,
    'Comprehensive lab panel review, body composition mapping, personalized immunization updates, and an annual preventive action checklist.',
    '45 min',
    'General Medicine'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description;
