import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '../../../services/axios';
import toast from 'react-hot-toast';
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profile_image_url || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { register: registerPwd, handleSubmit: handleSubmitPwd, reset: resetPwd, formState: { errors: errorsPwd } } = useForm();
  const { register: registerInfo, handleSubmit: handleSubmitInfo, reset: resetInfo, formState: { errors: errorsInfo } } = useForm();

  useEffect(() => {
    if (user) {
      resetInfo({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setImagePreview(user.profile_image_url || null);
    }
  }, [user, resetInfo]);

  const onUpdateInfo = async (data) => {
    setIsSubmittingInfo(true);
    try {
      await api.put('/auth/profile', data);
      toast.success('Profile information updated. Please log in again to see changes everywhere.');
    } catch (error) {
      // Handled by interceptor
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  const onUpdatePassword = async (data) => {
    setIsSubmittingPwd(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      toast.success('Security credentials updated successfully.');
      resetPwd();
    } catch (error) {
      // Handled by interceptor
    } finally {
      setIsSubmittingPwd(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));

    // Auto upload
    const formData = new FormData();
    formData.append('profile_image', file);

    setIsUploadingImage(true);
    try {
      await api.patch('/auth/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile image updated. Please log in again to see changes everywhere.');
    } catch (error) {
      // Revert preview on failure
      setImagePreview(user?.profile_image_url || null);
      setProfileImage(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('admin.profile.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t('admin.profile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Image Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl p-8 text-center flex flex-col items-center">
            <div className="relative group w-32 h-32 mb-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover shadow-md ring-4 ring-white" />
              ) : (
                <UserCircleIcon className="w-full h-full text-slate-300" />
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-xs font-medium flex flex-col items-center">
                  <PhotoIcon className="w-6 h-6 mb-1" />
                  {isUploadingImage ? 'Uploading...' : 'Change'}
                </span>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageChange} disabled={isUploadingImage} />
              </label>
            </div>
            
            <h3 className="mt-2 text-lg font-bold text-slate-900">{user?.full_name || 'Administrator'}</h3>
            <p className="text-sm font-medium text-slate-500">{user?.email}</p>
            <span className="mt-4 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {user?.role} Clearance
            </span>
          </div>
        </div>

        {/* Security Matrix */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Information Form */}
          <form onSubmit={handleSubmitInfo(onUpdateInfo)} className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-semibold leading-7 text-slate-900">{t('admin.profile.personal.title')}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {t('admin.profile.personal.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-slate-900">{t('admin.profile.personal.fullName')}</label>
                  <input
                    type="text"
                    {...registerInfo('full_name', { required: 'Name is required' })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  {errorsInfo.full_name && <p className="mt-1 text-xs text-red-600">{errorsInfo.full_name.message}</p>}
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
                  <input
                    type="email"
                    {...registerInfo('email', { 
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                    })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  {errorsInfo.email && <p className="mt-1 text-xs text-red-600">{errorsInfo.email.message}</p>}
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-slate-900">Phone Number</label>
                  <input
                    type="text"
                    {...registerInfo('phone')}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8 bg-slate-50 rounded-b-xl">
              <button
                type="submit"
                disabled={isSubmittingInfo}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {isSubmittingInfo ? 'Saving...' : t('admin.profile.button.save')}
              </button>
            </div>
          </form>

          {/* Password Form */}
          <form onSubmit={handleSubmitPwd(onUpdatePassword)} className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-semibold leading-7 text-slate-900">{t('admin.profile.password.title')}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {t('admin.profile.password.subtitle')}
                </p>
              </div>

              <div className="max-w-md">
                <label className="block text-sm font-medium leading-6 text-slate-900">{t('admin.profile.password.current')}</label>
                <input
                  type="password"
                  {...registerPwd('oldPassword', { required: 'Current password is required' })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {errorsPwd.oldPassword && <p className="mt-1 text-xs text-red-600">{errorsPwd.oldPassword.message}</p>}
              </div>

              <div className="max-w-md">
                <label className="block text-sm font-medium leading-6 text-slate-900">{t('admin.profile.password.new')}</label>
                <input
                  type="password"
                  {...registerPwd('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 8, message: "Minimum 8 characters required" }
                  })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {errorsPwd.newPassword && <p className="mt-1 text-xs text-red-600">{errorsPwd.newPassword.message}</p>}
              </div>

            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8 bg-slate-50 rounded-b-xl">
              <button
                type="submit"
                disabled={isSubmittingPwd}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {isSubmittingPwd ? 'Updating Key...' : t('admin.profile.button.update')}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Profile;
