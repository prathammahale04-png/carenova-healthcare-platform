import { supabase, isSupabaseConfigured } from './supabase';
import {
  AppointmentRecord,
  AppointmentStatus,
  ContactMessageRecord,
  AdminStats,
  Doctor,
  HealthcareService
} from '../types';
import { MOCK_DOCTORS, MOCK_SERVICES } from '../data/mockData';
import { normalizeDoctor, normalizeService } from './api';

// In-memory session store for optimistic updates when Supabase RLS restricts anon mutation
const sessionOverrides = {
  appointmentStatuses: new Map<string, AppointmentStatus>(),
  addedDoctors: [] as Doctor[],
  updatedDoctors: new Map<string, Partial<Doctor>>(),
  deletedDoctorIds: new Set<string>(),
  addedServices: [] as HealthcareService[],
  updatedServices: new Map<string, Partial<HealthcareService>>(),
  deletedServiceIds: new Set<string>()
};

// Initial simulated appointments for demo display if database has none
const DEMO_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    patient_name: 'Maya Chen',
    email: 'maya.chen@example.com',
    phone: '+1 (555) 234-5678',
    doctor_id: 'dr-anaya-sharma',
    doctor_name: 'Dr. Anaya Sharma',
    specialty: 'Cardiology',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    appointment_time: '10:30 AM',
    consultation_type: 'telehealth',
    reason: 'Follow-up for preventive cardiovascular screening and blood pressure trends.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'a89c210d-44ba-4211-9ff2-1e92d8c4e122',
    patient_name: 'Julian Vance',
    email: 'julian.vance@example.com',
    phone: '+1 (555) 876-5432',
    doctor_id: 'dr-rohan-mehta',
    doctor_name: 'Dr. Rohan Mehta',
    specialty: 'Internal Medicine',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '02:15 PM',
    consultation_type: 'in-clinic',
    reason: 'Annual routine health evaluation and baseline metabolic panel review.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'c12b890a-77ff-4321-bca1-9988aabbccdd',
    patient_name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 901-2345',
    doctor_id: 'dr-priya-patel',
    doctor_name: 'Dr. Priya Patel',
    specialty: 'Pediatrics',
    appointment_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    appointment_time: '11:00 AM',
    consultation_type: 'in-clinic',
    reason: 'Child immunization booster and development milestone assessment.',
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'd9988776-6543-210f-eedd-ccbbaa998877',
    patient_name: 'Aarav Deshmukh',
    email: 'aarav.deshmukh@example.com',
    phone: '+91 98200 12345',
    doctor_id: 'dr-kavita-iyer',
    doctor_name: 'Dr. Kavita Iyer',
    specialty: 'Dermatology',
    appointment_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    appointment_time: '04:00 PM',
    consultation_type: 'telehealth',
    reason: 'Seasonal eczema flare-up review and topical prescription evaluation.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const DEMO_MESSAGES: ContactMessageRecord[] = [
  {
    id: 'msg-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    message: '[Scheduling Assistance] Inquiring if weekend appointments for Cardiology video consults are available next month.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'msg-2',
    name: 'David Kim',
    email: 'david.kim@example.com',
    message: '[Specialist Credentialing] Are pediatricians licensed for interstate telehealth consultations in this CareNova demo?',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'msg-3',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    message: '[Portfolio Review] Outstanding clinical workflow design. Loving the clean Plus Jakarta Sans typography and responsive stepper!',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

/**
 * Fetches dashboard summary metric counts
 */
export const fetchAdminStats = async (): Promise<AdminStats> => {
  let totalAppointments = DEMO_APPOINTMENTS.length;
  let pendingAppointments = DEMO_APPOINTMENTS.filter(a => a.status === 'pending').length;
  let totalDoctors = MOCK_DOCTORS.length;
  let totalMessages = DEMO_MESSAGES.length;

  if (isSupabaseConfigured()) {
    try {
      const [apptsRes, pendingRes, docsRes, msgsRes] = await Promise.allSettled([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true })
      ]);

      if (apptsRes.status === 'fulfilled' && typeof apptsRes.value.count === 'number' && apptsRes.value.count > 0) {
        totalAppointments = apptsRes.value.count;
      }
      if (pendingRes.status === 'fulfilled' && typeof pendingRes.value.count === 'number') {
        pendingAppointments = pendingRes.value.count;
      }
      if (docsRes.status === 'fulfilled' && typeof docsRes.value.count === 'number' && docsRes.value.count > 0) {
        totalDoctors = docsRes.value.count;
      }
      if (msgsRes.status === 'fulfilled' && typeof msgsRes.value.count === 'number' && msgsRes.value.count > 0) {
        totalMessages = msgsRes.value.count;
      }
    } catch (err) {
      console.warn('[CareNova Admin] Error querying summary stats from Supabase:', err);
    }
  }

  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments: Math.max(0, totalAppointments - pendingAppointments),
    totalDoctors: totalDoctors + sessionOverrides.addedDoctors.length - sessionOverrides.deletedDoctorIds.size,
    totalServices: MOCK_SERVICES.length + sessionOverrides.addedServices.length - sessionOverrides.deletedServiceIds.size,
    totalMessages,
    unreadMessages: DEMO_MESSAGES.filter(m => !m.status || m.status === 'unread').length
  };
};

