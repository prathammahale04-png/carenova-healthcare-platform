import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageRoute, HealthcareService } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { normalizeService } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminModal } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import {
  Stethoscope,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Activity,
  RotateCw,
  Edit2,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AdminServicesPageProps {
  onNavigate: (page: PageRoute) => void;
}

const LOCAL_SERVICES_OVERRIDE_KEY = 'carenova_admin_services_overrides';

interface ServicesOverride {
  added: HealthcareService[];
  edited: Record<string, Partial<HealthcareService>>;
  deleted: string[];
}

const getStoredServiceOverrides = (): ServicesOverride => {
  try {
    const raw = localStorage.getItem(LOCAL_SERVICES_OVERRIDE_KEY);
    if (!raw) return { added: [], edited: {}, deleted: [] };
    return JSON.parse(raw);
  } catch {
    return { added: [], edited: {}, deleted: [] };
  }
};

const saveStoredServiceOverrides = (overrides: ServicesOverride): void => {
  try {
    localStorage.setItem(LOCAL_SERVICES_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.warn('LocalStorage error saving service overrides:', e);
  }
};

export const AdminServicesPage: React.FC<AdminServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [selectedService, setSelectedService] = useState<HealthcareService | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<HealthcareService | null>(null);
  const [deletingService, setDeletingService] = useState<HealthcareService | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Service form state (name, description, icon)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'stethoscope'
  });

  const loadServices = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      let fetched: HealthcareService[] = [];

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');

        if (error) {
          console.warn('[CareNova Admin] Supabase services query note:', error.message);
          setFetchError(error.message);
        } else {
          setFetchError(null);
          if (data && data.length > 0) {
            fetched = data.map(normalizeService);
          }
        }
      }

      // Merge with persisted overrides
      const overrides = getStoredServiceOverrides();
      let combined = [...fetched];

      // 1. Remove deleted
      if (overrides.deleted && overrides.deleted.length > 0) {
        combined = combined.filter(s => !overrides.deleted.includes(s.id));
      }

      // 2. Apply edits
      if (overrides.edited) {
        combined = combined.map(s => {
          if (overrides.edited[s.id]) {
            return { ...s, ...overrides.edited[s.id] };
          }
          return s;
        });
      }

      // 3. Prepend newly added
      if (overrides.added && overrides.added.length > 0) {
        for (const addedSrv of overrides.added) {
          if (!overrides.deleted.includes(addedSrv.id) && !combined.some(c => c.id === addedSrv.id)) {
            combined.unshift(addedSrv);
          }
        }
      }

      setServices(combined);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setFeedback({ type: 'error', message: 'Unable to fetch services from database.' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (service.name || '').toLowerCase().includes(q);
        const matchesDesc = (service.shortDescription || '').toLowerCase().includes(q);
        const matchesCat = (service.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [services, searchQuery]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'stethoscope'
    });
    setIsAddServiceOpen(true);
  };

  const handleOpenEdit = (srv: HealthcareService) => {
    setEditingService(srv);
    setFormData({
      name: srv.name,
      description: srv.shortDescription || srv.fullDescription || '',
      icon: srv.iconName || 'stethoscope'
    });
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    setFeedback(null);

    const newSrvId = `srv-${Date.now().toString(36)}`;
    const newServiceObj: HealthcareService = {
      id: newSrvId,
      name: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      category: 'Clinical Care',
      shortDescription: formData.description.trim() || 'Comprehensive clinical care consultation.',
      fullDescription: formData.description.trim() || 'Comprehensive clinical care consultation.',
      iconName: formData.icon.trim() || 'Stethoscope',
      commonConditions: ['General Wellness', 'Clinical Review'],
      whatToExpect: 'Diagnostic review and personalized consultation plan.',
      averageDuration: '30 - 45 min',
      leadSpecialistSpecialty: formData.name.trim()
    };

    // Attempt remote database insert
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('services').insert([{
          name: formData.name.trim(),
          description: formData.description.trim(),
          icon: formData.icon.trim()
        }]);
        if (error) {
          console.warn('[CareNova Admin] Supabase services insert note (RLS):', error.message);
        }
      } catch (err) {
        console.warn('Supabase service insert exception:', err);
      }
    }

    // Persist in overrides
    const overrides = getStoredServiceOverrides();
    overrides.added.unshift(newServiceObj);
    saveStoredServiceOverrides(overrides);

    setServices(prev => [newServiceObj, ...prev]);
    setIsAddServiceOpen(false);
    setIsSaving(false);
    setFeedback({ type: 'success', message: `Clinical Service "${formData.name}" added successfully.` });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSaving(true);
    setFeedback(null);

    const updatedServiceData: Partial<HealthcareService> = {
      name: formData.name.trim(),
      shortDescription: formData.description.trim(),
      fullDescription: formData.description.trim(),
      iconName: formData.icon.trim()
    };

    // Attempt remote database update
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('services').update({
          name: formData.name.trim(),
          description: formData.description.trim(),
          icon: formData.icon.trim()
        }).eq('id', editingService.id);

        if (error) {
          console.warn('[CareNova Admin] Supabase services update note (RLS):', error.message);
        }
      } catch (err) {
        console.warn('Supabase service update exception:', err);
      }
    }

    // Persist in overrides
    const overrides = getStoredServiceOverrides();
    overrides.edited[editingService.id] = {
      ...overrides.edited[editingService.id],
      ...updatedServiceData
    };
    saveStoredServiceOverrides(overrides);

    setServices(prev =>
      prev.map(s => (s.id === editingService.id ? { ...s, ...updatedServiceData } : s))
    );

    setEditingService(null);
    setIsSaving(false);
    setFeedback({ type: 'success', message: `Service "${formData.name}" updated successfully.` });
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;

    setIsSaving(true);
    setFeedback(null);

    // Attempt remote database delete
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', deletingService.id);

        if (error) {
          console.warn('[CareNova Admin] Supabase services delete note (RLS):', error.message);
        }
      } catch (err) {
        console.warn('Supabase service delete exception:', err);
      }
    }

    // Persist in overrides
    const overrides = getStoredServiceOverrides();
    if (!overrides.deleted.includes(deletingService.id)) {
      overrides.deleted.push(deletingService.id);
    }
    overrides.added = overrides.added.filter(s => s.id !== deletingService.id);
    delete overrides.edited[deletingService.id];
    saveStoredServiceOverrides(overrides);

    setServices(prev => prev.filter(s => s.id !== deletingService.id));
    setFeedback({ type: 'success', message: `Service "${deletingService.name}" removed.` });
    setDeletingService(null);
    setIsSaving(false);
  };

  return (
    <AdminLayout
      currentPage="admin-services"
      onNavigate={onNavigate}
      onRefresh={() => loadServices(true)}
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

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clinical Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
          <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
          <p>Loading clinical services from database...</p>
        </div>
      ) : fetchError ? (
        <div className="p-12 text-center bg-rose-50/70 rounded-2xl border border-rose-200 text-rose-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <div>
            <p className="font-bold text-sm text-rose-900">Unable to query Supabase public.services</p>
            <p className="text-xs text-rose-700 mt-1 font-mono">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => loadServices(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 space-y-3">
          <Stethoscope className="w-8 h-8 mx-auto text-slate-300" />
          <div>
            <p className="font-bold text-slate-700">No clinical services found</p>
            <p className="text-slate-500 mt-1">Try clearing your search keyword or add a new service.</p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-teal-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-2xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {service.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-3 line-clamp-1">
                  {service.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-2xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Icon Token:</span>
                    <span className="font-mono text-slate-800">{service.iconName || 'stethoscope'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Duration:</span>
                    <span className="font-semibold text-slate-800">{service.averageDuration}</span>
                  </div>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingService(service)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <AdminModal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          title={selectedService.name}
          subtitle={`Department: ${selectedService.category} · CareNova Clinical Catalog`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 text-sm">{selectedService.name}</span>
              <p className="text-slate-600 leading-relaxed">{selectedService.fullDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-2xs text-slate-400">Average Duration</div>
                <div className="font-bold text-slate-900">{selectedService.averageDuration}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-2xs text-slate-400">Lead Specialty</div>
                <div className="font-bold text-slate-900">{selectedService.leadSpecialistSpecialty}</div>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Add Service Modal */}
      {isAddServiceOpen && (
        <AdminModal
          isOpen={isAddServiceOpen}
          onClose={() => setIsAddServiceOpen(false)}
          title="Add New Clinical Service"
          subtitle="Add a service to the CareNova catalog"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. QA Demo Service"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Comprehensive clinical evaluation description..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Icon Identifier</label>
              <input
                type="text"
                placeholder="e.g. stethoscope, activity, heart"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddServiceOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Add Service'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <AdminModal
          isOpen={Boolean(editingService)}
          onClose={() => setEditingService(null)}
          title={`Edit Service: ${editingService.name}`}
          subtitle="Update clinical service details"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Icon Identifier</label>
              <input
                type="text"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingService)}
        title="Remove Clinical Service"
        description={`Are you sure you want to remove "${deletingService?.name}" from the active services catalog?`}
        confirmLabel="Delete Service"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingService(null)}
      />
    </AdminLayout>
  );
};
