import { supabase, isSupabaseConfigured } from './supabase';
import { Doctor, HealthcareService, AppointmentFormData } from '../types';
import { MOCK_DOCTORS, MOCK_SERVICES } from '../data/mockData';

export interface ApiResponse<T> {
  data: T;
  isFromSupabase: boolean;
  error?: string | null;
}

const DOCTOR_PORTRAITS: Record<string, string> = {
  'dr. anaya sharma': '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg',
  'anaya sharma': '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg',
  'dr. rohan mehta': '/src/assets/images/doctor_rohan_mehta_1791263891775.jpg',
  'rohan mehta': '/src/assets/images/doctor_rohan_mehta_1791263891775.jpg',
  'dr. kavya patel': '/src/assets/images/doctor_kavya_patel_1791263902635.jpg',
  'kavya patel': '/src/assets/images/doctor_kavya_patel_1791263902635.jpg',
  'dr. arjun rao': '/src/assets/images/doctor_arjun_rao_1791263913254.jpg',
  'arjun rao': '/src/assets/images/doctor_arjun_rao_1791263913254.jpg',
  'dr. neha kapoor': '/src/assets/images/doctor_neha_kapoor_1791263927560.jpg',
  'neha kapoor': '/src/assets/images/doctor_neha_kapoor_1791263927560.jpg',
  'dr. vihaan shah': '/src/assets/images/doctor_vihaan_shah_1791263940648.jpg',
  'vihaan shah': '/src/assets/images/doctor_vihaan_shah_1791263940648.jpg'
};

export const getDoctorImageByName = (name?: string): string => {
  if (!name) return '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg';
  const clean = name.toLowerCase().trim();
  for (const [key, img] of Object.entries(DOCTOR_PORTRAITS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return img;
    }
  }
  return '/src/assets/images/doctor_anaya_sharma_1791263878853.jpg';
};

/**
 * Normalizes a doctor row from Supabase (handling snake_case or camelCase columns)
 */
export const normalizeDoctor = (row: any): Doctor => {
  const parseArray = (val: any, fallback: string[] = []): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return fallback;
  };

  const doctorName = row.name || 'Specialist Physician';

  return {
    id: String(row.id || `dr-${Math.random().toString(36).substring(2, 8)}`),
    name: doctorName,
    title: row.title || `Specialist Physician · ${row.specialty || 'General Care'}`,
    specialty: row.specialty || 'General Medicine',
    specialtyId: row.specialty_id || row.specialtyId || (row.specialty ? row.specialty.toLowerCase().replace(/\s+/g, '-') : 'general-medicine'),
    experienceYears: Number(row.experience_years ?? row.experienceYears ?? 10),
    rating: Number(row.rating ?? 4.8),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 120),
    image: row.image || row.image_url || getDoctorImageByName(doctorName),
    bio: row.bio || 'Compassionate healthcare physician dedicated to attentive patient care.',
    education: parseArray(row.education, ['MBBS', 'MD']),
    certifications: parseArray(row.certifications, ['Board Certification (Prototype Demo)']),
    areasOfExpertise: parseArray(row.areas_of_expertise ?? row.areasOfExpertise, [row.specialty || 'General Care']),
    languages: parseArray(row.languages, ['English']),
    consultationFee: Number(row.consultation_fee ?? row.consultationFee ?? 130),
    nextAvailable: row.next_available || row.nextAvailable || 'Tomorrow · 10:00 AM',
    availableDays: parseArray(row.available_days ?? row.availableDays, ['Monday', 'Wednesday', 'Friday']),
    location: row.location || 'CareNova Central Medical Hub',
    telehealthAvailable: Boolean(row.telehealth_available ?? row.telehealthAvailable ?? true)
  };
};

/**
 * Normalizes a service row from Supabase (handling snake_case or camelCase columns)
 */
