import React, { useState, useMemo } from 'react';
import { PageRoute } from '../types';
import { MOCK_FAQS } from '../data/mockData';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { Search, ChevronDown, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'booking', label: 'Booking & Scheduling' },
    { id: 'doctors', label: 'Specialists & Vetting' },
    { id: 'services', label: 'Services & Telehealth' },
    { id: 'cancellation', label: 'Cancellation & Rescheduling' },
    { id: 'privacy', label: 'Security & Privacy' },
    { id: 'demo', label: 'Portfolio Prototype' }
  ];

  const filteredFaqs = useMemo(() => {
    return MOCK_FAQS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen = filteredFaqs.reduce((acc, f) => ({ ...acc, [f.id]: true }), {});
    setOpenIds(allOpen);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
      
      {/* Header */}
      <SectionHeader
        kicker="Help & Clarity"
        title="Frequently Asked Questions"
        subtitle="Transparent answers regarding clinical scheduling, specialist vetting criteria, privacy safeguards, and demonstration limits."
      />

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type keyword, topic, or question (e.g. cancellation, telehealth, credentials)..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 shadow-2xs"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredFaqs.length}</strong> matching questions
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={collapseAll}
              className="text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

      </div>

      {/* Accordion list */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 font-semibold text-slate-900 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base leading-snug">{faq.question}</span>
                  <div className={`p-1 rounded-md text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 bg-slate-50/40 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-900">No matching FAQ found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try a different search term or browse all question categories.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Help Card */}
      <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Have a question that is not covered here?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our clinical coordinators and product team are always happy to answer questions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('contact')}
          >
            Contact Support
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('appointment')}
          >
            Book Appointment
          </Button>
        </div>
      </div>

    </div>
  );
};
