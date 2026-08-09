import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '../../../services/axios';
import toast from 'react-hot-toast';
import { PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import MultilingualInput from '../../../components/admin/MultilingualInput';

const CityInformationManagement = () => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: cityInfo, isLoading } = useQuery({
    queryKey: ['adminCityInfo', i18n.language],
    queryFn: async () => {
      const res = await api.get('/city-information');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (cityInfo) {
      reset({
        city_name_en: cityInfo.city_name_en || '',
        city_name_am: cityInfo.city_name_am || '',
        city_name_om: cityInfo.city_name_om || '',

        about_city_en: cityInfo.about_city_en || '',
        about_city_am: cityInfo.about_city_am || '',
        about_city_om: cityInfo.about_city_om || '',

        history_en: cityInfo.history_en || '',
        history_am: cityInfo.history_am || '',
        history_om: cityInfo.history_om || '',

        mission_en: cityInfo.mission_en || '',
        mission_am: cityInfo.mission_am || '',
        mission_om: cityInfo.mission_om || '',

        vision_en: cityInfo.vision_en || '',
        vision_am: cityInfo.vision_am || '',
        vision_om: cityInfo.vision_om || '',

        mayor_message_en: cityInfo.mayor_message_en || '',
        mayor_message_am: cityInfo.mayor_message_am || '',
        mayor_message_om: cityInfo.mayor_message_om || '',
        
        welcome_message_en: cityInfo.welcome_message_en || '',
        welcome_message_am: cityInfo.welcome_message_am || '',
        welcome_message_om: cityInfo.welcome_message_om || '',

        address_en: cityInfo.address_en || '',
        address_am: cityInfo.address_am || '',
        address_om: cityInfo.address_om || '',

        mayor_name: cityInfo.mayor_name || '',
        phone: cityInfo.phone || '',
        email: cityInfo.email || '',
        office_hours: cityInfo.office_hours || '',
        facebook_url: cityInfo.facebook_url || '',
        telegram_url: cityInfo.telegram_url || '',
        website_url: cityInfo.website_url || '',
        latitude: cityInfo.latitude || '',
        longitude: cityInfo.longitude || '',
      });
    }
  }, [cityInfo, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload) => {
        if(!cityInfo) return api.post('/city-information', payload);
        return api.put('/city-information', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCityInfo'] });
      toast.success('City Information successfully updated.');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ file, endpoint, field }) => {
      const formData = new FormData();
      formData.append(field, file);
      return api.patch(`/city-information${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCityInfo'] });
      toast.success('Image successfully uploaded.');
    }
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null
    });
  };

  const handleImageUpload = (e, endpoint, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return toast.error('Only JPG, PNG, and WEBP files are permitted.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size exceeds the 5MB limit.');
    }

    uploadImageMutation.mutate({ file, endpoint, field });
  };

  if (isLoading) return <div className="p-8 animate-pulse text-slate-500">{t('admin.cityInfo.loading')}</div>;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {t('admin.cityInfo.title')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.cityInfo.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8 space-y-8">
              
              <div>
                <h3 className="text-base font-semibold leading-7 text-slate-900 border-b border-slate-200 pb-2 mb-4">{t('admin.cityInfo.basic.title')}</h3>
                <MultilingualInput label="City Name" name="city_name" register={register} errors={errors} required={true} />
                
                <div className="mt-6 mb-6">
                  <label className="block text-sm font-medium leading-6 text-slate-900">{t('admin.cityInfo.basic.mayorName')}</label>
                  <input
                    type="text"
                    {...register('mayor_name')}
                    className="mt-2 block w-full md:w-1/3 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold leading-7 text-slate-900 border-b border-slate-200 pb-2 mb-4">{t('admin.cityInfo.descriptions.title')}</h3>
                
                <MultilingualInput label="About City" name="about_city" register={register} errors={errors} type="textarea" required={true} />
                <MultilingualInput label="History" name="history" register={register} errors={errors} type="textarea" />
                <MultilingualInput label="Mission" name="mission" register={register} errors={errors} type="textarea" />
                <MultilingualInput label="Vision" name="vision" register={register} errors={errors} type="textarea" />
                <MultilingualInput label="Mayor's Message" name="mayor_message" register={register} errors={errors} type="textarea" />
                <MultilingualInput label="Welcome Message" name="welcome_message" register={register} errors={errors} type="textarea" />
              </div>

              <div>
                <h3 className="text-base font-semibold leading-7 text-slate-900 border-b border-slate-200 pb-2 mb-4">{t('admin.cityInfo.contact.title')}</h3>
                
                <MultilingualInput label="Address" name="address" register={register} errors={errors} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Phone Number</label>
                    <input
                      type="text"
                      {...register('phone')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Office Hours</label>
                    <input
                      type="text"
                      {...register('office_hours')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Website URL</label>
                    <input
                      type="url"
                      {...register('website_url')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      {...register('latitude')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      {...register('longitude')}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8 bg-slate-50 rounded-b-xl">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : t('admin.cityInfo.button.save')}
              </button>
            </div>
          </form>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
            <h3 className="text-base font-semibold leading-7 text-slate-900">{t('admin.cityInfo.media.logo')}</h3>
            <div className="mt-4 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 bg-slate-50">
              <div className="text-center">
                {cityInfo?.logo_url ? (
                  <img src={cityInfo.logo_url} alt="Logo preview" className="mx-auto h-24 w-auto mb-4 object-contain" />
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" aria-hidden="true" />
                )}
                <div className="flex text-sm leading-6 text-slate-600 justify-center">
                  <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>{cityInfo?.logo_url ? 'Replace Logo' : 'Upload Logo'}</span>
                    <input type="file" className="sr-only" onChange={(e) => handleImageUpload(e, '/logo', 'logo')} accept=".jpg,.jpeg,.png,.webp" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
            <h3 className="text-base font-semibold leading-7 text-slate-900">{t('admin.cityInfo.media.banner')}</h3>
            <div className="mt-4 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 relative overflow-hidden bg-slate-50">
               {cityInfo?.banner_url && (
                 <img src={cityInfo.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
               )}
               <div className="text-center relative z-10">
                  <PhotoIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" aria-hidden="true" />
                  <div className="flex text-sm leading-6 text-slate-600 justify-center">
                    <label className="relative cursor-pointer rounded-md bg-white px-3 py-2 font-semibold text-blue-600 hover:text-blue-500 shadow-sm ring-1 ring-inset ring-slate-300">
                      <span>{cityInfo?.banner_url ? 'Replace Banner' : 'Upload Banner'}</span>
                      <input type="file" className="sr-only" onChange={(e) => handleImageUpload(e, '/banner', 'banner')} accept=".jpg,.jpeg,.png,.webp" />
                    </label>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
            <h3 className="text-base font-semibold leading-7 text-slate-900">{t('admin.cityInfo.media.mayor')}</h3>
            <div className="mt-4 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 bg-slate-50">
              <div className="text-center">
                {cityInfo?.mayor_image_url ? (
                  <img src={cityInfo.mayor_image_url} alt="Mayor preview" className="mx-auto h-24 w-24 rounded-full object-cover mb-4 shadow-sm" />
                ) : (
                  <UserIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" aria-hidden="true" />
                )}
                <div className="flex text-sm leading-6 text-slate-600 justify-center">
                  <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>{cityInfo?.mayor_image_url ? 'Replace Photo' : 'Upload Photo'}</span>
                    <input type="file" className="sr-only" onChange={(e) => handleImageUpload(e, '/mayor-image', 'mayor_image')} accept=".jpg,.jpeg,.png,.webp" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityInformationManagement;