export const normalizeService = (row: any): HealthcareService => {
  const parseArray = (val: any, fallback: string[] = []): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return fallback;
  };

  const desc = row.short_description || row.shortDescription || row.description || 'Comprehensive clinical evaluation.';

  return {
    id: String(row.id || `srv-${Math.random().toString(36).substring(2, 8)}`),
    name: row.name || 'Clinical Service',
    slug: row.slug || (row.name ? row.name.toLowerCase().replace(/\s+/g, '-') : 'service'),
    category: row.category || 'Primary Care',
    shortDescription: desc,
    fullDescription: row.full_description || row.fullDescription || desc,
    iconName: row.icon_name || row.iconName || row.icon || 'Stethoscope',
    commonConditions: parseArray(row.common_conditions ?? row.commonConditions, ['Preventive Wellness']),
    whatToExpect: row.what_to_expect || row.whatToExpect || 'A thorough clinical review and tailored follow-up plan.',
    averageDuration: row.average_duration || row.averageDuration || '30 - 45 min',
    leadSpecialistSpecialty: row.lead_specialist_specialty || row.leadSpecialistSpecialty || row.name || 'General Medicine'
  };
};

/**
 * Fetches doctors from Supabase public.doctors table.
 * Falls back to MOCK_DOCTORS if Supabase is unconfigured, empty, or unreachable.
 */
export const getDoctors = async (): Promise<ApiResponse<Doctor[]>> => {
  if (!isSupabaseConfigured()) {
    return {
      data: MOCK_DOCTORS,
      isFromSupabase: false,
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Supabase getDoctors query returned error:', error.message);
      return {
        data: MOCK_DOCTORS,
        isFromSupabase: false,
        error: 'Unable to fetch doctors from database. Using demo data.'
      };
    }

    if (!data || data.length === 0) {
      return {
        data: MOCK_DOCTORS,
        isFromSupabase: false,
        error: 'Database table public.doctors is currently empty. Showing demo data.'
      };
    }

    const normalized = data.map(normalizeDoctor);
    return {
      data: normalized,
      isFromSupabase: true,
      error: null
    };
  } catch (err: any) {
    console.warn('Network exception while contacting Supabase doctors:', err);
    return {
      data: MOCK_DOCTORS,
      isFromSupabase: false,
      error: 'Network connectivity issue. Showing demo data.'
    };
  }
};

/**
 * Fetches services from Supabase public.services table.
 * Falls back to MOCK_SERVICES if Supabase is unconfigured, empty, or unreachable.
 */
export const getServices = async (): Promise<ApiResponse<HealthcareService[]>> => {
  if (!isSupabaseConfigured()) {
    return {
      data: MOCK_SERVICES,
      isFromSupabase: false,
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Supabase getServices query returned error:', error.message);
      return {
        data: MOCK_SERVICES,
        isFromSupabase: false,
        error: 'Unable to fetch services from database. Using demo data.'
      };
    }

    if (!data || data.length === 0) {
      return {
        data: MOCK_SERVICES,
        isFromSupabase: false,
        error: 'Database table public.services is currently empty. Showing demo data.'
      };
    }

    const normalized = data.map(normalizeService);
    return {
      data: normalized,
      isFromSupabase: true,
      error: null
    };
  } catch (err: any) {
    console.warn('Network exception while contacting Supabase services:', err);
    return {
      data: MOCK_SERVICES,
      isFromSupabase: false,
      error: 'Network connectivity issue. Showing demo data.'
    };
  }
};

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (val?: string | null): boolean => {
  if (!val) return false;
  return UUID_REGEX.test(val.trim());
};

const formatAppointmentDate = (dateVal: string): string => {
  if (!dateVal) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  const trimmed = dateVal.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return trimmed;
};

const to24HourTime = (timeStr: string): string => {
  if (!timeStr) return '10:00:00';
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return timeStr.trim();

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const seconds = match[3] || '00';
  const modifier = match[4]?.toUpperCase();

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
};

/**
 * Inserts an appointment request into Supabase public.appointments table.
 */
export interface SaveAppointmentResult {
  success: boolean;
  isInsertedToSupabase: boolean;
  referenceNumber: string;
  error?: string | null;
}

