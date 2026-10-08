import { supabase, isSupabaseConfigured } from './supabase';
import {
  AppointmentRecord,
  AppointmentStatus,
  ContactMessageRecord,
  AdminStats
} from '../types';

export const INITIAL_DEMO_MESSAGES: ContactMessageRecord[] = [
  {
    id: 'msg-01',
    name: 'Rebecca Torres',
    email: 'rebecca.torres@example.demo',
    message: 'Hello, does Dr. Sharma accept private clinical referral letters for second opinion cardiac consultations via telehealth? Looking forward to scheduling.',
    created_at: '2026-10-07T04:15:00Z',
    status: 'unread'
  },
  {
    id: 'msg-02',
    name: 'Thomas Wright',
    email: 'twright.invest@example.demo',
    message: 'Inquiring regarding CareNova partner clinics and diagnostic ultrasound availability at the Central Hub. Wonderful prototype interface.',
    created_at: '2026-10-06T16:20:00Z',
    status: 'unread'
  },
  {
    id: 'msg-03',
    name: 'Amira Al-Mansoor',
    email: 'amira.mansoor@example.demo',
    message: 'Can I book pediatric consultations for twins in consecutive time slots? Thank you!',
    created_at: '2026-10-05T12:00:00Z',
    status: 'read'
  }
];

const LOCAL_MESSAGES_KEY = 'carenova_admin_messages_override';

const getStoredMessages = (): ContactMessageRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_MESSAGES_KEY);
    if (!raw) return INITIAL_DEMO_MESSAGES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_MESSAGES;
  } catch {
    return INITIAL_DEMO_MESSAGES;
  }
};

const saveStoredMessages = (messages: ContactMessageRecord[]): void => {
  try {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn('Error saving messages override:', e);
  }
};

/**
 * Fetch all appointments directly from Supabase public.appointments
 * Strictly real database records only. No mock or hardcoded records.
 */
export const getAdminAppointments = async (): Promise<{
  data: AppointmentRecord[];
  isFromSupabase: boolean;
  error?: string | null;
}> => {
  try {
    localStorage.removeItem('carenova_admin_appointments_override');
  } catch {
    // Ignore storage errors
  }

  if (!isSupabaseConfigured()) {
    return {
      data: [],
      isFromSupabase: false,
      error: 'Supabase client is not configured with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };
  }

  try {
    // 1. Fetch doctors for doctor_name mapping
    const doctorMap = new Map<string, string>();
    try {
      const { data: dbDoctors } = await supabase
        .from('doctors')
        .select('id, name, specialty');
      if (dbDoctors && Array.isArray(dbDoctors)) {
        dbDoctors.forEach((d: any) => {
          if (d.id) {
            doctorMap.set(String(d.id), d.name || 'Specialist');
          }
        });
      }
    } catch (docErr) {
      console.warn('[CareNova Admin] Doctor lookup note:', docErr);
    }

    // 2. Query public.appointments with order('created_at', { ascending: false })
    let { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    // Fallback: If ordering by created_at causes error, retry plain select('*')
    if (error) {
      console.warn('[CareNova Admin] Order by created_at failed, retrying plain select("*"):', error);
      const retryRes = await supabase
        .from('appointments')
        .select('*');

      if (!retryRes.error && retryRes.data) {
        data = retryRes.data;
        error = null;
      }
    }

    if (error) {
      console.error('[CareNova Admin] Supabase query error for public.appointments:', error);
      return {
        data: [],
        isFromSupabase: false,
        error: `Database query error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`
      };
    }

    if (!data || data.length === 0) {
      return {
        data: [],
        isFromSupabase: true,
        error: null
      };
    }

    // Sort in memory by created_at descending if available, else appointment_date
    const sorted = [...data].sort((a: any, b: any) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (a.appointment_date && b.appointment_date) {
        return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
      }
      return 0;
    });

    const appointments: AppointmentRecord[] = sorted.map((row: any) => {
      const docId = row.doctor_id ? String(row.doctor_id) : null;
      const matchedDoctorName = docId ? doctorMap.get(docId) : null;

      return {
        id: String(row.id),
        patient_name: row.patient_name || 'Patient',
        email: row.email || '',
        phone: row.phone || '',
        doctor_id: docId,
        doctor_name: matchedDoctorName || (docId ? `Doctor (${docId.substring(0, 8)})` : (row.specialty ? `Specialist (${row.specialty})` : 'Unassigned Specialist')),
        specialty: row.specialty || 'General Medicine',
        appointment_date: row.appointment_date || '',
        appointment_time: row.appointment_time || '',
        consultation_type: row.consultation_type || 'in-clinic',
        reason: row.reason || '',
        status: (row.status as AppointmentStatus) || 'pending',
        created_at: row.created_at || ''
      };
    });

    return {
      data: appointments,
      isFromSupabase: true,
      error: null
    };
  } catch (err: any) {
    console.error('[CareNova Admin] Unexpected exception querying public.appointments:', err);
    return {
      data: [],
      isFromSupabase: false,
      error: `Network or query exception: ${err?.message || 'Failed to connect to database'}`
    };
  }
};

/**
 * Update an appointment status in Supabase public.appointments
 */
export const updateAppointmentStatus = async (
  id: string,
  newStatus: AppointmentStatus
): Promise<{ success: boolean; error?: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.warn('[CareNova Admin] Note on Supabase update:', error.message);
      return {
        success: false,
        error: `Supabase update note: ${error.message}`
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update' };
  }
};

/**
 * Fetch all contact messages for the Admin Dashboard
 */
export const getAdminMessages = async (): Promise<{
  data: ContactMessageRecord[];
  isFromSupabase: boolean;
  error?: string | null;
}> => {
  const localList = getStoredMessages();

  if (!isSupabaseConfigured()) {
    return {
      data: localList,
      isFromSupabase: false,
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.info('[CareNova Admin] Supabase contact_messages note:', error.message);
      return {
        data: localList,
        isFromSupabase: false,
        error: null
      };
    }

    if (!data || data.length === 0) {
      return {
        data: localList,
        isFromSupabase: true,
        error: null
      };
    }

    const supabaseMessages: ContactMessageRecord[] = data.map((row: any) => ({
      id: String(row.id),
      name: row.name || 'Visitor',
      email: row.email || '',
      message: row.message || '',
      created_at: row.created_at || new Date().toISOString(),
      status: row.status || 'unread'
    }));

    return {
      data: supabaseMessages,
      isFromSupabase: true,
      error: null
    };
  } catch (err) {
    return {
      data: localList,
      isFromSupabase: false,
      error: null
    };
  }
};

/**
 * Update message status (e.g. mark read/unread)
 */
export const updateMessageStatus = (id: string, status: 'unread' | 'read' | 'replied'): void => {
  const list = getStoredMessages();
  const updated = list.map(m => m.id === id ? { ...m, status } : m);
  saveStoredMessages(updated);
};

/**
 * Compute admin dashboard metrics
 */
export const computeAdminStats = (
  appointments: AppointmentRecord[],
  doctorsCount: number,
  servicesCount: number,
  messages: ContactMessageRecord[]
): AdminStats => {
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    totalDoctors: doctorsCount,
    totalServices: servicesCount,
    totalMessages,
    unreadMessages
  };
};
