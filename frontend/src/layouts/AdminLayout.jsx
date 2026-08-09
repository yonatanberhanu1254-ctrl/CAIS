import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { useAuth } from '../hooks/useAuth';
import {
  ChartPieIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

/**
 * AdminLayout provides the primary dashboard frame.
 * Implements an accessibility-compliant semantic HTML structure.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // Dynamic Navigation Matrix enforcing RBAC visually
  const navigation = [
    { name: t('admin.nav.dashboard'),  href: '/admin/dashboard',   icon: ChartPieIcon,          roles: ['SuperAdmin', 'DepartmentAdmin'] },
    { name: t('admin.nav.sectors'),    href: '/admin/sectors',      icon: BuildingOfficeIcon,    roles: ['SuperAdmin', 'DepartmentAdmin'] },
    { name: t('admin.nav.cityInfo'),  href: '/admin/city-info',   icon: InformationCircleIcon, roles: ['SuperAdmin'] },
    { name: t('admin.nav.messages'),   href: '/admin/messages',     icon: EnvelopeIcon,          roles: ['SuperAdmin', 'DepartmentAdmin'] },
    { name: t('admin.nav.auditLogs'), href: '/admin/audit-logs',  icon: ShieldCheckIcon,       roles: ['SuperAdmin', 'DepartmentAdmin'] },
    { name: t('admin.nav.profile'),    href: '/admin/profile',      icon: UserCircleIcon,        roles: ['SuperAdmin', 'DepartmentAdmin'] },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <nav aria-label="Sidebar" className="w-64 bg-slate-900 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950 shadow-md">
            <span className="text-white text-xl font-bold tracking-wider">{t('admin.layout.title')}</span>
          </div>
          <div className="px-4 py-6 flex flex-col gap-y-2">
            {navigation.map((item) => {
              if (!item.roles.includes(user?.role)) return null; // Hide unauthorized links
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
        
        {/* User Profile Block */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-2 mb-4">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.email || t('admin.layout.defaultUser')}</p>
              <p className="text-xs font-medium text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {t('admin.layout.signOut')}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 md:justify-end">
            <h1 className="text-lg font-bold text-slate-900 md:hidden">{t('admin.layout.mobileTitle')}</h1>
            <LanguageSwitcher />
        </header>
        <div className="p-8">
          {/* React Router injects the child page here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