/**
 * Fetches all appointments with optional search, status filtering, and sorting
 */
export const fetchAdminAppointments = async (options?: {
  search?: string;
  status?: AppointmentStatus | 'all';
  sortBy?: 'newest' | 'date';
}): Promise<{ appointments: AppointmentRecord[]; isFromSupabase: boolean; error?: string }> => {
  let list: AppointmentRecord[] = [];
  let isFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      // Query appointments table
      let query = supabase.from('appointments').select('*');
      if (options?.sortBy === 'date') {
        query = query.order('appointment_date', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        isFromSupabase = true;

        // Fetch doctors map to resolve names if doctor_id is present
        let docMap = new Map<string, string>();
        try {
          const { data: docData } = await supabase.from('doctors').select('id, name');
          if (docData) {
            docData.forEach(d => docMap.set(d.id, d.name));
          }
        } catch {}

        list = data.map((row: any) => ({
          id: String(row.id || genId()),
          patient_name: row.patient_name || 'Patient',
          email: row.email || '',
          phone: row.phone || '',
          doctor_id: row.doctor_id || null,
          specialty: row.specialty || 'General Medicine',
          appointment_date: row.appointment_date || '',
          appointment_time: row.appointment_time || '',
          consultation_type: row.consultation_type || 'in-clinic',
          reason: row.reason || '',
          status: (row.status as AppointmentStatus) || 'pending',
          created_at: row.created_at || new Date().toISOString(),
          doctor_name: (row.doctor_id && docMap.get(row.doctor_id)) || row.specialty + ' Specialist'
        }));
      }
    } catch (err) {
      console.warn('[CareNova Admin] Exception fetching appointments:', err);
    }
  }

  // Fallback to demo appointments if table is empty or unconfigured
  if (list.length === 0) {
    list = [...DEMO_APPOINTMENTS];
  }

  // Apply session overrides
  list = list.map(item => {
    if (sessionOverrides.appointmentStatuses.has(item.id)) {
      return { ...item, status: sessionOverrides.appointmentStatuses.get(item.id)! };
    }
    return item;
  });

  // Client-side filtering
  if (options?.status && options.status !== 'all') {
    list = list.filter(item => item.status === options.status);
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(item =>
      item.patient_name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.specialty.toLowerCase().includes(q) ||
      (item.doctor_name && item.doctor_name.toLowerCase().includes(q))
    );
  }

  return { appointments: list, isFromSupabase };
};

/**
 * Updates status of an appointment in public.appointments
 */
export const updateAppointmentStatus = async (
  id: string,
  newStatus: AppointmentStatus
): Promise<{ success: boolean; persistedToSupabase: boolean; error?: string }> => {
  // Always update in session override for immediate optimistic UI
  sessionOverrides.appointmentStatuses.set(id, newStatus);

  if (!isSupabaseConfigured()) {
    return { success: true, persistedToSupabase: false };
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.warn('[CareNova Admin] Supabase update status notice (RLS or policy check):', error.message);
      return {
        success: true,
        persistedToSupabase: false,
        error: 'Updated in local admin session (Supabase anon role requires UPDATE policy for direct persistence).'
      };
    }

    return { success: true, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception updating status:', err);
    return { success: true, persistedToSupabase: false };
  }
};

/**
 * Fetches all doctors for the admin panel
 */
export const fetchAdminDoctors = async (): Promise<{ doctors: Doctor[]; isFromSupabase: boolean }> => {
  let list: Doctor[] = [];
  let isFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('doctors').select('*').order('name');
      if (!error && data && data.length > 0) {
        list = data.map(normalizeDoctor);
        isFromSupabase = true;
      }
    } catch (err) {
      console.warn('[CareNova Admin] Error fetching doctors for admin:', err);
    }
  }

  if (list.length === 0) {
    list = [...MOCK_DOCTORS];
  }

  // Apply session additions, updates, and deletes
  list = list.filter(d => !sessionOverrides.deletedDoctorIds.has(d.id));
  list = list.map(d => {
    if (sessionOverrides.updatedDoctors.has(d.id)) {
      return { ...d, ...sessionOverrides.updatedDoctors.get(d.id) };
    }
    return d;
  });
  list = [...sessionOverrides.addedDoctors, ...list];

  return { doctors: list, isFromSupabase };
};

