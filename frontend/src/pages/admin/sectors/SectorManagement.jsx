import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../../services/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import MapPicker from '../../../components/admin/MapPicker';
import MultilingualInput from '../../../components/admin/MultilingualInput';
import clsx from 'clsx';
import { getImageUrl } from '../../../utils/imageUrl';

const SectorManagement = () => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const mapLat = watch('latitude');
  const mapLng = watch('longitude');
  const generatedMapUrl = mapLat && mapLng ? `https://maps.google.com/maps?q=${mapLat},${mapLng}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '';

  const { data, isLoading } = useQuery({
    queryKey: ['adminSectors', page, search, i18n.language],
    queryFn: async () => {
      const res = await api.get(`/sectors?page=${page}&limit=${limit}&search=${search}`);
      return res.data.data;
    },
    keepPreviousData: true
  });

  const createMutation = useMutation({
    mutationFn: (newSector) => api.post('/sectors', newSector),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSectors'] });
      toast.success('Sector successfully created.');
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/sectors/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSectors'] });
      toast.success('Sector successfully updated.');
      closeModal();
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }) => api.patch(`/sectors/${id}/status`, { is_active }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminSectors'] });
      toast.success(`Sector ${variables.is_active ? 'activated' : 'deactivated'}.`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/sectors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSectors'] });
      toast.success('Sector permanently deleted.');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.patch(`/sectors/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSectors'] });
      toast.success('Sector image uploaded.');
    }
  });

  const onSubmit = (formData) => {
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please select a location on the map within Asella City.');
      return;
    }
    
    formData.google_maps_url = `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    formData.latitude = parseFloat(formData.latitude);
    formData.longitude = parseFloat(formData.longitude);

    if (editingSector) {
      updateMutation.mutate({ id: editingSector.id, payload: formData }, {
        onError: (error) => {
          if (error.response?.data?.message) toast.error(error.response.data.message);
        }
      });
    } else {
      createMutation.mutate(formData, {
        onError: (error) => {
          if (error.response?.data?.message) toast.error(error.response.data.message);
        }
      });
    }
  };

  const handleImageUpload = (e, sectorId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return toast.error('Only JPG, PNG, and WEBP files are permitted.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size exceeds the 5MB limit.');
    }

    uploadImageMutation.mutate({ id: sectorId, file });
  };

  const openModal = (sector = null) => {
    setEditingSector(sector);
    reset(sector || { 
      name_en: '', name_am: '', name_om: '',
      short_description_en: '', short_description_am: '', short_description_om: '',
      description_en: '', description_am: '', description_om: '',
      services_en: '', services_am: '', services_om: '',
      mission_en: '', mission_am: '', mission_om: '',
      vision_en: '', vision_am: '', vision_om: '',
      office_location_en: '', office_location_am: '', office_location_om: '',
      email: '', phone: '', office_hours: '', 
      latitude: 7.9500, longitude: 39.1333 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSector(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('admin.sectorManagement.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.sectorManagement.subtitle')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('admin.sectorManagement.button.add')}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder={t('admin.sectorManagement.search.placeholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="block w-full max-w-md rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sector Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {data?.sectors?.map((sector) => (
                  <tr key={sector.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 flex-shrink-0 relative group">
                        {sector.image_url ? (
                          <img className="h-10 w-10 rounded-md object-cover" src={getImageUrl(sector.image_url)} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <PhotoIcon className="h-5 w-5 text-white" />
                          <input type="file" className="sr-only" onChange={(e) => handleImageUpload(e, sector.id)} accept=".jpg,.jpeg,.png,.webp" />
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{sector.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{sector.short_description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatusMutation.mutate({ id: sector.id, is_active: !sector.is_active })}
                        className={clsx("px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full hover:opacity-80 transition-opacity", 
                          sector.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}
                      >
                        {sector.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(sector)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to permanently delete "${sector.name}"?`)) {
                            deleteMutation.mutate(sector.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.sectors?.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-500">No sectors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 border border-slate-200 rounded-lg shadow-sm flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing page <span className="font-medium">{data.pagination.page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900/75 transition-opacity" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5 border-b border-slate-200 pb-3">
                  <h3 className="text-xl leading-6 font-bold text-slate-900" id="modal-title">
                    {editingSector ? 'Edit Sector' : 'Create Sector'}
                  </h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-500 bg-slate-100 p-1 rounded-md">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <form id="sectorForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <MultilingualInput label="Sector Name" name="name" register={register} errors={errors} required={true} />
                    <MultilingualInput label="Short Description" name="short_description" register={register} errors={errors} />
                    <MultilingualInput label="Full Description" name="description" register={register} errors={errors} type="textarea" required={true} />
                    <MultilingualInput label="Services" name="services" register={register} errors={errors} type="textarea" />
                    <MultilingualInput label="Mission" name="mission" register={register} errors={errors} type="textarea" />
                    <MultilingualInput label="Vision" name="vision" register={register} errors={errors} type="textarea" />
                    <MultilingualInput label="Office Location" name="office_location" register={register} errors={errors} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        {...register('email')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Phone</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        {...register('phone')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Office Hours</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        {...register('office_hours')}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location Map (Asella City)</label>
                    <MapPicker 
                      defaultLat={mapLat} 
                      defaultLng={mapLng} 
                      onChange={(lat, lng) => {
                        setValue('latitude', lat);
                        setValue('longitude', lng);
                      }} 
                    />
                    {(!mapLat || !mapLng) && <p className="mt-1 text-xs text-red-600">Location is required</p>}
                  </div>
                  
                  {generatedMapUrl && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Google Map Preview</label>
                      <div className="h-48 rounded-lg overflow-hidden border border-slate-200">
                        <iframe 
                          src={generatedMapUrl} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen="" 
                          loading="lazy">
                        </iframe>
                      </div>
                    </div>
                  )}
                </form>
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  form="sectorForm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {editingSector ? 'Save Changes' : 'Create Sector'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorManagement;
