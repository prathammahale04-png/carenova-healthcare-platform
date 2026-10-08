import { Doctor, HealthcareService, FAQItem, PatientTestimonial } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_healthcare_clinic_1791263865566.jpg';
export const PRODUCT_HERO_IMAGE = '/src/assets/images/carenova_digital_product_preview_1791265126919.jpg';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'dr-anaya-sharma',
    name: 'Dr. Anaya Sharma',
    title: 'Consultant Cardiologist · MBBS, MD, DM',
    specialty: 'Cardiology',
    specialtyId: 'cardiology',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 142,
    image: '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg',
    bio: 'Dr. Anaya Sharma is a consultant cardiologist specializing in preventive cardiology, echocardiography, and non-invasive cardiovascular management. With 12 years of clinical experience, she emphasizes lifestyle interventions alongside advanced diagnostics in this CareNova prototype.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (12 yrs exp)',
      'MD — General Medicine',
      'DM — Cardiology (Super-Speciality Training)'
    ],
    certifications: [
      'Board Certification in Clinical Cardiology (Prototype Demo)',
      'Fellowship in Non-Invasive Cardiac Imaging',
      'Echocardiography Excellence Certification'
    ],
    areasOfExpertise: [
      'Preventive Cardiovascular Health',
      'Hypertension & Lipid Management',
      'Coronary Artery Assessment',
      'Advanced 2D/3D Echocardiography',
      'Cardiac Rhythm Monitoring'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 160,
    nextAvailable: 'Today · 3:30 PM',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'CareNova Central Medical Hub · Suite 402',
    telehealthAvailable: true
  },
  {
    id: 'dr-rohan-mehta',
    name: 'Dr. Rohan Mehta',
    title: 'Consultant Physician, Primary Care · MBBS, MD',
    specialty: 'General Medicine',
    specialtyId: 'general-medicine',
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 198,
    image: '/src/assets/images/doctor_rohan_mehta_1791263891775.jpg',
    bio: 'Dr. Rohan Mehta provides comprehensive adult primary care with a special interest in chronic disease management, metabolic wellness, and routine preventive health screenings with 9 years of clinical experience.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (9 yrs exp)',
      'MD — Internal Medicine',
      'Postgraduate Certificate in Diabetes Care & Metabolic Health'
    ],
    certifications: [
      'Board Certification in Internal Medicine (Prototype Demo)',
      'Certified Clinical Diabetology Practitioner',
      'Advanced Clinical Life Support Certification'
    ],
    areasOfExpertise: [
      'Comprehensive Adult Health Screenings',
      'Type 2 Diabetes & Metabolic Syndrome',
      'Hypertension Management',
      'Preventive Immunization & Health Audits',
      'Acute Illness Diagnostics'
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 120,
    nextAvailable: 'Tomorrow · 10:00 AM',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    location: 'CareNova Downtown Clinic · Floor 2',
    telehealthAvailable: true
  },
  {
    id: 'dr-kavya-patel',
    name: 'Dr. Kavya Patel',
    title: 'Consultant Dermatologist · MBBS, MD, DNB',
    specialty: 'Dermatology',
    specialtyId: 'dermatology',
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 115,
    image: '/src/assets/images/doctor_kavya_patel_1791263902635.jpg',
    bio: 'Dr. Kavya Patel provides comprehensive medical and procedural dermatology for diverse skin types. Her clinical practice addresses inflammatory dermatoses, acne management, psoriasis therapies, and skin health surveillance with 8 years of clinical experience.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (8 yrs exp)',
      'MD — Dermatology, Venereology & Leprosy',
      'DNB — National Board in Dermatology'
    ],
    certifications: [
      'Fellowship in Clinical Dermatosurgery (Prototype Demo)',
      'Dermoscopy & Skin Imaging Certification',
      'Aesthetic & Clinical Dermatology Certificate'
    ],
    areasOfExpertise: [
      'Full-Body Dermoscopy & Mole Checks',
      'Acne & Rosacea Treatment Protocols',
      'Atopic Dermatitis & Eczema Control',
      'Hair & Scalp Health Assessment',
      'Benign Lesion Cryotherapy & Excision'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 145,
    nextAvailable: 'Thursday · 11:30 AM',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    location: 'CareNova Westside Pavilion · Suite 210',
    telehealthAvailable: true
  },
  {
    id: 'dr-arjun-rao',
    name: 'Dr. Arjun Rao',
    title: 'Consultant Orthopaedic Surgeon · MBBS, MS',
    specialty: 'Orthopedics',
    specialtyId: 'orthopedics',
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 167,
    image: '/src/assets/images/doctor_arjun_rao_1791263913254.jpg',
    bio: 'Dr. Arjun Rao specializes in adult joint preservation, sports injury rehabilitation, and non-operative mobility management. He works with physical therapists to restore pain-free functional mobility with 11 years of clinical experience.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (11 yrs exp)',
      'MS — Orthopaedics',
      'Fellowship in Joint Reconstruction & Arthroscopy'
    ],
    certifications: [
      'Board Certification in Orthopaedic Surgery (Prototype Demo)',
      'Sports Injury & Arthroscopic Surgery Fellow',
      'Joint Preservation & Cartilage Repair Fellow'
    ],
    areasOfExpertise: [
      'Knee & Hip Osteoarthritis Management',
      'Sports Ligament & Tendon Injuries',
      'Minimally Invasive Joint Injections',
      'Rotator Cuff & Shoulder Pain',
      'Post-Traumatic Fracture Rehabilitation'
    ],
    languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
    consultationFee: 175,
    nextAvailable: 'Wednesday · 2:00 PM',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    location: 'CareNova Sports & Orthopedic Wing · Suite 510',
    telehealthAvailable: false
  },
  {
    id: 'dr-neha-kapoor',
    name: 'Dr. Neha Kapoor',
    title: 'Senior Paediatrician · MBBS, MD, DCH',
    specialty: 'Pediatrics',
    specialtyId: 'pediatrics',
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 210,
    image: '/src/assets/images/doctor_neha_kapoor_1791263927560.jpg',
    bio: 'Dr. Neha Kapoor is dedicated to compassionate child healthcare from infancy through adolescence with 10 years of clinical experience. She focuses on developmental tracking, preventative immunization, and parental guidance.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (10 yrs exp)',
      'MD — Paediatrics',
      'DCH — Diploma in Child Health'
    ],
    certifications: [
      'Board Certification in Paediatric Medicine (Prototype Demo)',
      'Paediatric Advanced Life Support Certification',
      'Neonatal Resuscitation & Care Certification'
    ],
    areasOfExpertise: [
      'Well-Child Developmental Checkups',
      'Infant Nutrition & Growth Tracking',
      'Childhood Asthma & Allergy Care',
      'Immunization & Preventative Health',
      'Adolescent Health Guidance'
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 130,
    nextAvailable: 'Tomorrow · 1:30 PM',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'CareNova Family & Child Center · Suite 105',
    telehealthAvailable: true
  },
  {
    id: 'dr-vihaan-shah',
    name: 'Dr. Vihaan Shah',
    title: 'Consultant Nutritionist & Lifestyle Physician · MBBS, MD',
    specialty: 'Nutrition',
    specialtyId: 'nutrition',
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 94,
    image: '/src/assets/images/doctor_vihaan_shah_1791263940648.jpg',
    bio: 'Dr. Vihaan Shah combines clinical medicine with nutritional biochemistry to deliver customized medical nutrition therapy with 7 years of clinical experience. He supports metabolic recovery, glycemic management, and sustainable habits.',
    education: [
      'MBBS — Bachelor of Medicine, Bachelor of Surgery (7 yrs exp)',
      'MD — Community & Lifestyle Medicine',
      'Postgraduate Diploma in Clinical Nutrition'
    ],
    certifications: [
      'Clinical Nutrition Specialist Certification (Prototype Demo)',
      'Diplomate in Lifestyle Medicine',
      'Metabolic Health & Glycemic Regulation Certification'
    ],
    areasOfExpertise: [
      'Metabolic Health & Glycemic Regulation',
      'Cardioprotective Dietary Protocols',
      'GI Microbiome & Anti-Inflammatory Nutrition',
      'Athletic Performance Fueling',
      'Sustainable Habit Engineering'
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 110,
    nextAvailable: 'Today · 4:45 PM',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    location: 'CareNova Wellness & Prevention Center · Suite 320',
    telehealthAvailable: true
  }
];

