import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Direct integration to public contact POST endpoint
      await api.post('/contact-messages', data);
      toast.success(t('public.contactForm.toast.success'));
      reset(); // Clear form instantly on success
    } catch (error) {
      // Global axios interceptor will handle standard 429/500 toasts
      toast.error(t('public.contactForm.toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">{t('public.contactForm.labels.fullName')}</label>
        <div className="mt-1">
          <input
            type="text"
            id="full_name"
            className={`shadow-sm block w-full sm:text-sm rounded-md px-4 py-3 border ${errors.full_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            {...register('full_name', { required: t('public.contactForm.errors.nameRequired') })}
            aria-invalid={errors.full_name ? 'true' : 'false'}
          />
          {errors.full_name && <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('public.contactForm.labels.email')}</label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            className={`shadow-sm block w-full sm:text-sm rounded-md px-4 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            {...register('email', { 
              required: t('public.contactForm.errors.emailRequired'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('public.contactForm.errors.emailInvalid')
              }
            })}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">{t('public.contactForm.labels.subject')}</label>
        <div className="mt-1">
          <input
            type="text"
            id="subject"
            className={`shadow-sm block w-full sm:text-sm rounded-md px-4 py-3 border ${errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            {...register('subject', { required: t('public.contactForm.errors.subjectRequired') })}
          />
          {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">{t('public.contactForm.labels.message')}</label>
        <div className="mt-1">
          <textarea
            id="message"
            rows={5}
            className={`shadow-sm block w-full sm:text-sm rounded-md px-4 py-3 border ${errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            {...register('message', { 
              required: t('public.contactForm.errors.messageRequired'),
              minLength: { value: 10, message: t('public.contactForm.errors.messageMinLength') }
            })}
          />
          {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? t('public.contactForm.button.submitting') : t('public.contactForm.button.submit')}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
