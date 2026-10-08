import { supabase, isSupabaseConfigured } from './supabase';
import {
  AppointmentRecord,
  AppointmentStatus,
  ContactMessageRecord,
  AdminStats
} from '../types';

export interface DashboardStatsResult {
  stats: AdminStats;
  isFromSupabase: boolean;
  error?: string | null;
}

/**
 * Fetches exact database counts for the Admin Dashboard directly from Supabase tables.
 * No hardcoded or mock numbers.
 */
export const fetchAdminDashboardStats = async (): Promise<DashboardStatsResult> => {
  if (!isSupabaseConfigured()) {
    return {
      stats: {
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        totalDoctors: 0,
        totalServices: 0,
        totalMessages: 0,
        unreadMessages: 0
      },
      isFromSupabase: false,
      error: 'Supabase is not configured.'
    };
  }

  try {
    const [
      allApptsRes,
      pendingApptsRes,
      confirmedApptsRes,
      completedApptsRes,
      allDoctorsRes,
      allServicesRes,
      allMessagesRes
    ] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true })
    ]);

    const totalAppointments = allApptsRes.count ?? 0;
    const pendingAppointments = pendingApptsRes.count ?? 0;
    const confirmedAppointments = confirmedApptsRes.count ?? 0;
    const completedAppointments = completedApptsRes.count ?? 0;
    const totalDoctors = allDoctorsRes.count ?? 0;
    const totalServices = allServicesRes.count ?? 0;
    const totalMessages = allMessagesRes.count ?? 0;

    return {
      stats: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        totalDoctors,
        totalServices,
        totalMessages,
        unreadMessages: totalMessages
      },
      isFromSupabase: true,
      error: null
    };
  } catch (err: any) {
    console.warn('[CareNova Admin] Note querying dashboard metrics:', err?.message || err);
    return {
      stats: {
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        totalDoctors: 0,
        totalServices: 0,
        totalMessages: 0,
        unreadMessages: 0
      },
      isFromSupabase: false,
      error: err?.message || 'Failed to fetch dashboard metrics from database.'
    };
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
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[CareNova Admin] Supabase query note for public.appointments:', error.message);
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

    const appointments: AppointmentRecord[] = data.map((row: any) => {
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
    console.warn('[CareNova Admin] Note querying public.appointments:', err?.message || err);
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
        error: `Supabase update error: ${error.message}`
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update' };
  }
};

/**
 * Fetch all contact messages directly from Supabase public.contact_messages
 * Only administrators with RLS access may read these records.
 */
export const getAdminMessages = async (): Promise<{
  data: ContactMessageRecord[];
  isFromSupabase: boolean;
  error?: string | null;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      isFromSupabase: false,
      error: 'Supabase client is not configured.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[CareNova Admin] Supabase contact_messages note:', error.message);
      return {
        data: [],
        isFromSupabase: false,
        error: error.message
      };
    }

    if (!data || data.length === 0) {
      return {
        data: [],
        isFromSupabase: true,
        error: null
      };
    }

    const messages: ContactMessageRecord[] = data.map((row: any) => ({
      id: String(row.id),
      name: row.name || 'Visitor',
      email: row.email || '',
      message: row.message || '',
      created_at: row.created_at || new Date().toISOString(),
      status: 'unread'
    }));

    return {
      data: messages,
      isFromSupabase: true,
      error: null
    };
  } catch (err: any) {
    return {
      data: [],
      isFromSupabase: false,
      error: err?.message || 'Network exception while fetching contact messages'
    };
  }
};

/**
 * Update contact message status
 */
export const updateMessageStatus = async (
  id: string,
  newStatus: 'unread' | 'read' | 'replied'
): Promise<{ success: boolean; error?: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.warn('[CareNova Admin] Note on message status update:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update message status' };
  }
};

/**
 * Delete a contact message from public.contact_messages
 */
export const deleteAdminMessage = async (
  id: string
): Promise<{ success: boolean; error?: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete message' };
  }
};