export const MOCK_SERVICES: HealthcareService[] = [
  {
    id: 'srv-general-medicine',
    name: 'General Medicine',
    slug: 'general-medicine',
    category: 'Primary Care',
    shortDescription: 'Comprehensive adult health evaluations, disease prevention, acute symptoms triage, and ongoing chronic care coordination.',
    fullDescription: 'Our General Medicine division serves as the central anchor of your healthcare journey. From diagnosing unexpected ailments to managing complex ongoing conditions like diabetes and high blood pressure, our primary care doctors coordinate comprehensive care tailored to your individual medical history.',
    iconName: 'Stethoscope',
    commonConditions: ['Hypertension', 'Type 2 Diabetes', 'Seasonal Respiratory Infections', 'Fatigue & Thyroid Imbalances', 'Annual Physical Screenings'],
    whatToExpect: 'A thorough 30-45 minute clinical review of your medical history, vitals check, physical exam, medication audit, and baseline lab orders if indicated.',
    averageDuration: '30 - 45 min',
    leadSpecialistSpecialty: 'General Medicine'
  },
  {
    id: 'srv-cardiology',
    name: 'Cardiology',
    slug: 'cardiology',
    category: 'Specialty Care',
    shortDescription: 'Advanced cardiovascular risk assessment, diagnostic electrocardiograms, and customized heart health plans.',
    fullDescription: 'CareNova Cardiology brings together non-invasive diagnostic precision and evidence-based clinical protocols. We assess heart rhythm, lipid biomarkers, vascular health, and arterial wellness to keep your cardiovascular system performing at its strongest.',
    iconName: 'HeartPulse',
    commonConditions: ['Arrhythmia & Palpitations', 'High Cholesterol (Hyperlipidemia)', 'Coronary Artery Health', 'Chest Discomfort Evaluation', 'Family History Cardiac Risk'],
    whatToExpect: 'Resting 12-lead ECG review, cardiovascular risk profiling, blood pressure dynamics mapping, and lifestyle prescription with targeted specialist follow-up.',
    averageDuration: '45 - 60 min',
    leadSpecialistSpecialty: 'Cardiology'
  },
  {
    id: 'srv-dermatology',
    name: 'Dermatology',
    slug: 'dermatology',
    category: 'Specialty Care',
    shortDescription: 'Targeted skin assessments, dermoscopic mole surveillance, acne therapies, and chronic dermatological treatments.',
    fullDescription: 'Our Dermatology service treats both clinical and aesthetic skin health. Using high-resolution polarized dermoscopy, our specialists diagnose skin conditions early, design personalized topical regimens, and treat stubborn conditions with patient-first precision.',
    iconName: 'Sparkles',
    commonConditions: ['Acne Vulgaris & Cystic Breakouts', 'Atypical Nevi (Mole Checks)', 'Eczema & Atopic Dermatitis', 'Psoriasis Flare-ups', 'Alopecia & Scalp Disorders'],
    whatToExpect: 'Complete head-to-toe or localized cutaneous exam under dermoscopic illumination, tissue photography if needed, and clear at-home therapeutic regimen.',
    averageDuration: '30 min',
    leadSpecialistSpecialty: 'Dermatology'
  },
  {
    id: 'srv-pediatrics',
    name: 'Pediatrics',
    slug: 'pediatrics',
    category: 'Family Care',
    shortDescription: 'Gentle, attentive clinical care for newborns, children, and adolescents, including developmental milestones and immunizations.',
    fullDescription: 'CareNova Pediatrics creates a welcoming, reassuring environment for young patients and parents alike. Our pediatricians focus on whole-child wellbeing: developmental tracking, sensory milestones, preventative nutrition, and acute pediatric triage.',
    iconName: 'Baby',
    commonConditions: ['Pediatric Immunizations', 'Childhood Asthma & Allergies', 'Growth & Developmental Delays', 'Ear Infections (Otitis Media)', 'School & Sports Physicals'],
    whatToExpect: 'Gentle exam in a child-friendly clinic suite, milestone milestone questionnaire review, growth percentiles review, and plenty of time for parental questions.',
    averageDuration: '30 - 45 min',
    leadSpecialistSpecialty: 'Pediatrics'
  },
  {
    id: 'srv-orthopedics',
    name: 'Orthopedics',
    slug: 'orthopedics',
    category: 'Specialty Care',
    shortDescription: 'Musculoskeletal pain management, joint preservation, sports injury evaluation, and conservative mobility rehabilitation.',
    fullDescription: 'Our Orthopedics team is dedicated to restoring pain-free movement. Whether you are dealing with chronic back strain, acute athletic joint pain, or advancing degenerative arthritis, we offer comprehensive clinical diagnosis, digital imaging coordination, and tailored recovery paths.',
    iconName: 'Activity',
    commonConditions: ['Knee Meniscus & Ligament Sprains', 'Hip & Shoulder Osteoarthritis', 'Rotator Cuff Tendinopathy', 'Lower Back Strain & Sciatica', 'Carpal Tunnel Syndrome'],
    whatToExpect: 'Range of motion assessment, targeted joint stress testing, gait analysis, immediate referral for digital X-ray/MRI if indicated, and conservative rehab planning.',
    averageDuration: '40 min',
    leadSpecialistSpecialty: 'Orthopedics'
  },
  {
    id: 'srv-mental-wellness',
    name: 'Mental Wellness',
    slug: 'mental-wellness',
    category: 'Behavioral Health',
    shortDescription: 'Confidential clinical assessments, stress and burnout mitigation, cognitive guidance, and collaborative emotional health plans.',
    fullDescription: 'Mental health is foundational to overall vitality. CareNova provides a calm, stigma-free environment to discuss emotional wellbeing, work-induced burnout, anxiety patterns, and life adjustments with licensed behavioral healthcare practitioners.',
    iconName: 'Brain',
    commonConditions: ['Workplace Burnout & Stress', 'Mild-to-Moderate Anxiety', 'Depressive Symptoms', 'Sleep Cycle Disruptions', 'Life Transition Challenges'],
    whatToExpect: 'A confidential, empathetic 50-minute consultation exploring your concerns, validated psychometric screening tools, and an agreed-upon support strategy.',
    averageDuration: '50 min',
    leadSpecialistSpecialty: 'General Medicine'
  },
  {
    id: 'srv-nutrition',
    name: 'Nutrition & Metabolic Health',
    slug: 'nutrition',
    category: 'Lifestyle Medicine',
    shortDescription: 'Evidence-based medical nutrition therapy, glycemic management, metabolic recovery, and sustainable dietary habit design.',
    fullDescription: 'Food is medicine when applied with clinical precision. Our clinical nutritionists analyze your bloodwork, metabolism, daily routines, and food relationships to craft sustainable eating plans that optimize energy, reduce inflammation, and normalize blood markers.',
    iconName: 'Salad',
    commonConditions: ['Prediabetes & Insulin Resistance', 'Digestive Sensitivities & IBS', 'Non-Alcoholic Fatty Liver (NAFLD)', 'Cholesterol Optimization', 'Post-Op Nutritional Guidance'],
    whatToExpect: 'Detailed 7-day nutritional intake review, metabolic biomarker analysis, bioimpedance assessment, and a practical grocery/meal blueprint tailored to your palate.',
    averageDuration: '45 min',
    leadSpecialistSpecialty: 'Nutrition'
  },
  {
    id: 'srv-preventive-care',
    name: 'Preventive Care',
    slug: 'preventive-care',
    category: 'Wellness & Prevention',
    shortDescription: 'Proactive full-body health audits, biometric diagnostics, age-stratified screening schedules, and longevity planning.',
    fullDescription: 'Modern healthcare should prevent illness before it emerges. CareNova Preventive Care conducts holistic baseline audits: cardiovascular risk, metabolic health, cancer screening intervals, and environmental lifestyle risk factors to build your personal longevity roadmap.',
    iconName: 'ShieldCheck',
    commonConditions: ['Annual Executive Health Audits', 'Family Genetic Risk Mapping', 'Vaccine Schedules', 'Bone Density Surveillance', 'Cardiovascular Risk Stratification'],
    whatToExpect: 'Comprehensive lab panel review, body composition mapping, personalized immunization updates, and an annual preventive action checklist.',
    averageDuration: '45 min',
    leadSpecialistSpecialty: 'General Medicine'
  }
];

