import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageRoute, Doctor } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { normalizeDoctor, getDoctorImageByName } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminModal } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import {
  Users2,
  Search,
  Plus,
  Star,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  Stethoscope,
  GraduationCap,
  Award,
  Globe,
  RotateCw,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  ImageIcon
} from 'lucide-react';

interface AdminDoctorsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDoctorsPage: React.FC<AdminDoctorsPageProps> = ({ onNavigate }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Doctor Form state
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General Medicine',
    experience_years: 5,
    rating: 4.8,
    image_url: '',
    bio: '',
    languages: 'English, Hindi'
  });

  const loadDoctors = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setFetchError('Supabase is not configured.');
        setDoctors([]);
        return;
      }

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');

      if (error) {
        console.warn('[CareNova Admin] Supabase doctors query note:', error.message);
        setFetchError(error.message);
        setFeedback({ type: 'error', message: `Database error: ${error.message}` });
        setDoctors([]);
      } else {
        setFetchError(null);
        const mapped = (data || []).map(normalizeDoctor);
        setDoctors(mapped);
      }
    } catch (err: any) {
      console.warn('Note loading doctors:', err?.message || err);
      setFetchError(err?.message || 'Unable to fetch doctors from database.');
      setFeedback({ type: 'error', message: 'Unable to fetch doctors from database.' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const specialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach(d => {
      if (d.specialty) set.add(d.specialty);
    });
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      if (selectedSpecialty !== 'all' && doc.specialty !== selectedSpecialty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (doc.name || '').toLowerCase().includes(q);
        const matchesSpec = (doc.specialty || '').toLowerCase().includes(q);
        const matchesBio = (doc.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesBio) return false;
      }
      return true;
    });
  }, [doctors, selectedSpecialty, searchQuery]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      specialty: 'General Medicine',
      experience_years: 5,
      rating: 4.8,
      image_url: '',
      bio: '',
      languages: 'English, Hindi'
    });
    setIsAddDoctorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialty: doc.specialty,
      experience_years: doc.experienceYears,
      rating: doc.rating,
      image_url: doc.image || '',
      bio: doc.bio,
      languages: Array.isArray(doc.languages) ? doc.languages.join(', ') : 'English'
    });
  };

  // Submit Add Doctor
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Doctor name is required.' });
      return;
    }
    if (!formData.specialty.trim()) {
      setFeedback({ type: 'error', message: 'Specialty is required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const languagesList = formData.languages.split(',').map(s => s.trim()).filter(Boolean);

    if (!isSupabaseConfigured()) {
      setIsSaving(false);
      setFeedback({ type: 'error', message: 'Supabase client is not configured.' });
      return;
    }

    try {
      const { data, error } = await supabase.from('doctors').insert([{
        name: formData.name.trim(),
        specialty: formData.specialty,
        experience_years: Number(formData.experience_years) || 1,
        rating: Number(formData.rating) || 5.0,
        image_url: formData.image_url.trim() || null,
        bio: formData.bio.trim() || '',
        languages: languagesList
      }]).select();

      if (error) {
        console.warn('[CareNova Admin] Supabase insert note:', error.message);
        setFeedback({
          type: 'error',
          message: `Failed to add doctor to Supabase: ${error.message}`
        });
      } else {
        const createdRow = data && data[0] ? normalizeDoctor(data[0]) : null;
        if (createdRow) {
          setDoctors(prev => [createdRow, ...prev]);
        } else {
          await loadDoctors(true);
        }
        setIsAddDoctorOpen(false);
        setFormData({
          name: '',
          specialty: 'General Medicine',
          experience_years: 5,
          rating: 4.8,
          image_url: '',
          bio: '',
          languages: 'English, Hindi'
        });
        setFeedback({
          type: 'success',
          message: `Specialist "${formData.name}" added to Supabase public.doctors successfully.`
        });
      }
    } catch (err: any) {
      console.warn('[CareNova Admin] Supabase doctor insert note:', err?.message || err);
      setFeedback({
        type: 'error',
        message: err?.message || 'Network exception while adding doctor to Supabase.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Edit Doctor
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Doctor name is required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const languagesList = formData.languages.split(',').map(s => s.trim()).filter(Boolean);

    if (!isSupabaseConfigured()) {
      setIsSaving(false);
      setFeedback({ type: 'error', message: 'Supabase client is not configured.' });
      return;
    }

    try {
      const { error } = await supabase.from('doctors').update({
        name: formData.name.trim(),
        specialty: formData.specialty,
        experience_years: Number(formData.experience_years) || 1,
        rating: Number(formData.rating) || 5.0,
        image_url: formData.image_url.trim() || null,
        bio: formData.bio.trim(),
        languages: languagesList
      }).eq('id', editingDoctor.id);

      if (error) {
        console.warn('[CareNova Admin] Supabase doctor update note:', error.message);
        setFeedback({
          type: 'error',
          message: `Failed to update doctor: ${error.message}`
        });
      } else {
        const updatedDoctorData: Partial<Doctor> = {
          name: formData.name.trim(),
          specialty: formData.specialty,
          experienceYears: Number(formData.experience_years),
          rating: Number(formData.rating),
          bio: formData.bio.trim(),
          languages: languagesList,
          image: formData.image_url.trim() || editingDoctor.image || getDoctorImageByName(formData.name.trim())
        };

        setDoctors(prev =>
          prev.map(d => (d.id === editingDoctor.id ? { ...d, ...updatedDoctorData } : d))
        );
        setEditingDoctor(null);
        setFeedback({
          type: 'success',
          message: `Profile for "${formData.name}" updated in Supabase successfully.`
        });
      }
    } catch (err: any) {
      console.warn('[CareNova Admin] Supabase doctor update note:', err?.message || err);
      setFeedback({
        type: 'error',
        message: err?.message || 'Network exception while updating doctor in Supabase.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete Doctor
  const handleConfirmDelete = async () => {
    if (!deletingDoctor) return;

    setIsSaving(true);
    setFeedback(null);

    if (!isSupabaseConfigured()) {
      setIsSaving(false);
      setFeedback({ type: 'error', message: 'Supabase client is not configured.' });
      return;
    }

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', deletingDoctor.id);

      if (error) {
        console.warn('[CareNova Admin] Supabase doctor delete note:', error.message);
        setFeedback({
          type: 'error',
          message: `Failed to delete doctor from Supabase: ${error.message}`
        });
      } else {
        setDoctors(prev => prev.filter(d => d.id !== deletingDoctor.id));
        setFeedback({
          type: 'success',
          message: `Doctor "${deletingDoctor.name}" removed from Supabase public.doctors.`
        });
        setDeletingDoctor(null);
      }
    } catch (err: any) {
      console.warn('[CareNova Admin] Supabase doctor delete note:', err?.message || err);
      setFeedback({
        type: 'error',
        message: err?.message || 'Network exception while deleting doctor from Supabase.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      currentPage="admin-doctors"
      onNavigate={onNavigate}
      onRefresh={() => loadDoctors(true)}
      isRefreshing={isRefreshing}
    >
      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border shadow-2xs ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-2xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="bg-[#FFFDF8] rounded-2xl p-4 sm:p-5 border border-[#E7DFCE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
            <input
              type="text"
              placeholder="Search specialists by name, specialty, bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-transparent transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D6B36A] hover:bg-[#C59E52] text-[#F1F3F5] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F1F3F5]" />
            <span className="text-[#F1F3F5]">Add Specialist Profile</span>
          </button>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#E7DFCE] pb-1">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedSpecialty === 'all'
                ? 'bg-[#D6B36A] text-[#F1F3F5] shadow-2xs font-bold'
                : 'text-[#77736A] hover:text-[#202020] hover:bg-[#FBF8EF]'
            }`}
          >
            All Specialties ({doctors.length})
          </button>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-[#D6B36A] text-[#F1F3F5] shadow-2xs font-bold'
                  : 'text-[#77736A] hover:text-[#202020] hover:bg-[#FBF8EF]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-[#77736A] text-xs bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE]">
          <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D6B36A]" />
          <p>Loading medical specialists from database...</p>
        </div>
      ) : fetchError ? (
        <div className="p-12 text-center bg-rose-50/70 rounded-2xl border border-rose-200 text-rose-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <div>
            <p className="font-bold text-sm text-rose-900">Unable to query Supabase public.doctors</p>
            <p className="text-xs text-rose-700 mt-1 font-mono">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => loadDoctors(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="p-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 space-y-3">
          <Users2 className="w-8 h-8 mx-auto text-slate-300" />
          <div>
            <p className="font-bold text-slate-700">No doctors match your query</p>
            <p className="text-slate-500 mt-1">Try resetting the specialty filter or adjusting your search keyword.</p>
          </div>
          {(searchQuery || selectedSpecialty !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-5 shadow-xs hover:shadow-md hover:border-[#D6B36A] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E7DFCE] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-2xs font-bold text-[#8E6D2B] bg-[#F4E9C9] border border-[#E7D19A] px-2 py-0.5 rounded-md mb-1">
                      {doctor.specialty}
                    </span>
                    <h3 className="font-bold text-sm text-[#202020] truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-2xs text-[#77736A] line-clamp-1">{doctor.title}</p>

                    <div className="mt-2 flex items-center gap-2 text-2xs text-[#77736A]">
                      <span className="flex items-center gap-0.5 font-bold text-[#8E6D2B]">
                        <Star className="w-3 h-3 fill-[#D6B36A] text-[#D6B36A]" />
                        {doctor.rating}
                      </span>
                      <span>·</span>
                      <span>{doctor.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#3A3833] line-clamp-2 leading-relaxed">
                  {doctor.bio}
                </p>

                <div className="mt-3 pt-3 border-t border-[#E7DFCE] flex items-center justify-between text-2xs text-[#77736A]">
                  <div className="flex items-center gap-1 truncate">
                    <Globe className="w-3 h-3 text-[#77736A] shrink-0" />
                    <span className="truncate">{doctor.languages?.join(', ') || 'English'}</span>
                  </div>
                  <span className="font-bold text-[#8E6D2B] shrink-0">
                    ${doctor.consultationFee} / visit
                  </span>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="mt-4 pt-3 border-t border-[#E7DFCE] flex items-center justify-between">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="p-1.5 text-[#77736A] hover:text-[#8E6D2B] hover:bg-[#F4E9C9] rounded-lg transition-colors cursor-pointer"
                  title="View full profile"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(doctor)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#202020] hover:text-[#8E6D2B] bg-[#FBF8EF] hover:bg-[#F4E9C9] border border-[#E7DFCE] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingDoctor(doctor)}
                    className="p-1 text-[#77736A] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <AdminModal
          isOpen={Boolean(selectedDoctor)}
          onClose={() => setSelectedDoctor(null)}
          title={selectedDoctor.name}
          subtitle={`${selectedDoctor.title} · ${selectedDoctor.specialty}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-xs text-slate-700">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-[#8E6D2B] bg-[#F4E9C9] px-2 py-0.5 rounded">
                  {selectedDoctor.specialty}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedDoctor.name}</h4>
                <p className="text-slate-500">{selectedDoctor.title}</p>
                <div className="mt-1 flex items-center gap-3 text-2xs text-slate-600">
                  <span>★ {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)</span>
                  <span>·</span>
                  <span>{selectedDoctor.experienceYears} Years Clinical Experience</span>
                  <span>·</span>
                  <span className="font-bold text-[#8E6D2B]">${selectedDoctor.consultationFee} / session</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 text-2xs mb-1">
                Clinical Overview & Biography
              </h5>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed">
                {selectedDoctor.bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Languages: {selectedDoctor.languages?.join(', ') || 'English'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#D6B36A]" />
                <span>{selectedDoctor.telehealthAvailable ? 'Telehealth Available' : 'Clinic Only'}</span>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Add Specialist Modal */}
      {isAddDoctorOpen && (
        <AdminModal
          isOpen={isAddDoctorOpen}
          onClose={() => setIsAddDoctorOpen(false)}
          title="Add New Specialist Profile"
          subtitle="Add a new healthcare doctor to the CareNova directory"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Doctor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. QA Demo Doctor"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A] cursor-pointer"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.experience_years}
                  onChange={e => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. English, Hindi"
                  value={formData.languages}
                  onChange={e => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://... or /src/assets/images/... (leave empty for auto portrait)"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biography</label>
              <textarea
                rows={3}
                placeholder="Doctor clinical background and bio..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddDoctorOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-[#D6B36A] hover:bg-[#C59E52] font-bold text-[#F1F3F5] shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Add Specialist'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Edit Specialist Modal */}
      {editingDoctor && (
        <AdminModal
          isOpen={Boolean(editingDoctor)}
          onClose={() => setEditingDoctor(null)}
          title={`Edit Doctor: ${editingDoctor.name}`}
          subtitle="Update specialist profile details"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Doctor Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A] cursor-pointer"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.experience_years}
                  onChange={e => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={e => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://... or /src/assets/images/..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biography</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7DFCE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-[#D6B36A] hover:bg-[#C59E52] font-bold text-[#F1F3F5] shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingDoctor)}
        title="Remove Specialist Profile"
        description={`Are you sure you want to remove "${deletingDoctor?.name}" from the active specialist directory? This action can be reversed by resetting demo storage.`}
        confirmLabel="Delete Doctor"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDoctor(null)}
      />
    </AdminLayout>
  );
};
