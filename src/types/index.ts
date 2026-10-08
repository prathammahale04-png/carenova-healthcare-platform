export type PageRoute = 
  | 'home'
  | 'services'
  | 'doctors'
  | 'doctor-profile'
  | 'appointment'
  | 'about'
  | 'contact'
  | 'faq'
  | 'admin'
  | 'admin-login'
  | 'admin-appointments'
  | 'admin-doctors'
  | 'admin-services'
  | 'admin-messages';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AppointmentRecord {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  doctor_id: string | null;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: string;
  reason: string;
  status: AppointmentStatus;
  created_at?: string;
  doctor_name?: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  status?: 'unread' | 'read' | 'replied';
}

export interface AdminStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalDoctors: number;
  totalServices: number;
  totalMessages: number;
  unreadMessages: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  specialtyId: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  education: string[];
  certifications: string[];
  areasOfExpertise: string[];
  languages: string[];
  consultationFee: number;
  nextAvailable: string;
  availableDays: string[];
  location: string;
  telehealthAvailable: boolean;
}

export interface HealthcareService {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  commonConditions: string[];
  whatToExpect: string;
  averageDuration: string;
  leadSpecialistSpecialty: string;
}

export interface AppointmentFormData {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  doctorId: string;
  consultationType: 'in-clinic' | 'telehealth';
  date: string;
  timeSlot: string;
  reasonForVisit: string;
  notes?: string;
  agreeToTerms: boolean;
}

export interface AppointmentConfirmation extends AppointmentFormData {
  referenceNumber: string;
  submittedAt: string;
  doctorName: string;
  specialtyName: string;
  isInsertedToSupabase?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'doctors' | 'services' | 'availability' | 'cancellation' | 'privacy' | 'demo';
}

export interface PatientTestimonial {
  id: string;
  quote: string;
  patientName: string;
  role: string;
  specialtyConsulted: string;
  rating: number;
  date: string;
}