/**
 * Creates a new doctor in public.doctors
 */
export const createAdminDoctor = async (
  doc: Omit<Doctor, 'id'>
): Promise<{ success: boolean; doctor: Doctor; persistedToSupabase: boolean; error?: string }> => {
  const newDoctor: Doctor = {
    ...doc,
    id: genUuid()
  };

  sessionOverrides.addedDoctors.unshift(newDoctor);

  if (!isSupabaseConfigured()) {
    return { success: true, doctor: newDoctor, persistedToSupabase: false };
  }

  try {
    const payload = {
      id: newDoctor.id,
      name: newDoctor.name,
      title: newDoctor.title,
      specialty: newDoctor.specialty,
      specialty_id: newDoctor.specialtyId,
      experience_years: newDoctor.experienceYears,
      rating: newDoctor.rating,
      review_count: newDoctor.reviewCount,
      image: newDoctor.image,
      bio: newDoctor.bio,
      education: newDoctor.education,
      certifications: newDoctor.certifications,
      areas_of_expertise: newDoctor.areasOfExpertise,
      languages: newDoctor.languages,
      consultation_fee: newDoctor.consultationFee,
      next_available: newDoctor.nextAvailable,
      available_days: newDoctor.availableDays,
      location: newDoctor.location,
      telehealth_available: newDoctor.telehealthAvailable
    };

    const { error } = await supabase.from('doctors').insert([payload]);

    if (error) {
      console.warn('[CareNova Admin] Supabase insert doctor error (anon role RLS):', error.message);
      return {
        success: true,
        doctor: newDoctor,
        persistedToSupabase: false,
        error: 'Added to local admin session (Supabase anon role requires INSERT policy on doctors).'
      };
    }

    return { success: true, doctor: newDoctor, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception creating doctor:', err);
    return { success: true, doctor: newDoctor, persistedToSupabase: false };
  }
};

/**
 * Updates a doctor in public.doctors
 */
export const updateAdminDoctor = async (
  id: string,
  updatedData: Partial<Doctor>
): Promise<{ success: boolean; persistedToSupabase: boolean; error?: string }> => {
  sessionOverrides.updatedDoctors.set(id, updatedData);

  if (!isSupabaseConfigured()) {
    return { success: true, persistedToSupabase: false };
  }

  try {
    const payload: any = {};
    if (updatedData.name !== undefined) payload.name = updatedData.name;
    if (updatedData.title !== undefined) payload.title = updatedData.title;
    if (updatedData.specialty !== undefined) payload.specialty = updatedData.specialty;
    if (updatedData.experienceYears !== undefined) payload.experience_years = updatedData.experienceYears;
    if (updatedData.rating !== undefined) payload.rating = updatedData.rating;
    if (updatedData.bio !== undefined) payload.bio = updatedData.bio;
    if (updatedData.image !== undefined) payload.image = updatedData.image;
    if (updatedData.languages !== undefined) payload.languages = updatedData.languages;

    const { error } = await supabase.from('doctors').update(payload).eq('id', id);

    if (error) {
      console.warn('[CareNova Admin] Supabase update doctor notice (anon role RLS):', error.message);
      return { success: true, persistedToSupabase: false };
    }

    return { success: true, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception updating doctor:', err);
    return { success: true, persistedToSupabase: false };
  }
};

/**
 * Deletes a doctor from public.doctors
 */
export const deleteAdminDoctor = async (
  id: string
): Promise<{ success: boolean; persistedToSupabase: boolean; error?: string }> => {
  sessionOverrides.deletedDoctorIds.add(id);
  sessionOverrides.addedDoctors = sessionOverrides.addedDoctors.filter(d => d.id !== id);

  if (!isSupabaseConfigured()) {
    return { success: true, persistedToSupabase: false };
  }

  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) {
      console.warn('[CareNova Admin] Supabase delete doctor notice (anon role RLS):', error.message);
      return { success: true, persistedToSupabase: false };
    }
    return { success: true, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception deleting doctor:', err);
    return { success: true, persistedToSupabase: false };
  }
};

/**
 * Fetches all services for the admin panel
 */
export const fetchAdminServices = async (): Promise<{ services: HealthcareService[]; isFromSupabase: boolean }> => {
  let list: HealthcareService[] = [];
  let isFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (!error && data && data.length > 0) {
        list = data.map(normalizeService);
        isFromSupabase = true;
      }
    } catch (err) {
      console.warn('[CareNova Admin] Error fetching services for admin:', err);
    }
  }

  if (list.length === 0) {
    list = [...MOCK_SERVICES];
  }

  list = list.filter(s => !sessionOverrides.deletedServiceIds.has(s.id));
  list = list.map(s => {
    if (sessionOverrides.updatedServices.has(s.id)) {
      return { ...s, ...sessionOverrides.updatedServices.get(s.id) };
    }
    return s;
  });
  list = [...sessionOverrides.addedServices, ...list];

  return { services: list, isFromSupabase };
};

