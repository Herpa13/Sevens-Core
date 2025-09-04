import React from 'react';
import { Icon } from '../components/common/Icon';

export const AccessDeniedView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-800 rounded-lg">
      <Icon name="ban" className="text-6xl text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-200">Acceso Denegado</h2>
      <p className="mt-2 text-slate-400">
        No tienes los permisos necesarios para acceder a esta sección.
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Por favor, contacta con un administrador si crees que esto es un error.
      </p>
    </div>
  );
};
