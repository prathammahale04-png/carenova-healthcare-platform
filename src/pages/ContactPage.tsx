import React, { useState } from 'react';
import { PageRoute } from '../types';
import { saveContactMessage } from '../lib/api';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldAlert,
  Database,
  AlertCircle
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isInsertedToSupabase, setIsInsertedToSupabase] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim()) {
      errs.message = 'Please provide your message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fullMessage = formData.subject
        ? `[Category: ${formData.category}] Subject: ${formData.subject}\n\n${formData.message.trim()}`
        : formData.message.trim();

      const result = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        message: fullMessage
      });

      setIsInsertedToSupabase(result.isInsertedToSupabase);
      setIsSent(true);
    } catch (err: any) {
      console.warn('Error saving contact message:', err);
      setSubmitError('Unable to send your inquiry at this moment. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
      
      {/* Header */}
      <SectionHeader
        kicker="Support & Inquiries"
        title="Get in Touch with CareNova"
        subtitle="Have a question regarding specialist scheduling, platform capabilities, or portfolio design specifications? We are here to help."
      />

      {/* Emergency Notice Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-rose-900 text-xs sm:text-sm">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block sm:inline mr-1">Medical Emergency Notice:</strong>
          <span>CareNova is not an emergency medical provider. If you or someone with you is experiencing a life-threatening medical emergency, call your local emergency services immediately or proceed to the nearest emergency department.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          
          {isSent ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 bg-teal-50 border border-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  {isInsertedToSupabase ? (
                    <span className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      Inserted into Supabase (public.contact_messages)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      Prototype Demo Session Mode
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Message Received Successfully
                </h3>
              </div>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your inquiry has been logged in this CareNova demo session. In a live environment, our support coordination team typically responds within 4 business hours.
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsSent(false);
                    setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete the form below to connect with our care team.
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name"
                  required
                  placeholder="e.g. Maya Chen"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  required
                  type="email"
                  placeholder="maya@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Inquiry Category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'general', label: 'General Information' },
                    { value: 'scheduling', label: 'Appointment Scheduling Assistance' },
                    { value: 'specialist', label: 'Doctor Credentialing Inquiries' },
                    { value: 'technical', label: 'Technical Platform Feedback' },
                    { value: 'portfolio', label: 'Design Portfolio Review' }
                  ]}
                />

                <Input
                  label="Subject"
                  required
                  placeholder="Regarding telehealth consultation..."
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: '' });
                  }}
                  error={errors.subject}
                />
              </div>

              <Textarea
                label="Message Content"
                required
                rows={4}
                placeholder="How can our clinical coordinator assist you today?"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                error={errors.message}
              />

              <div className="pt-2 flex items-center justify-between">
                <span className="text-2xs text-slate-400">
                  CareNova demo contact simulation
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Right Column: Contact Channels & Fictional Directory */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Information
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Health Innovation Pavilion</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    CareNova Health Center, 450 Health Way, Suite 800<br />
                    San Francisco, CA 94107 (Fictional Location)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">General Assistance</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    +1 (800) 555-CARE (Fictional)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Electronic Inquiries</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    care-support@carenova-demo.health (Fictional)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Operating Hours</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    Monday - Friday: 8:00 AM – 7:00 PM PST<br />
                    Saturday: 9:00 AM – 3:00 PM PST
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-bold text-slate-900">Looking for Instant Answers?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check our Frequently Asked Questions for detailed notes on specialist vetting, telehealth, and appointment cancellations.
              </p>
              <button
                onClick={() => onNavigate('faq')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-block pt-1"
              >
                View CareNova FAQ &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
