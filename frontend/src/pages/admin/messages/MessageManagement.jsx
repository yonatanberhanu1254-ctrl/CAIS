import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../../services/axios';
import toast from 'react-hot-toast';
import { TrashIcon, EnvelopeOpenIcon, XMarkIcon, MagnifyingGlassIcon, InboxIcon, EnvelopeIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const MessageManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [filter, setFilter] = useState('All'); // All, Unread, Read, Archived
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminMessages', page, filter, search],
    queryFn: async () => {
      let url = `/contact-messages?page=${page}&limit=${limit}`;
      if (filter !== 'All') url += `&status=${filter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data;
    },
    keepPreviousData: true
  });

  const { data: statsData } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/statistics');
      return res.data.data.statistics;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/contact-messages/${id}/status`, { status }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      // Update selected message locally if it's the one we're viewing
      if (selectedMessage && selectedMessage.id === variables.id) {
        setSelectedMessage(prev => ({ ...prev, status: variables.status }));
      }
      toast.success('Message status updated.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/contact-messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      toast.success('Message permanently deleted.');
      setSelectedMessage(null);
    }
  });

  const openDrawer = async (msg) => {
    // Set list data immediately for responsiveness, then fetch full message with body
    setSelectedMessage(msg);
    try {
      const res = await api.get(`/contact-messages/${msg.id}`);
      setSelectedMessage(res.data.data.message);
    } catch {
      // Keep the partial list data if fetch fails
    }
    // Auto-mark as read if Unread
    if (msg.status === 'Unread') {
      updateStatusMutation.mutate({ id: msg.id, status: 'Read' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <InboxIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('admin.messages.stats.total')}</p>
            <p className="text-2xl font-bold text-slate-900">{statsData?.totalContactMessages || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <EnvelopeIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('admin.messages.stats.unread')}</p>
            <p className="text-2xl font-bold text-slate-900">{statsData?.unreadMessages || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
            <EnvelopeOpenIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('admin.messages.stats.read')}</p>
            <p className="text-2xl font-bold text-slate-900">{statsData?.readMessages || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 rounded-full bg-slate-100 text-slate-600 mr-4">
            <ArchiveBoxIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('admin.messages.stats.archived')}</p>
            <p className="text-2xl font-bold text-slate-900">{statsData?.archivedMessages || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-14rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Main List Area */}
        <div className={clsx("flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200", selectedMessage ? 'hidden lg:flex' : 'flex')}>
          <div className="border-b border-slate-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{t('admin.messages.title')}</h2>
              <select 
                value={filter} 
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                className="block w-32 rounded-md border-slate-300 py-1.5 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-slate-50"
              >
                <option value="All">All</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder={t('admin.messages.search.placeholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                {t('admin.messages.button.search')}
              </button>
              {search && (
                <button type="button" onClick={handleClearSearch} className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-300">
                  {t('admin.messages.button.clear')}
                </button>
              )}
            </form>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 animate-pulse">Loading Messages...</div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {data?.data?.messages?.length === 0 && <li className="p-8 text-center text-slate-500">{t('admin.messages.list.empty')}</li>}
                {data?.data?.messages?.map((msg) => (
                  <li 
                    key={msg.id} 
                    onClick={() => openDrawer(msg)}
                    className={clsx(
                      "relative px-6 py-5 hover:bg-slate-50 cursor-pointer transition-colors",
                      selectedMessage?.id === msg.id && "bg-blue-50",
                      msg.status === 'Unread' && "bg-white"
                    )}
                  >
                    <div className="flex justify-between space-x-3">
                      <div className="min-w-0 flex-1">
                        <p className={clsx("text-sm truncate", msg.status === 'Unread' ? 'font-bold text-slate-900' : 'font-medium text-slate-600')}>
                          {msg.full_name}
                        </p>
                        <p className={clsx("text-sm truncate mt-1", msg.status === 'Unread' ? 'font-semibold text-slate-800' : 'text-slate-500')}>
                          {msg.subject}
                        </p>
                      </div>
                      <time dateTime={msg.submitted_at || msg.created_at} className="flex-shrink-0 whitespace-nowrap text-xs text-slate-500">
                        {new Date(msg.submitted_at || msg.created_at).toLocaleDateString()}
                      </time>
                    </div>
                    {msg.status === 'Unread' && (
                       <span className="absolute top-5 left-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Page <span className="font-medium">{data.pagination.page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Drawer */}
        {selectedMessage ? (
          <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 border-l border-slate-200 shadow-xl lg:shadow-none z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-medium text-slate-900">{t('admin.messages.details.thread')}</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-500 lg:hidden">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="hidden lg:flex space-x-4">
                {selectedMessage.status !== 'Unread' && (
                   <button
                     onClick={() => updateStatusMutation.mutate({ id: selectedMessage.id, status: 'Unread' })}
                     className="text-slate-600 hover:text-blue-600 flex items-center text-sm font-medium"
                   >
                     Mark Unread
                   </button>
                )}
                {selectedMessage.status !== 'Archived' && (
                   <button
                     onClick={() => updateStatusMutation.mutate({ id: selectedMessage.id, status: 'Archived' })}
                     className="text-slate-600 hover:text-blue-600 flex items-center text-sm font-medium"
                   >
                     Archive
                   </button>
                )}
                <button
                  onClick={() => {
                    if(window.confirm('Delete this message permanently?')) deleteMutation.mutate(selectedMessage.id);
                  }}
                  className="text-red-600 hover:text-red-900 flex items-center text-sm font-medium"
                >
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white shadow-sm border border-slate-200 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold leading-6 text-slate-900">{selectedMessage.subject}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">From: <a href={`mailto:${selectedMessage.email}`} className="text-blue-600">{selectedMessage.full_name} &lt;{selectedMessage.email}&gt;</a></p>
                    {selectedMessage.phone && <p className="mt-1 max-w-2xl text-sm text-slate-500">Phone: {selectedMessage.phone}</p>}
                  </div>
                  <span className={clsx("px-2 py-1 text-xs font-medium rounded-full", 
                    selectedMessage.status === 'Unread' ? "bg-blue-100 text-blue-800" : 
                    selectedMessage.status === 'Archived' ? "bg-slate-200 text-slate-700" : 
                    "bg-emerald-100 text-emerald-800"
                  )}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="px-4 py-5 sm:p-6 prose prose-sm max-w-none text-slate-700">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Actions Bottom Bar */}
            <div className="lg:hidden p-4 bg-white border-t border-slate-200 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    if(window.confirm('Delete this message permanently?')) deleteMutation.mutate(selectedMessage.id);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium text-sm w-full text-center"
                >
                  Delete Message
                </button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-slate-50">
            <EnvelopeOpenIcon className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">{t('admin.messages.details.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManagement;
