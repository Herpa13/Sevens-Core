import React, { useState, useCallback, useEffect } from 'react';
import type { User, Role } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { MultiSelect } from '../components/common/MultiSelect';
import { AVAILABLE_VIEWS } from '../utils/viewRegistry';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { isEqual } from 'lodash-es';

interface UserDetailViewProps {
  initialData: User;
  onSave: (data: User) => void;
  // FIX: In UserDetailViewProps, updated the `onDelete` prop to accept `number | 'new'` to match the type of the entity ID, resolving a type mismatch where it was being called in App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  currentUser: User;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const UserDetailView: React.FC<UserDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, currentUser, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<User>(initialData);
  const isSelf = currentUser.id === data.id;

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
      if (isSelf && data.role !== 'Administrador') {
          alert('Un administrador no puede cambiar su propio rol a uno inferior.');
          return;
      }
      onSave(data);
      if (onSuccess) onSuccess();
  }, [data, onSave, isSelf]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(() => handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...data, [name]: value };

    // If role is changed from Nivel 3, clear allowedViews
    if (name === 'role' && value !== 'Nivel 3') {
        updatedData.allowedViews = [];
    }
    
    setData(updatedData);
  };

  const handlePermissionsChange = (selectedViewKeys: (string | number)[] | null) => {
      // MultiSelect returns null for "all", but for permissions we need an explicit list
      const finalKeys = selectedViewKeys === null ? AVAILABLE_VIEWS.map(v => v.key) : selectedViewKeys as string[];
      setData(prev => ({ ...prev, allowedViews: finalKeys }));
  }

  const handleDeleteClick = () => {
      if(isSelf) {
          alert('No puedes eliminar tu propio usuario.');
          return;
      }
      // FIX: Call onDelete with the entity ID regardless of whether it's saved ('new') or not. The parent handler in App.tsx is designed to handle this, treating deletion of a new entity as a 'cancel' action.
      onDelete(data.id);
  }

  const roleOptions: Role[] = ['Administrador', 'Nivel 2', 'Nivel 3'];
  const permissionOptions = AVAILABLE_VIEWS.map(view => ({ id: view.key, name: view.label }));


  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Usuario' : `Editando Usuario: ${initialData.name}`}</h2>
      
      <CollapsibleSection title="Información de Usuario" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nombre Completo" htmlFor="name">
                <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
            </FormField>
            <FormField label="Email" htmlFor="email">
                <TextInput type="email" id="email" name="email" value={data.email} onChange={handleInputChange} />
            </FormField>
            <FormField label="Contraseña" htmlFor="password" helpText={data.id !== 'new' ? 'Dejar en blanco para no cambiar' : ''}>
                <TextInput type="password" id="password" name="password" value={data.password || ''} onChange={handleInputChange} />
            </FormField>
            <FormField label="Rol de Usuario" htmlFor="role">
                <Select id="role" name="role" value={data.role} onChange={handleInputChange} disabled={isSelf}>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                </Select>
                 {isSelf && <p className="text-xs text-yellow-400 mt-1">No puedes cambiar tu propio rol.</p>}
            </FormField>
        </div>
      </CollapsibleSection>

        {data.role === 'Nivel 3' && (
            <CollapsibleSection title="Permisos Específicos (Nivel 3)" defaultOpen>
                <div className="p-4">
                    <FormField label="Vistas Permitidas" helpText="Selecciona las secciones a las que este usuario tendrá acceso.">
                        <MultiSelect
                            options={permissionOptions}
                            selectedIds={data.allowedViews || []}
                            onSelectionChange={(ids) => handlePermissionsChange(ids as string[] | null)}
                            placeholder="Buscar vistas..."
                         />
                    </FormField>
                </div>
            </CollapsibleSection>
        )}


      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold disabled:opacity-50" disabled={isSelf}>Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Usuario</button>
      </div>
    </div>
  );
};