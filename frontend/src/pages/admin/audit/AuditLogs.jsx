import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../../services/axios';
import { useAuth } from '../../../hooks/useAuth';
import clsx from 'clsx';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const AuditLogs = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  // Critical RBAC Check - Pre-flight
  if (user?.role !== 'SuperAdmin') {
    return (
      <div className="text-center py-20">
        <ShieldExclamationIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900">{t('admin.auditLogs.denied.title')}</h3>
        <p className="text-slate-500 mt-2">{t('admin.auditLogs.denied.message')}</p>
      </div>
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs', page, actionFilter],
    queryFn: async () => {
      let url = `/audit-logs?page=${page}&limit=20`;
      if (actionFilter) url += `&action=${actionFilter}`;
      const res = await api.get(url);
      return res.data; // Contains data and pagination object
    },
    keepPreviousData: true
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('admin.auditLogs.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.auditLogs.subtitle')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={actionFilter} 
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">{t('admin.auditLogs.filter.all')}</option>
            <option value="LOGIN">Logins</option>
            <option value="CREATE_SECTOR">Sector Creation</option>
            <option value="UPDATE_SECTOR">Sector Updates</option>
            <option value="DELETE_SECTOR">Sector Deletion</option>
            <option value="UPDATE_CITY_INFO">City Updates</option>
            <option value="DELETE_AUDIT_LOG">Log Deletions</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Scanning ledgers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('admin.auditLogs.table.timestamp')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('admin.auditLogs.table.adminId')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('admin.auditLogs.table.action')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('admin.auditLogs.table.target')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('admin.auditLogs.table.status')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 font-mono text-sm">
                {data?.data?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      SYS-{log.admin_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", log.status === 'SUCCESS' ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Strip */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= (data?.pagination?.totalPages || 1)} className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing page <span className="font-medium">{data?.pagination?.page || 1}</span> of <span className="font-medium">{data?.pagination?.totalPages || 1}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => setPage(1)} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">First</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">Prev</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= (data?.pagination?.totalPages || 1)} className="relative inline-flex items-center px-2 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">Next</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