/**
 * Creates a new service
 */
export const createAdminService = async (
  service: Omit<HealthcareService, 'id'>
): Promise<{ success: boolean; service: HealthcareService; persistedToSupabase: boolean; error?: string }> => {
  const newService: HealthcareService = {
    ...service,
    id: genUuid()
  };

  sessionOverrides.addedServices.unshift(newService);

  if (!isSupabaseConfigured()) {
    return { success: true, service: newService, persistedToSupabase: false };
  }

  try {
    const payload = {
      id: newService.id,
      name: newService.name,
      slug: newService.slug,
      category: newService.category,
      short_description: newService.shortDescription,
      full_description: newService.fullDescription,
      icon_name: newService.iconName,
      common_conditions: newService.commonConditions,
      what_to_expect: newService.whatToExpect,
      average_duration: newService.averageDuration,
      lead_specialist_specialty: newService.leadSpecialistSpecialty
    };

    const { error } = await supabase.from('services').insert([payload]);

    if (error) {
      console.warn('[CareNova Admin] Supabase insert service notice (anon role RLS):', error.message);
      return { success: true, service: newService, persistedToSupabase: false };
    }

    return { success: true, service: newService, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception creating service:', err);
    return { success: true, service: newService, persistedToSupabase: false };
  }
};

/**
 * Updates a service
 */
export const updateAdminService = async (
  id: string,
  updatedData: Partial<HealthcareService>
): Promise<{ success: boolean; persistedToSupabase: boolean; error?: string }> => {
  sessionOverrides.updatedServices.set(id, updatedData);

  if (!isSupabaseConfigured()) {
    return { success: true, persistedToSupabase: false };
  }

  try {
    const payload: any = {};
    if (updatedData.name !== undefined) payload.name = updatedData.name;
    if (updatedData.category !== undefined) payload.category = updatedData.category;
    if (updatedData.shortDescription !== undefined) payload.short_description = updatedData.shortDescription;
    if (updatedData.fullDescription !== undefined) payload.full_description = updatedData.fullDescription;
    if (updatedData.iconName !== undefined) payload.icon_name = updatedData.iconName;

    const { error } = await supabase.from('services').update(payload).eq('id', id);

    if (error) {
      console.warn('[CareNova Admin] Supabase update service notice (anon role RLS):', error.message);
      return { success: true, persistedToSupabase: false };
    }

    return { success: true, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception updating service:', err);
    return { success: true, persistedToSupabase: false };
  }
};

/**
 * Deletes a service
 */
export const deleteAdminService = async (
  id: string
): Promise<{ success: boolean; persistedToSupabase: boolean; error?: string }> => {
  sessionOverrides.deletedServiceIds.add(id);
  sessionOverrides.addedServices = sessionOverrides.addedServices.filter(s => s.id !== id);

  if (!isSupabaseConfigured()) {
    return { success: true, persistedToSupabase: false };
  }

  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      console.warn('[CareNova Admin] Supabase delete service notice (anon role RLS):', error.message);
      return { success: true, persistedToSupabase: false };
    }
    return { success: true, persistedToSupabase: true };
  } catch (err: any) {
    console.warn('[CareNova Admin] Exception deleting service:', err);
    return { success: true, persistedToSupabase: false };
  }
};

/**
 * Fetches contact messages
 */
export const fetchAdminMessages = async (): Promise<{ messages: ContactMessageRecord[]; isFromSupabase: boolean }> => {
  let list: ContactMessageRecord[] = [];
  let isFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        list = data.map((row: any) => ({
          id: String(row.id || genId()),
          name: row.name || 'Anonymous Patient',
          email: row.email || '',
          message: row.message || '',
          created_at: row.created_at || new Date().toISOString()
        }));
        isFromSupabase = true;
      }
    } catch (err) {
      console.warn('[CareNova Admin] Error fetching messages:', err);
    }
  }

  if (list.length === 0) {
    list = [...DEMO_MESSAGES];
  }

  return { messages: list, isFromSupabase };
};

// Internal helpers
function genId(): string {
  return 'id-' + Math.random().toString(36).substring(2, 9);
}

function genUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
