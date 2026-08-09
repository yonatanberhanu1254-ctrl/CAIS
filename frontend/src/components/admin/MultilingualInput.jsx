import React from 'react';

const MultilingualInput = ({ label, name, register, type = 'text', errors, required = false, rows = 3 }) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-1">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium leading-6 text-slate-700">English {required && '*'}</label>
          {type === 'textarea' ? (
            <textarea
              rows={rows}
              {...register(`${name}_en`, required ? { required: 'English field is required' } : {})}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          ) : (
            <input
              type={type}
              {...register(`${name}_en`, required ? { required: 'English field is required' } : {})}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          )}
          {errors[`${name}_en`] && <p className="mt-1 text-xs text-red-600">{errors[`${name}_en`].message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium leading-6 text-slate-700">Amharic (አማርኛ)</label>
          {type === 'textarea' ? (
            <textarea
              rows={rows}
              {...register(`${name}_am`)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          ) : (
            <input
              type={type}
              {...register(`${name}_am`)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          )}
        </div>
        <div>
          <label className="block text-xs font-medium leading-6 text-slate-700">Afaan Oromoo</label>
          {type === 'textarea' ? (
            <textarea
              rows={rows}
              {...register(`${name}_om`)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          ) : (
            <input
              type={type}
              {...register(`${name}_om`)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultilingualInput;
