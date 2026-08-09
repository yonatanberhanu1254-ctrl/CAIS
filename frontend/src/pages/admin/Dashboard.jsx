import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BuildingOfficeIcon, EnvelopeIcon, DocumentCheckIcon, ShieldCheckIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-slate-200">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={clsx("h-6 w-6", colorClass)} aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
            <dd>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {subtext && (
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
        <div className="text-xs text-slate-500 truncate">{subtext}</div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['dashboardData', i18n.language],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  const { data: chartsData, isLoading: isLoadingCharts } = useQuery({
    queryKey: ['dashboardCharts', i18n.language],
    queryFn: async () => {
      const response = await api.get('/dashboard/monthly-charts');
      return response.data.data;
    },
    refetchInterval: 60000 // Refresh every 60s
  });

  if (isLoading || isLoadingCharts) return (
    <div className="h-full w-full flex items-center justify-center min-h-[500px]">
      <div className="text-slate-500 animate-pulse text-lg font-medium">{t('admin.dashboard.loading')}</div>
    </div>
  );

  if (isError || !dashboardData) return (
    <div className="h-full w-full flex items-center justify-center min-h-[500px]">
      <div className="text-red-500 font-medium">{t('admin.dashboard.error')}</div>
    </div>
  );

  const stats = dashboardData.statistics || {};
  const recentActs = dashboardData.recentMessages || [];
  const recentLogs = dashboardData.recentAuditLogs || []; 
  // Depending on how backend returns it, let's use the unified one if we hit /recent-activities directly, 
  // but here we hit /dashboard which returns a unified payload.

  // Prepare data for charts
  const sectorPieData = [
    { name: 'Active', value: stats.activeSectors || 0 },
    { name: 'Inactive', value: stats.inactiveSectors || 0 },
  ];

  const messagePieData = [
    { name: 'Unread', value: stats.unreadMessages || 0 },
    { name: 'Read', value: stats.readMessages || 0 },
    { name: 'Archived', value: stats.archivedMessages || 0 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('admin.dashboard.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* 12 Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard 
          title={t('admin.dashboard.stats.totalSectors')} 
          value={stats.totalSectors} 
          subtext={`Latest update: ${stats.latestSectorUpdate ? new Date(stats.latestSectorUpdate).toLocaleDateString() : 'N/A'}`}
          icon={BuildingOfficeIcon} 
          colorClass="text-blue-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.activeSectors')} 
          value={stats.activeSectors} 
          subtext={`${stats.inactiveSectors} currently inactive`}
          icon={BuildingOfficeIcon} 
          colorClass="text-emerald-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.totalMessages')} 
          value={stats.totalContactMessages} 
          subtext={`Latest: ${stats.latestMessage ? new Date(stats.latestMessage).toLocaleDateString() : 'N/A'}`}
          icon={EnvelopeIcon} 
          colorClass="text-indigo-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.unreadMessages')} 
          value={stats.unreadMessages} 
          subtext={`${stats.readMessages} read, ${stats.archivedMessages} archived`}
          icon={EnvelopeIcon} 
          colorClass="text-rose-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.totalAuditLogs')} 
          value={stats.totalAuditLogs} 
          subtext={`Latest: ${stats.latestActivity ? new Date(stats.latestActivity).toLocaleString() : 'N/A'}`}
          icon={DocumentCheckIcon} 
          colorClass="text-purple-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.systemHealth')} 
          value={dashboardData.systemHealth?.databaseStatus || 'Unknown'} 
          subtext={`Uptime: ${Math.floor((dashboardData.systemHealth?.serverUptime || 0) / 3600)}h`}
          icon={ShieldCheckIcon} 
          colorClass="text-teal-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.lastLogin')} 
          value={stats.latestLogin?.full_name || 'N/A'} 
          subtext={stats.latestLogin?.last_login_at ? new Date(stats.latestLogin.last_login_at).toLocaleString() : 'No recent logins'}
          icon={ClockIcon} 
          colorClass="text-amber-500" 
        />
        <StatCard 
          title={t('admin.dashboard.stats.appVersion')} 
          value={dashboardData.systemHealth?.applicationVersion || '1.0.0'} 
          subtext={`Environment: ${dashboardData.systemHealth?.environment || 'prod'}`}
          icon={InformationCircleIcon} 
          colorClass="text-slate-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Messages Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('admin.dashboard.charts.monthlyMessages')}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartsData?.monthlyMessages || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="total" name="Total Messages" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="unread" name="Unread" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Logs Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('admin.dashboard.charts.monthlyActivity')}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData?.monthlyAudit || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="success" name="Successful Actions" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="failure" name="Failed Actions" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Status Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('admin.dashboard.charts.sectorStatus')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message Status Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('admin.dashboard.charts.messageStatus')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={messagePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#10b981" />
                  <Cell fill="#64748b" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-bold leading-6 text-slate-900">{t('admin.dashboard.recent.title')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentActs?.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(msg.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {msg.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-md">
                    {msg.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx("px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full", 
                      msg.status === 'Unread' ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                    )}>
                      {msg.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentActs || recentActs.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-500">No recent messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