export const MOCK_TESTIMONIALS: PatientTestimonial[] = [
  {
    id: 'test-1',
    quote: 'Booking through CareNova felt completely different from typical clinic systems. I selected Dr. Sharma, saw her open slots for that afternoon, and had my full consult summary in my inbox before leaving the clinic.',
    patientName: 'Devika Singhania',
    role: 'Product Manager, San Francisco',
    specialtyConsulted: 'Cardiology',
    rating: 5,
    date: 'February 2026'
  },
  {
    id: 'test-2',
    quote: 'Dr. Mehta took the time to listen to my ongoing fatigue symptoms instead of rushing me out in five minutes. The digital intake saved me 20 minutes in the waiting lounge.',
    patientName: 'Marcus Vance',
    role: 'Architect, Seattle',
    specialtyConsulted: 'General Medicine',
    rating: 5,
    date: 'January 2026'
  },
  {
    id: 'test-3',
    quote: 'Having pediatrician slots visible with transparent scheduling when our toddler developed a rash gave my partner and me immediate peace of mind. Truly thoughtful healthcare design.',
    patientName: 'Elena Rostova',
    role: 'Creative Director, Austin',
    specialtyConsulted: 'Pediatrics',
    rating: 5,
    date: 'March 2026'
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'demo',
    question: 'Is CareNova an actual operating hospital or medical provider?',
    answer: 'No. CareNova is an interactive fictional healthcare platform built as a professional design and engineering portfolio demonstration. All physician names, statistics, addresses, and medical profiles are fictional concepts illustrating modern healthcare product design.'
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: 'How does the online appointment booking workflow work?',
    answer: 'In the CareNova interface, you can select your healthcare specialty or preferred doctor, choose between an In-Clinic Visit or Secure Telehealth Video session, pick an available calendar date, and choose an open time slot. Once submitted, a simulated confirmation with a reference number is generated.'
  },
  {
    id: 'faq-3',
    category: 'doctors',
    question: 'How are CareNova specialists presented in this prototype?',
    answer: 'In this design prototype, physician profiles showcase structured credentialing UI demonstrations including generic medical qualifications (MBBS, MD, MS, DM), years of clinical experience, sub-specialty tags, and consultation availability without referencing real-world institutions.'
  },
  {
    id: 'faq-4',
    category: 'services',
    question: 'Can I book a consultation without an existing primary care referral?',
    answer: 'Yes. The CareNova interface models direct access to specialists across Cardiology, Dermatology, Orthopedics, Pediatrics, and Nutrition to demonstrate an unencumbered digital patient discovery flow.'
  },
  {
    id: 'faq-5',
    category: 'availability',
    question: 'What happens if I need same-day or urgent care?',
    answer: 'CareNova provides an Availability Flow Demo illustrating same-day and upcoming scheduling slots. However, CareNova is an interactive fictional prototype and not a healthcare provider. For urgent medical emergencies, patients must always contact your local emergency services or visit the nearest emergency medical department.'
  },
  {
    id: 'faq-6',
    category: 'cancellation',
    question: 'Can I reschedule or cancel a booked appointment?',
    answer: 'Yes. Within our digital portal design, patients can reschedule or cancel an appointment with up to 2 hours notice without incurring cancellation fees, freeing up the slot for other community members in need.'
  },
  {
    id: 'faq-7',
    category: 'privacy',
    question: 'How does CareNova safeguard sensitive medical and personal data?',
    answer: 'The CareNova architecture concept models modern privacy-by-design standards: client-side data simulation, zero persistent tracking of personal health data, and privacy disclosure banners.'
  },
  {
    id: 'faq-8',
    category: 'services',
    question: 'Does CareNova offer telehealth virtual video consultations?',
    answer: 'Yes! Most CareNova specialties (including General Medicine, Cardiology, Dermatology, Pediatrics, and Nutrition) offer HD browser-based telehealth consultations with no additional app download required.'
  },
  {
    id: 'faq-9',
    category: 'demo',
    question: 'What technologies power this CareNova portfolio web application?',
    answer: 'This application is built with React 19, TypeScript, Tailwind CSS, Lucide icons, responsive design tokens, and simulated transactional state. It demonstrates high-end UX design, accessible form controls, and micro-interactions.'
  }
];

export const DEMO_STATS = [
  { value: '50+', label: 'Specialists Network', subtext: 'Credentialing UI demo profiles' },
  { value: '20+', label: 'Clinical Services', subtext: 'Comprehensive medical specialties' },
  { value: '10k+', label: 'Appointments Supported', subtext: 'Simulated community care requests' },
  { value: '98%', label: 'Patient Satisfaction', subtext: 'Based on post-consultation surveys' }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:15 AM',
  '01:45 PM',
  '02:30 PM',
  '03:45 PM',
  '04:30 PM',
  '05:15 PM'
];
