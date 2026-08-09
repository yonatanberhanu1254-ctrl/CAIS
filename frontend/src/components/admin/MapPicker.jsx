import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Asella City rough bounding box
const ASELLA_BOUNDS = {
  minLat: 7.85,
  maxLat: 8.05,
  minLng: 39.05,
  maxLng: 39.20
};

const DEFAULT_CENTER = [7.9500, 39.1333];

function LocationMarker({ position, setPosition }) {
  const { t } = useTranslation();
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (
        lat >= ASELLA_BOUNDS.minLat &&
        lat <= ASELLA_BOUNDS.maxLat &&
        lng >= ASELLA_BOUNDS.minLng &&
        lng <= ASELLA_BOUNDS.maxLng
      ) {
        setPosition(e.latlng);
      } else {
        toast.error(t('admin.mapPicker.toast.outsideBounds'));
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const MapPicker = ({ defaultLat, defaultLng, onChange }) => {
  const [position, setPosition] = useState(
    defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
  );

  useEffect(() => {
    if (position) {
      onChange(position.lat, position.lng);
    }
  }, [position, onChange]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-300">
      <MapContainer 
        center={position ? [position.lat, position.lng] : DEFAULT_CENTER} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
