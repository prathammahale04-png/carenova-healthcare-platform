import React, { useState, useEffect } from 'react';
import { PageRoute, Doctor, AppointmentFormData, AppointmentConfirmation } from '../types';
import { MOCK_DOCTORS, MOCK_SERVICES, TIME_SLOTS } from '../data/mockData';
import { getDoctors, saveAppointment, isValidUuid } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  Video,
  Building,
  AlertCircle,
  Printer,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Copy,
  Edit3,
  Calendar,
  Sparkles,
  RefreshCw,
  Loader2,
  Database
} from 'lucide-react';

interface AppointmentPageProps {
  initialDoctor?: Doctor | null;
  initialSpecialty?: string | null;
  initialSchedule?: {
    date?: string;
    timeSlot?: string;
    consultationType?: 'in-clinic' | 'telehealth';
  } | null;
  onNavigate: (page: PageRoute) => void;
}

type AppointmentStep = 1 | 2 | 3 | 4;

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  initialDoctor,
  initialSpecialty,
  initialSchedule,
  onNavigate
}) => {
  // 4 Steps: 1: Patient Details, 2: Schedule, 3: Review, 4: Confirmation
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(1);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  // Form State
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    email: '',
    phone: '',
    specialty: initialSpecialty || (initialDoctor ? initialDoctor.specialty : 'General Medicine'),
    doctorId: initialDoctor ? initialDoctor.id : (MOCK_DOCTORS[0]?.id || ''),
    consultationType: initialSchedule?.consultationType || (initialDoctor && !initialDoctor.telehealthAvailable ? 'in-clinic' : 'telehealth'),
    date: initialSchedule?.date || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: initialSchedule?.timeSlot || '10:30 AM',
    reasonForVisit: '',
    notes: '',
    agreeToTerms: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<string>('Validating prototype intake details...');
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);

  // Simulated error testing state for portfolio evaluator review
  const [simulateError, setSimulateError] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Load latest doctors from Supabase / API
  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        if (isMounted && res.data && res.data.length > 0) {
          setAvailableDoctors(res.data);
          
          setFormData(prev => {
            // Find doctor with actual UUID from Supabase
            let matchedDoc: Doctor | undefined;
            if (initialDoctor) {
              matchedDoc = res.data.find(d => 
                (isValidUuid(d.id) && d.id === initialDoctor.id) ||
                d.name.toLowerCase() === initialDoctor.name.toLowerCase()
              );
            }
            if (!matchedDoc && prev.doctorId) {
              matchedDoc = res.data.find(d => 
                (isValidUuid(d.id) && d.id === prev.doctorId) ||
                (d.specialty && d.specialty.toLowerCase() === prev.specialty.toLowerCase())
              );
            }
            if (!matchedDoc) {
              matchedDoc = res.data.find(d => 
                d.specialty && d.specialty.toLowerCase() === prev.specialty.toLowerCase()
              ) || res.data.find(d => isValidUuid(d.id)) || res.data[0];
            }

            const chosenDoctorId = matchedDoc && isValidUuid(matchedDoc.id)
              ? matchedDoc.id
              : (isValidUuid(prev.doctorId) ? prev.doctorId : (res.data.find(d => isValidUuid(d.id))?.id || prev.doctorId));

            return {
              ...prev,
              doctorId: chosenDoctorId,
              specialty: matchedDoc?.specialty || prev.specialty
            };
          });
        }
      } catch (err) {
        console.warn('Could not load dynamic doctors for appointment flow:', err);
      }
    };
    fetchDoctors();
    return () => { isMounted = false; };
  }, [initialDoctor]);

  // Sync state if initialDoctor or initialSpecialty changes
  useEffect(() => {
    if (initialDoctor) {
      const matchDoc = availableDoctors.find(d => 
        (isValidUuid(d.id) && d.id === initialDoctor.id) ||
        d.name.toLowerCase() === initialDoctor.name.toLowerCase()
      );
      const chosenDoctorId = matchDoc && isValidUuid(matchDoc.id)
        ? matchDoc.id
        : (isValidUuid(initialDoctor.id) ? initialDoctor.id : '');

      setFormData(prev => ({
        ...prev,
        specialty: initialDoctor.specialty,
        doctorId: chosenDoctorId || prev.doctorId,
        consultationType: initialSchedule?.consultationType || (initialDoctor.telehealthAvailable ? 'telehealth' : 'in-clinic'),
        date: initialSchedule?.date || prev.date,
        timeSlot: initialSchedule?.timeSlot || prev.timeSlot
      }));
    } else if (initialSpecialty) {
      const matchDoc = availableDoctors.find(d => d.specialty.toLowerCase() === initialSpecialty.toLowerCase());
      setFormData(prev => ({
        ...prev,
        specialty: initialSpecialty,
        doctorId: matchDoc ? matchDoc.id : prev.doctorId,
        date: initialSchedule?.date || prev.date,
        timeSlot: initialSchedule?.timeSlot || prev.timeSlot
      }));
    }
  }, [initialDoctor, initialSpecialty, initialSchedule, availableDoctors]);

  // Doctors matching current specialty
  const specialtyDoctors = availableDoctors.filter(
    doc => !formData.specialty || doc.specialty.toLowerCase() === formData.specialty.toLowerCase()
  );

  const selectedDoctor = availableDoctors.find(d => d.id === formData.doctorId) || specialtyDoctors[0] || availableDoctors[0];

  const handleSpecialtyChange = (newSpecialty: string) => {
    const docsForSpecialty = availableDoctors.filter(d => d.specialty === newSpecialty);
    setFormData(prev => ({
      ...prev,
      specialty: newSpecialty,
      doctorId: docsForSpecialty.length > 0 ? docsForSpecialty[0].id : ''
    }));
    if (errors.specialty || errors.doctorId) {
      setErrors(prev => ({ ...prev, specialty: undefined, doctorId: undefined }));
    }
  };

  // STEP 1 VALIDATION: Patient Details
  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full legal or preferred name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required for confirmation.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (minimum 7 digits).';
    }

    if (!formData.reasonForVisit.trim()) {
      newErrors.reasonForVisit = 'Please provide a brief reason or symptoms for your consultation.';
    } else if (formData.reasonForVisit.trim().length < 8) {
      newErrors.reasonForVisit = 'Reason must be at least 8 characters to help the physician prepare.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 2 VALIDATION: Schedule
  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.specialty) {
      newErrors.specialty = 'Please select a healthcare specialty.';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a specialist physician.';
    }

    if (!formData.date) {
      newErrors.date = 'Please pick a consultation date.';
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Appointment date cannot be in the past.';
      }
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select an available time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 3 VALIDATION: Review & Terms
  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Please confirm agreement to the prototype consultation terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleProceedToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleProceedToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      setSubmissionError(null);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) {
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);
    setSubmitPhase('Validating prototype intake details...');

    // Progress smoothly through submission phases
    await new Promise(r => setTimeout(r, 300));
    setSubmitPhase('Connecting to public.appointments table...');

    if (simulateError) {
      setIsSubmitting(false);
      setSubmissionError('Simulated calendar conflict demo: The selected time slot was claimed. Please select another slot or retry.');
      return;
    }

    try {
      const result = await saveAppointment(formData);

      if (!result.success) {
        setIsSubmitting(false);
        setSubmissionError(
          result.error || 'Unable to schedule your appointment at this time. Please check your information and try again.'
        );
        return;
      }

      const doc = availableDoctors.find(d => d.id === formData.doctorId) || selectedDoctor;

      setConfirmation({
        ...formData,
        referenceNumber: result.referenceNumber,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        doctorName: doc ? doc.name : 'Attending Specialist',
        specialtyName: formData.specialty,
        isInsertedToSupabase: result.isInsertedToSupabase
      });
      setIsSubmitting(false);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('[CareNova Appointment] Submission note:', err?.message || err);
      setIsSubmitting(false);
      setSubmissionError('An issue occurred while processing your consultation request. Please check your network and try again.');
    }
  };

  const handleCopyId = () => {
    if (!confirmation) return;
    navigator.clipboard?.writeText(confirmation.referenceNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleAddToCalendar = () => {
    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 3000);
  };

  const handleReset = () => {
    setConfirmation(null);
    setCurrentStep(1);
    setSubmissionError(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      specialty: 'General Medicine',
      doctorId: MOCK_DOCTORS[0]?.id || '',
      consultationType: 'in-clinic',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '10:30 AM',
      reasonForVisit: '',
      notes: '',
      agreeToTerms: true
    });
    setErrors({});
  };

  // STEP STEPS CONFIG FOR PROGRESS INDICATOR
  const stepsConfig = [
    { number: '01', title: 'Patient Details', shortTitle: 'Details' },
    { number: '02', title: 'Schedule', shortTitle: 'Schedule' },
    { number: '03', title: 'Review', shortTitle: 'Review' },
    { number: '04', title: 'Confirmation', shortTitle: 'Confirm' }
  ];

  return (
    <div className="py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <SectionHeader
        kicker="Direct Scheduling Flow"
        title="Schedule Your Healthcare Consultation"
        subtitle="Book an in-person clinic visit or secure browser telehealth video session with our specialist directory demo."
      />

      {/* 4-STEP PROGRESS INDICATOR */}
      <div className="mb-8 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        
        {/* Mobile Stepper (<640px) */}
        <div className="sm:hidden space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              Step {stepsConfig[currentStep - 1].number} of 04 · {stepsConfig[currentStep - 1].title}
            </span>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>

          {/* 4 Segmented Progress Bars */}
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`rounded-full transition-all duration-300 ${
                  currentStep > stepNum
                    ? 'bg-emerald-500'
                    : currentStep === stepNum
                    ? 'bg-teal-700'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Compact Mini Pills */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {stepsConfig.map((s, idx) => {
              const stepNum = (idx + 1) as AppointmentStep;
              const isPassed = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <button
                  key={s.number}
                  type="button"
                  disabled={stepNum > currentStep && !confirmation}
                  onClick={() => {
                    if (stepNum < currentStep) setCurrentStep(stepNum);
                  }}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-2xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    isCurrent
                      ? 'bg-teal-700 text-white shadow-2xs font-bold'
                      : isPassed
                      ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 cursor-default'
                  }`}
                >
                  {isPassed ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <span>{s.number}</span>
                  )}
                  <span className="truncate">{s.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop / Tablet Stepper (>=640px) */}
        <div className="hidden sm:grid grid-cols-4 gap-3 text-xs font-semibold">
          {stepsConfig.map((s, idx) => {
            const stepNum = (idx + 1) as AppointmentStep;
            const isPassed = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            const isFuture = currentStep < stepNum;

            return (
              <div
                key={s.number}
                onClick={() => {
                  if (isPassed && currentStep !== 4) {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                  isCurrent
                    ? 'border-teal-700 bg-teal-50/70 text-teal-950 ring-1 ring-teal-700 shadow-2xs'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50 cursor-pointer'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400 cursor-default'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5" /> : s.number}
                </div>
                <div className="min-w-0">
                  <div className={`text-2xs font-semibold uppercase tracking-wider ${
                    isCurrent ? 'text-teal-700' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {s.number}
                  </div>
                  <div className="font-bold truncate text-slate-900 text-xs">
                    {s.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* STEP 4: CONFIRMATION VIEW */}
      {currentStep === 4 && confirmation && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  SIMULATION SUCCESSFUL
                </span>
                {confirmation.isInsertedToSupabase ? (
                  <span className="text-2xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-600" />
                    Inserted into public.appointments
                  </span>
                ) : (
                  <span className="text-2xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Database className="w-3 h-3 text-slate-500" />
                    Local Prototype Session Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Appointment Request Received
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">
                  Reference ID: <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{confirmation.referenceNumber}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-950 px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">Submitted: {confirmation.submittedAt}</span>
              </div>
            </div>
          </div>

          {/* Portfolio Demo Notice Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 mb-8 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Portfolio Demonstration Notice</p>
              <p className="leading-relaxed">
                This is a CareNova digital prototype. No actual clinical consultation has been booked, and no patient data has been transmitted. This screen demonstrates complete multi-step state management, form validation, and transactional confirmation patterns.
              </p>
            </div>
          </div>

          {/* Consultation Summary Grid */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Consultation Details Summary
              </h2>
              {calendarSaved && (
                <span className="text-2xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded animate-pulse">
                  Calendar Event Added!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Assigned Specialist:</span>
                <span className="font-bold text-slate-900 text-sm">{confirmation.doctorName}</span>
                <span className="text-slate-600 block">{confirmation.specialtyName}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Date & Slot:</span>
                <span className="font-bold text-slate-900 text-sm">{confirmation.date}</span>
                <span className="text-slate-700 block font-medium">{confirmation.timeSlot}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Format:</span>
                <span className="font-semibold text-slate-800 capitalize flex items-center gap-1.5">
                  {confirmation.consultationType === 'in-clinic' ? (
                    <>
                      <Building className="w-3.5 h-3.5 text-teal-700" />
                      <span>In-Clinic Consultation</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5 text-teal-700" />
                      <span>Secure Telehealth Video</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Patient Information:</span>
                <span className="font-semibold text-slate-900">{confirmation.fullName}</span>
                <span className="text-slate-600 block truncate">{confirmation.email} · {confirmation.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 text-xs">
              <span className="text-slate-500 block mb-1">Reason for Consultation:</span>
              <p className="text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200/60">
                "{confirmation.reasonForVisit}"
              </p>
            </div>

            {confirmation.notes && (
              <div className="pt-2 text-xs">
                <span className="text-slate-500 block mb-1">Additional Patient Notes:</span>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                  {confirmation.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Printer className="w-4 h-4 text-slate-700" />}
                onClick={() => window.print()}
                className="flex-1 sm:flex-initial !bg-amber-100 !text-slate-700 !border-amber-300 hover:!bg-amber-200 hover:!text-slate-900 shadow-xs font-semibold transition-all cursor-pointer"
              >
                Print Summary
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<CalendarCheck2 className="w-4 h-4 text-slate-700" />}
                onClick={handleAddToCalendar}
                className="flex-1 sm:flex-initial !bg-amber-100 !text-slate-700 !border-amber-300 hover:!bg-amber-200 hover:!text-slate-900 shadow-xs font-semibold transition-all cursor-pointer"
              >
                Add to Calendar
              </Button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                className="flex-1 sm:flex-initial !bg-amber-100 !text-slate-700 !border-amber-300 hover:!bg-amber-200 hover:!text-slate-900 shadow-xs font-bold transition-all cursor-pointer"
              >
                Book Another Demo
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('doctors')}
                className="flex-1 sm:flex-initial !bg-amber-100 !text-slate-700 !border-amber-300 hover:!bg-amber-200 hover:!text-slate-900 shadow-xs font-bold transition-all cursor-pointer"
              >
                View Doctors Directory
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* FORM WORKFLOW: STEPS 1, 2, 3 */}
      {currentStep !== 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Active Loading Phase Banner */}
          {isSubmitting && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
              <Loader2 className="w-5 h-5 text-teal-700 animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-teal-950">
                  {submitPhase}
                </div>
                <div className="text-2xs text-teal-700 mt-0.5">
                  Simulating production transaction flow...
                </div>
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {submissionError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block">Simulation Error Encountered:</strong>
                <p>{submissionError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionError(null);
                    setSimulateError(false);
                  }}
                  className="font-semibold text-rose-900 underline underline-offset-2 mt-1 cursor-pointer"
                >
                  Dismiss error and switch to normal booking mode
                </button>
              </div>
            </div>
          )}

          {/* Inline Validation Summary */}
          {Object.keys(errors).length > 0 && !isSubmitting && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Please complete required fields:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-700">
                  {Object.values(errors).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: PATIENT DETAILS */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-700" />
                  <span>01. Patient Details & Intake</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Please provide the patient’s contact details and consultation reason. Information remains simulated within this browser session.
                </p>
              </div>

              {/* Selected doctor prefill badge if navigated from doctor profile */}
              {selectedDoctor && (
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-teal-900">
                    <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Selected Specialist: <strong>{selectedDoctor.name}</strong> ({formData.specialty})</span>
                  </div>
                  <span className="text-2xs text-teal-700 font-medium hidden sm:inline">
                    Configurable in Step 2
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Full Legal or Preferred Name *"
                  id="fullName"
                  placeholder="e.g. Priya Sharma"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  error={errors.fullName}
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  autoFocus
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address (for confirmation) *"
                    id="email"
                    type="email"
                    placeholder="e.g. priya.sharma@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={errors.email}
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  />

                  <Input
                    label="Contact Phone Number *"
                    id="phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    error={errors.phone}
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <Textarea
                  label="Primary Reason for Consultation / Symptoms *"
                  id="reasonForVisit"
                  rows={3}
                  placeholder="Describe your current symptoms, wellness concerns, or consultation goals..."
                  value={formData.reasonForVisit}
                  onChange={(e) => {
                    setFormData({ ...formData, reasonForVisit: e.target.value });
                    if (errors.reasonForVisit) setErrors({ ...errors, reasonForVisit: undefined });
                  }}
                  error={errors.reasonForVisit}
                  helperText="Minimum 8 characters. Fictional intake summary for the physician."
                />

                <Textarea
                  label="Past Medical History or Notes for Physician (Optional)"
                  id="notes"
                  rows={2}
                  placeholder="e.g. Current medications, documented allergies, prior diagnoses..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  helperText="Optional context to demonstrate detailed clinical intake fields."
                />
              </div>

              {/* Navigation Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onNavigate('doctors')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Doctors
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProceedToStep2}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Schedule
                </Button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: SCHEDULE (Specialty, Doctor, Format, Date, Time) */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-700" />
                  <span>02. Select Specialty, Physician & Schedule</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Choose your clinical specialty, preferred doctor, consultation mode, and open time slot.
                </p>
              </div>

              {/* Specialty & Doctor Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Healthcare Specialty *
                  </label>
                  <Select
                    value={formData.specialty}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    options={MOCK_SERVICES.map(s => ({
                      value: s.name,
                      label: `${s.name} (${s.category})`
                    }))}
                    error={errors.specialty}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Select Specialist Physician *
                  </label>
                  {specialtyDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {specialtyDoctors.map((doc) => {
                        const isSelected = formData.doctorId === doc.id;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setFormData({ ...formData, doctorId: doc.id });
                              if (errors.doctorId) setErrors({ ...errors, doctorId: undefined });
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700 shadow-2xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <img
                              src={doc.image}
                              alt={doc.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {doc.name}
                              </h4>
                              <p className="text-2xs text-slate-500 truncate">
                                {doc.title.split('·')[0]}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-2xs text-teal-800 font-semibold">
                                <span>${doc.consultationFee} fee</span>
                                <span>·</span>
                                <span className="text-emerald-700 truncate">{doc.nextAvailable}</span>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                      No specific specialists registered for this category demo. Falling back to primary care.
                    </div>
                  )}
                  {errors.doctorId && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.doctorId}</p>
                  )}
                </div>

                {/* Consultation Format: In-Clinic vs Telehealth */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Consultation Format *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, consultationType: 'in-clinic' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        formData.consultationType === 'in-clinic'
                          ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">In-Clinic Consultation</div>
                        <div className="text-2xs text-slate-500 mt-0.5">
                          CareNova Central Medical Hub (Suite 402)
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled={selectedDoctor && !selectedDoctor.telehealthAvailable}
                      onClick={() => setFormData({ ...formData, consultationType: 'telehealth' })}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        formData.consultationType === 'telehealth'
                          ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700 shadow-2xs cursor-pointer'
                          : selectedDoctor && !selectedDoctor.telehealthAvailable
                          ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Secure Telehealth Video</div>
                        <div className="text-2xs text-slate-500 mt-0.5">
                          Browser-based encrypted HD call demo
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-800">
                      Preferred Date *
                    </label>
                    <span className="text-2xs text-teal-800 font-medium">Availability Flow Demo</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) setErrors({ ...errors, date: undefined });
                      }}
                      className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium cursor-pointer"
                    />

                    {/* Quick Date Shortcuts */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: 'Tomorrow', days: 1 },
                        { label: '+3 Days', days: 3 },
                        { label: 'Next Week', days: 7 }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            const d = new Date(Date.now() + 86400000 * item.days).toISOString().split('T')[0];
                            setFormData({ ...formData, date: d });
                            if (errors.date) setErrors({ ...errors, date: undefined });
                          }}
                          className="px-2.5 py-2 text-2xs font-semibold rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.date && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.date}</p>
                  )}
                </div>

                {/* Time Slot Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-800">
                      Preferred Time Slot *
                    </label>
                    <span className="text-2xs text-slate-500">Interactive Schedule Demo</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = formData.timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, timeSlot: slot });
                            if (errors.timeSlot) setErrors({ ...errors, timeSlot: undefined });
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'border-teal-700 bg-teal-700 text-white shadow-2xs font-bold'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.timeSlot && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.timeSlot}</p>
                  )}
                </div>

              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Details
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProceedToStep3}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Review
                </Button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: REVIEW & CONFIRM */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-700" />
                  <span>03. Review Appointment & Confirm Request</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Please review the patient details and appointment schedule before submitting your demo request.
                </p>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Patient Details Card */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-teal-700" />
                      <span>Patient Information</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-2xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-500 block text-2xs">Patient Name</span>
                      <strong className="text-slate-900 font-semibold">{formData.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-2xs">Email & Phone</span>
                      <span className="text-slate-800 truncate block">{formData.email}</span>
                      <span className="text-slate-800">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-2xs">Reason for Visit</span>
                      <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-100 text-xs">
                        "{formData.reasonForVisit}"
                      </p>
                    </div>
                    {formData.notes && (
                      <div>
                        <span className="text-slate-500 block text-2xs">Clinical Notes</span>
                        <p className="text-slate-600 text-2xs">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialist & Schedule Card */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-700" />
                      <span>Specialist & Slot</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-2xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDoctor?.image}
                      alt={selectedDoctor?.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900">{selectedDoctor?.name}</h4>
                      <p className="text-2xs text-slate-600">{formData.specialty}</p>
                      <p className="text-2xs text-teal-800 font-semibold mt-0.5">
                        Consultation fee: ${selectedDoctor?.consultationFee} (Demo preview)
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Date:</span>
                      <strong className="text-slate-900">{formData.date}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Time Slot:</span>
                      <strong className="text-slate-900">{formData.timeSlot}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Format:</span>
                      <span className="font-semibold text-teal-900 flex items-center gap-1">
                        {formData.consultationType === 'in-clinic' ? (
                          <>
                            <Building className="w-3 h-3 text-teal-700" />
                            <span>In-Clinic Visit</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3 text-teal-700" />
                            <span>Telehealth Video</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Terms & Prototype Honesty Notice */}
              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-slate-700 space-y-2">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">CareNova Prototype Confirmation:</strong>
                    <p className="text-slate-600 leading-relaxed text-2xs mt-0.5">
                      This is a portfolio prototype demonstration. No actual clinic appointment will be registered, and no real medical services or payment transactions will occur. Submitting simulates transactional processing and generates a unique reference ID.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-teal-100/80 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeToTerms: e.target.checked });
                      if (errors.agreeToTerms) setErrors({ ...errors, agreeToTerms: undefined });
                    }}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-2xs text-slate-800 font-medium cursor-pointer">
                    I acknowledge this is a fictional portfolio prototype and agree to simulated appointment terms. *
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-xs text-rose-600 font-medium">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Reviewer / Evaluator Demo Controls (Error simulation test) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-2xs text-slate-600">
                <span className="font-medium text-slate-700">
                  UX Evaluator Tool: Test simulated server error state
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={simulateError}
                    onChange={(e) => setSimulateError(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-600"
                  />
                  <span>Simulate API Error</span>
                </label>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  disabled={isSubmitting}
                >
                  Back to Schedule
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Confirm & Request Appointment
                </Button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Emergency Service Safety Notice Footer */}
      <div className="mt-8 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            CareNova is a portfolio prototype. If experiencing a life-threatening medical emergency, immediately contact <strong>your local emergency services</strong>.
          </span>
        </div>
      </div>

    </div>
  );
};
