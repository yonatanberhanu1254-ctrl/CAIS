import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Protect against authenticated users reaching the login page
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // login function handles the API call and toast notifications
    await login(data.email, data.password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
             <LockClosedIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {t('public.login.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t('public.login.subtitle')}
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">{t('public.login.email.label')}</label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-slate-300'}`}
                {...register('email', { 
                  required: t('public.login.email.required'),
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t('public.login.email.invalid') }
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">{t('public.login.password.label')}</label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-slate-300'}`}
                {...register('password', { required: t('public.login.password.required') })}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? t('public.login.button.authenticating') : t('public.login.button.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
