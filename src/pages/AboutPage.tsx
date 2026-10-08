import React from 'react';
import { PageRoute } from '../types';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  Cpu,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16 sm:space-y-24">
      
      {/* Hero Section of About */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B]">
          About The CareNova Platform
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#202020] tracking-tight leading-[1.2]"
          style={{ textWrap: 'balance' }}
        >
          Reimagining the Digital Front Door of Healthcare
        </h1>
        <p className="text-base sm:text-lg text-[#77736A] leading-relaxed font-normal">
          CareNova was conceived as a digital healthcare model where patient clarity, clinical trustworthiness, and frictionless coordination take precedence over legacy healthcare bureaucracy.
        </p>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-8 sm:p-10 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FBF8EF] border border-[#E7DFCE] flex items-center justify-center text-[#D6B36A]">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#202020]">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base text-[#77736A] leading-relaxed">
              To make discovering and booking exceptional medical care as effortless, transparent, and dignified as the best modern software experiences—without compromising clinical rigour or patient privacy.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E7DFCE]/70 text-xs text-[#77736A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6B36A]" />
            <span>Eliminating administrative barriers between doctors and patients</span>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-[#202020] text-[#FFFDF8] rounded-2xl border border-[#3A3833] p-8 sm:p-10 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#2A2926] border border-[#3A3833] flex items-center justify-center text-[#D6B36A]">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#FFFDF8]">
              Our Vision
            </h2>
            <p className="text-sm sm:text-base text-[#D9DDE2] leading-relaxed">
              A healthcare landscape where preventive guidance, specialist discovery, and telehealth are integrated into a single cohesive ecosystem that empowers individuals to take proactive ownership of their health.
            </p>
          </div>
          <div className="pt-4 border-t border-[#3A3833] text-xs text-[#AEB4BB] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6B36A]" />
            <span>Proactive, continuous health relationships rather than episodic illness</span>
          </div>
        </div>

      </div>

      {/* Why We Built CareNova */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-8 sm:p-12 shadow-2xs space-y-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B] mb-2">
            Origin Story
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202020]">
            Why We Built CareNova
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-[#77736A] leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-[#202020] text-base">The Friction of Legacy Systems</h3>
            <p>
              Traditional hospital websites are designed for organizational administrative hierarchies rather than patient needs. Obscure menus, phone trees, and vague availability leave patients anxious and underserved.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#202020] text-base">The Need for Human Warmth</h3>
            <p>
              Healthcare is deeply personal. A patient seeking help deserves clear physician credentials, understandable consultation scopes, and visual warmth that inspires reassurance and trust.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#202020] text-base">Modern Digital Craft</h3>
            <p>
              By fusing modern interaction design, clean typographic hierarchy, and responsive layout architecture, CareNova demonstrates how digital healthcare platforms can feel as intuitive as world-class consumer apps.
            </p>
          </div>
        </div>
      </div>

      {/* Technology & Human-Centered Design */}
      <div className="space-y-8">
        <SectionHeader
          kicker="Engineering & Design Philosophy"
          title="Technology Meets Human-Centered Design"
          subtitle="How architectural decisions and visual restraint combine to produce an interface patients can rely on."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#E7DFCE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF8EF] text-[#D6B36A] border border-[#E7DFCE] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#202020] text-base">High-Performance Core</h3>
            <p className="text-xs text-[#77736A] leading-relaxed">
              Built on React 19 and modern CSS architecture for instant route transitions and zero lag when filtering clinical schedules.
            </p>
          </div>

          <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#E7DFCE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF8EF] text-[#D6B36A] border border-[#E7DFCE] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#202020] text-base">Privacy-by-Design</h3>
            <p className="text-xs text-[#77736A] leading-relaxed">
              Zero behavioral ad trackers. The platform is architected around strict data minimization and clinical confidentiality.
            </p>
          </div>

          <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#E7DFCE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF8EF] text-[#D6B36A] border border-[#E7DFCE] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#202020] text-base">Accessible & Responsive</h3>
            <p className="text-xs text-[#77736A] leading-relaxed">
              Designed intentionally across 360px mobile viewports up to 1440px desktop screens with touch-friendly 44px+ tap targets.
            </p>
          </div>

          <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[#E7DFCE] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF8EF] text-[#D6B36A] border border-[#E7DFCE] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#202020] text-base">Zero-Pill Restraint</h3>
            <p className="text-xs text-[#77736A] leading-relaxed">
              Refined typographic hierarchy and calm colors avoiding generic AI gradients, floating badges, or gimmicky decoration.
            </p>
          </div>

        </div>
      </div>

      {/* Portfolio Creator Box */}
      <div className="bg-[#202020] text-[#FFFDF8] rounded-2xl p-8 sm:p-10 shadow-lg border border-[#3A3833] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B36A]">
            Portfolio Context
          </span>
          <h3 className="text-2xl font-bold text-[#FFFDF8]">
            Designed for AI Web Designer & Product Creator Portfolio
          </h3>
          <p className="text-sm text-[#D9DDE2] leading-relaxed">
            This project showcases end-to-end frontend craftsmanship, design systems thinking, responsive resilience, and user experience design for high-trust digital services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('contact')}
          >
            Get In Touch
          </Button>
          <Button
            variant="outline-white"
            size="md"
            onClick={() => onNavigate('doctors')}
          >
            Explore Directory
          </Button>
        </div>
      </div>

    </div>
  );
};