export const saveAppointment = async (formData: AppointmentFormData): Promise<SaveAppointmentResult> => {
  const referenceNumber = `CN-${Math.floor(10000 + Math.random() * 90000)}`;

  if (!isSupabaseConfigured()) {
    console.warn('[CareNova Supabase] Supabase client is not configured with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Falling back to prototype mode.');
    return {
      success: true,
      isInsertedToSupabase: false,
      referenceNumber
    };
  }

  // 1. Resolve doctor_id to the actual UUID from public.doctors
  let resolvedDoctorId: string | null = null;

  if (isValidUuid(formData.doctorId)) {
    resolvedDoctorId = formData.doctorId.trim();
  } else {
    // Attempt to look up the doctor record in Supabase public.doctors to get the real UUID
    try {
      const { data: dbDoctors } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .limit(25);

      if (dbDoctors && dbDoctors.length > 0) {
        // Try matching by specialty or name
        const match = dbDoctors.find(d =>
          (formData.specialty && d.specialty?.toLowerCase() === formData.specialty.toLowerCase())
        ) || dbDoctors.find(d => isValidUuid(d.id));

        if (match?.id && isValidUuid(match.id)) {
          resolvedDoctorId = match.id;
        }
      }
    } catch (lookupErr) {
      console.warn('[CareNova Supabase] Could not query public.doctors to resolve doctor UUID:', lookupErr);
    }
  }

  // Never insert fake/local IDs (e.g. 'dr-anaya-sharma') into a UUID column
  const finalDoctorId = isValidUuid(resolvedDoctorId) ? resolvedDoctorId : null;

  // 2. Format date and time
  const formattedDate = formatAppointmentDate(formData.date);
  const timeOriginal = (formData.timeSlot || '10:30 AM').trim();

  // Primary payload with exact database column names
  const payload = {
    patient_name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim(),
    doctor_id: finalDoctorId,
    specialty: formData.specialty,
    appointment_date: formattedDate,
    appointment_time: timeOriginal,
    consultation_type: formData.consultationType || 'in-clinic',
    reason: formData.reasonForVisit.trim(),
    status: 'pending'
  };

  try {
    let { error } = await supabase
      .from('appointments')
      .insert([payload]);

    // If insertion failed due to time format (e.g. column is type TIME and rejects '10:30 AM')
    if (error && error.message && error.message.toLowerCase().includes('time')) {
      console.warn('[CareNova Supabase] Retrying appointment insert with 24-hour time format:', to24HourTime(timeOriginal));
      const retryPayload = { ...payload, appointment_time: to24HourTime(timeOriginal) };
      const retryRes = await supabase.from('appointments').insert([retryPayload]);
      error = retryRes.error;
    }

    if (error) {
      console.warn('[CareNova Supabase] Appointment insert note:', error.message);

      return {
        success: false,
        isInsertedToSupabase: false,
        referenceNumber: '',
        error: 'Unable to record your appointment request in the database. Please verify your details or try again.'
      };
    }

    // Success! Record was inserted into Supabase public.appointments
    return {
      success: true,
      isInsertedToSupabase: true,
      referenceNumber
    };
  } catch (err: any) {
    console.warn('[CareNova Supabase] Exception during appointment insert:', err?.message || err);

    return {
      success: false,
      isInsertedToSupabase: false,
      referenceNumber: '',
      error: 'A network connectivity issue occurred while submitting your appointment. Please try again.'
    };
  }
};

/**
 * Inserts a contact message into Supabase public.contact_messages table.
 */
export interface SaveContactResult {
  success: boolean;
  isInsertedToSupabase: boolean;
  error?: string | null;
}

export const saveContactMessage = async (contactData: {
  name: string;
  email: string;
  message: string;
}): Promise<SaveContactResult> => {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      isInsertedToSupabase: false
    };
  }

  try {
    const payload = {
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      message: contactData.message.trim()
    };

    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);

    if (error) {
      console.warn('Supabase saveContactMessage insert error:', error.message);
      return {
        success: true,
        isInsertedToSupabase: false,
        error: 'Message received in prototype mode.'
      };
    }

    return {
      success: true,
      isInsertedToSupabase: true
    };
  } catch (err: any) {
    console.warn('Network exception while saving contact message:', err);
    return {
      success: true,
      isInsertedToSupabase: false,
      error: 'Message received in prototype mode.'
    };
  }
};
