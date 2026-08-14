import React from 'react';
import { getImageUrl } from '../../utils/imageUrl';

const PageHeader = ({ title, description, backgroundImage }) => {
  return (
    <div className="relative bg-slate-900 py-24 sm:py-32">
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(PageHeader);
