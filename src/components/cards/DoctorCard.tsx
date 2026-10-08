import React, { useState } from 'react';
import { Doctor } from '../../types';
import { Star, Video, MapPin, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onBookAppointment,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] hover:border-[#D6B36A]/60 shadow-2xs hover:shadow-md hover:shadow-[#D6B36A]/10 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Media & Doctor Summary */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          
          {/* Avatar with fallback */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FBF8EF] shrink-0 border border-[#E7DFCE]">
            {!imageError ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F4E9C9] text-[#5E4A1E] font-bold text-lg">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {doctor.telehealthAvailable && (
              <div
                className="absolute bottom-1 right-1 bg-[#202020]/90 text-[#D6B36A] p-1 rounded-md shadow-xs backdrop-blur-xs"
                title="Telehealth Video Consultations Supported"
              >
                <Video className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-[#77736A] mb-1">
              <span className="font-semibold text-[#8E6D2B]">{doctor.specialty}</span>
              <span aria-hidden="true">·</span>
              <span>{doctor.experienceYears} yrs exp</span>
            </div>

            <h3
              onClick={() => onViewProfile(doctor)}
              className="text-base sm:text-lg font-bold text-[#202020] truncate hover:text-[#D6B36A] cursor-pointer transition-colors"
            >
              {doctor.name}
            </h3>

            <p className="text-xs text-[#77736A] truncate mt-0.5">
              {doctor.title}
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs text-[#77736A]">
              <div className="flex items-center text-[#D6B36A] gap-1 font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#D6B36A] text-[#D6B36A]" />
                <span>{doctor.rating}</span>
              </div>
              <span className="text-[#AEB4BB] font-normal">({doctor.reviewCount} consults)</span>
            </div>
          </div>
        </div>

        {/* Quiet metadata row: unboxed text */}
        <div className="mt-4 pt-3.5 border-t border-[#E7DFCE]/70 text-xs text-[#77736A] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#77736A] shrink-0">Next Slot:</span>
            <div className="flex items-center gap-1.5 font-medium text-[#2E7D52] text-right truncate">
              <span className="w-2 h-2 rounded-full bg-[#2E7D52] animate-pulse shrink-0" />
              <span className="truncate">{doctor.nextAvailable}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#77736A] shrink-0">Languages:</span>
            <span className="text-[#3A3833] font-medium truncate text-right">
              {doctor.languages.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 sm:p-4 bg-[#FBF8EF] border-t border-[#E7DFCE] flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(doctor)}
          className="flex-1 text-xs truncate"
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onBookAppointment(doctor)}
          rightIcon={<ArrowRight className="w-3 h-3" />}
          className="flex-1 text-xs truncate"
        >
          Book Now
        </Button>
      </div>

    </div>
  );
};
