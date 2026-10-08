import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ContactMessageRecord } from '../../types';
import { getAdminMessages, updateMessageStatus } from '../../lib/adminData';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminModal } from '../../components/admin/AdminModal';
import { StatusBadge } from '../../components/admin/StatusBadge';
import {
  MessageSquare,
  Search,
  Mail,
  User,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  RotateCw,
  Send,
  CornerDownRight
} from 'lucide-react';

interface AdminMessagesPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminMessagesPage: React.FC<AdminMessagesPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRecord | null>(null);

  const loadMessages = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await getAdminMessages();
      setMessages(res.data);
    } catch (err) {
      console.warn('Note loading admin messages:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    updateMessageStatus(id, newStatus);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleOpenMessage = (msg: ContactMessageRecord) => {
    setSelectedMessage(msg);
    if (!msg.status || msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const msgStatus = msg.status || 'unread';
      if (statusFilter !== 'all' && msgStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = msg.name.toLowerCase().includes(q);
        const matchesEmail = msg.email.toLowerCase().includes(q);
        const matchesContent = msg.message.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesContent) return false;
      }
      return true;
    });
  }, [messages, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: messages.length,
      unread: messages.filter(m => !m.status || m.status === 'unread').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length
    };
  }, [messages]);

  return (
    <AdminLayout
      currentPage="admin-messages"
      onNavigate={onNavigate}
      onRefresh={() => loadMessages(true)}
      isRefreshing={isRefreshing}
      counts={{ unreadMessages: counts.unread }}
    >
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries by sender, email, or message keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
          </div>

          <div className="text-2xs text-slate-500 font-medium">
            Synchronized with <code className="font-mono text-teal-800 bg-teal-50 px-1 py-0.5 rounded">public.contact_messages</code>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          {[
            { id: 'all', label: 'All Inquiries', count: counts.all },
            { id: 'unread', label: 'Unread', count: counts.unread },
            { id: 'read', label: 'Reviewed', count: counts.read },
            { id: 'replied', label: 'Replied', count: counts.replied }
          ].map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-2xs px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-teal-900 text-teal-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
            <p>Loading contact inquiries from database...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">No contact messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
                      {msg.name}
                    </span>
                    <StatusBadge status={msg.status || 'unread'} size="sm" />
                    {msg.created_at && (
                      <span className="text-2xs text-slate-400 hidden sm:inline">
                        · {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-2xs text-slate-500">{msg.email}</p>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed pt-0.5">
                    {msg.message}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMessage(msg);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Full</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <AdminModal
          isOpen={Boolean(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
          title={`Inquiry from ${selectedMessage.name}`}
          subtitle={`Received via CareNova Contact Form`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            {/* Sender header */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedMessage.name}</div>
                <div className="text-2xs text-slate-500">{selectedMessage.email}</div>
              </div>
              <StatusBadge status={selectedMessage.status || 'read'} />
            </div>

            {/* Message Body */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 text-2xs mb-1">
                Full Message Text
              </h5>
              <div className="p-4 bg-slate-50 rounded-xl text-slate-800 text-sm leading-relaxed border border-slate-100 whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'unread')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                >
                  Mark as Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Replied</span>
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Regarding your CareNova Inquiry`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Mail Client</span>
              </a>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};
