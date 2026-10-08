import React, { useState, useEffect } from 'react';
import { PageRoute, AppointmentRecord, ContactMessageRecord, AdminStats, Doctor, HealthcareService } from '../../types';
import {
  getAdminAppointments,
  getAdminMessages,
  computeAdminStats,
  updateAppointmentStatus
} from '../../lib/adminData';
import { getDoctors, getServices } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal } from '../../components/admin/AdminModal';
import {
  CalendarCheck2,
  Clock,
  Users2,
  Stethoscope,
  MessageSquare,
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Database,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalDoctors: 0,
    totalServices: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [aptRes, msgRes, docRes, srvRes] = await Promise.all([
        getAdminAppointments(),
        getAdminMessages(),
        getDoctors(),
        getServices()
      ]);

      setAppointments(aptRes.data);
      setMessages(msgRes.data);
      setDoctors(docRes.data);
      setServices(srvRes.data);

      const calculatedStats = computeAdminStats(
        aptRes.data,
        docRes.data.length,
        srvRes.data.length,
        msgRes.data
      );
      setStats(calculatedStats);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    if (!selectedAppointment) return;
    setIsUpdatingStatus(true);
    await updateAppointmentStatus(selectedAppointment.id, newStatus);

    // Update in local state
    setAppointments(prev =>
      prev.map(a => (a.id === selectedAppointment.id ? { ...a, status: newStatus } : a))
    );
    setSelectedAppointment(prev => (prev ? { ...prev, status: newStatus } : null));

    // Recompute stats
    const updatedApts = appointments.map(a =>
      a.id === selectedAppointment.id ? { ...a, status: newStatus } : a
    );
    setStats(computeAdminStats(updatedApts, doctors.length, services.length, messages));
    setIsUpdatingStatus(false);
  };

  const recentAppointments = appointments.slice(0, 5);
  const recentMessages = messages.slice(0, 4);

  return (
    <AdminLayout
      currentPage="admin"
      onNavigate={onNavigate}
      onRefresh={() => loadData(true)}
      isRefreshing={isRefreshing}
      counts={{
        pendingAppointments: stats.pendingAppointments,
        unreadMessages: stats.unreadMessages
      }}
    >
      {/* Disclaimer Notice */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="font-bold text-amber-950">
            CareNova Prototype Admin Operations Notice
          </p>
          <p className="text-amber-800 leading-relaxed">
            This dashboard interfaces with Supabase tables (<code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono text-2xs">doctors</code>, <code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono text-2xs">services</code>, <code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono text-2xs">appointments</code>, <code className="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-mono text-2xs">contact_messages</code>). All clinical records, doctor profiles, and patient queries are fictional portfolio demonstrations.
          </p>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          subtitle="All patient intake records"
          icon={<CalendarCheck2 className="w-5 h-5 text-teal-700" />}
          iconBgColor="bg-teal-50"
          onClick={() => onNavigate('admin-appointments')}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingAppointments}
          subtitle="Requires triage/action"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          iconBgColor="bg-amber-50"
          trendText={stats.pendingAppointments > 0 ? `${stats.pendingAppointments} action items` : 'All clear'}
          trendType={stats.pendingAppointments > 0 ? 'attention' : 'positive'}
          onClick={() => onNavigate('admin-appointments')}
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          subtitle="Specialists in directory"
          icon={<Users2 className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
          onClick={() => onNavigate('admin-doctors')}
        />
        <StatCard
          title="Clinical Services"
          value={stats.totalServices}
          subtitle="Departments & therapies"
          icon={<Stethoscope className="w-5 h-5 text-indigo-700" />}
          iconBgColor="bg-indigo-50"
          onClick={() => onNavigate('admin-services')}
        />
        <StatCard
          title="Patient Inquiries"
          value={stats.totalMessages}
          subtitle={`${stats.unreadMessages} unread messages`}
          icon={<MessageSquare className="w-5 h-5 text-purple-700" />}
          iconBgColor="bg-purple-50"
          trendText={stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : 'Caught up'}
          trendType={stats.unreadMessages > 0 ? 'attention' : 'neutral'}
          onClick={() => onNavigate('admin-messages')}
        />
      </div>

      {/* Two Column Layout: Recent Appointments & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Appointment Bookings
              </h2>
              <p className="text-2xs text-slate-500">
                Latest consultation bookings submitted through the web portal
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin-appointments')}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Loading appointments from database...
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No appointment submissions recorded yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Specialty & Doctor</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{apt.patient_name}</div>
                        <div className="text-2xs font-normal text-slate-400">{apt.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-medium text-slate-900">{apt.specialty}</div>
                        <div className="text-2xs text-slate-500">
                          {apt.doctor_name || 'Assigned Specialist'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <div className="font-medium">{apt.appointment_date}</div>
                        <div className="text-2xs text-slate-500">{apt.appointment_time}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`inline-block px-2 py-0.5 rounded text-2xs font-medium ${
                          apt.consultation_type === 'telehealth'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {apt.consultation_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="View appointment details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Contact Messages */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Patient Inquiries
              </h2>
              <p className="text-2xs text-slate-500">
                Direct contact form messages
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin-messages')}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No messages recorded.</p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigate('admin-messages')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-teal-900 truncate">
                      {msg.name}
                    </span>
                    <StatusBadge status={msg.status || 'unread'} size="sm" />
                  </div>
                  <p className="text-2xs text-slate-500 truncate mb-1.5">{msg.email}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => onNavigate('admin-messages')}
              className="w-full py-2 px-3 text-xs font-bold text-slate-700 hover:text-teal-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors text-center cursor-pointer"
            >
              Manage All Messages ({stats.totalMessages})
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AdminModal
          isOpen={Boolean(selectedAppointment)}
          onClose={() => setSelectedAppointment(null)}
          title={`Appointment Details: ${selectedAppointment.patient_name}`}
          subtitle={`Reference ID: ${selectedAppointment.id}`}
        >
          <div className="space-y-5 text-sm">
            {/* Status & Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-600">Current Status:</span>
              <StatusBadge status={selectedAppointment.status} />
            </div>

            {/* Patient Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Patient Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-2xs text-slate-400">Full Name</div>
                    <div className="font-semibold text-slate-900">{selectedAppointment.patient_name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-2xs text-slate-400">Email Address</div>
                    <div className="font-semibold text-slate-900 truncate">{selectedAppointment.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 sm:col-span-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-2xs text-slate-400">Phone Number</div>
                    <div className="font-semibold text-slate-900">{selectedAppointment.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Consultation Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinical Consultation Details
              </h4>
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department / Specialty:</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-medium text-slate-900">{selectedAppointment.doctor_name || 'CareNova Specialist'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-medium text-slate-900">{selectedAppointment.appointment_date} · {selectedAppointment.appointment_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="capitalize font-medium text-slate-900">{selectedAppointment.consultation_type}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 block mb-1">Reason for Visit:</span>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-slate-800 leading-relaxed">
                    {selectedAppointment.reason || 'Routine consultation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons to Change Status */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">
                Update Appointment Status:
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedAppointment.status === 'confirmed'}
                  onClick={() => handleStatusChange('confirmed')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Booking</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedAppointment.status === 'completed'}
                  onClick={() => handleStatusChange('completed')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Completed</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedAppointment.status === 'cancelled'}
                  onClick={() => handleStatusChange('cancelled')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};
