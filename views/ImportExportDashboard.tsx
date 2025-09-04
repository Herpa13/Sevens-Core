

import React, { useState, useMemo } from 'react';
import type { AppData } from '../types';
import { Icon } from '../components/common/Icon';

interface ImportExportDashboardProps {
  appData: AppData;
  onNewExport: () => void;
  onNewImport: () => void;
  onUndoImport: (jobId: number) => void;
  onManageTemplates: () => void;
}

type Job = AppData['importJobs'][0] | AppData['exportJobs'][0];
const isImportJob = (job: Job): job is AppData['importJobs'][0] => 'status' in job;

export const ImportExportDashboard: React.FC<ImportExportDashboardProps> = ({ appData, onNewExport, onNewImport, onUndoImport, onManageTemplates }) => {
    const { importJobs, exportJobs, importExportTemplates } = appData;
    const [filter, setFilter] = useState<'all' | 'imports' | 'exports'>('all');
    
    const allJobs = useMemo(() => {
        const importsWithType: (AppData['importJobs'][0] & {jobType: 'import'})[] = importJobs.map(j => ({ ...j, jobType: 'import' }));
        const exportsWithType: (AppData['exportJobs'][0] & {jobType: 'export'})[] = exportJobs.map(j => ({ ...j, jobType: 'export' }));
        return [...importsWithType, ...exportsWithType].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [importJobs, exportJobs]);

    const filteredJobs = useMemo(() => {
        if (filter === 'imports') return allJobs.filter(isImportJob);
        if (filter === 'exports') return allJobs.filter(job => !isImportJob(job));
        return allJobs;
    }, [allJobs, filter]);

    const statusConfig: Record<string, { color: string; icon: string }> = {
        'Completado': { color: 'green', icon: 'check-circle' },
        'Fallido': { color: 'red', icon: 'times-circle' },
        'Deshecho': { color: 'gray', icon: 'undo' },
    };
    
    const colorVariants = {
        greenBg: 'bg-green-500/10 text-green-300',
        redBg: 'bg-red-500/10 text-red-300',
        grayBg: 'bg-slate-500/20 text-slate-400',
    };

  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-200">Centro de Importación y Exportación</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona operaciones de datos masivas de forma segura.</p>
        </div>
        <div className="flex items-center space-x-2">
             <button
                onClick={onNewExport}
                className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
                <Icon name="file-export" className="mr-2" />
                Nueva Exportación
            </button>
            <button
                onClick={onNewImport}
                className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            >
                <Icon name="file-import" className="mr-2" />
                Nueva Importación
            </button>
            <button
                onClick={onManageTemplates}
                className="flex items-center px-4 py-2 bg-slate-600 text-slate-200 font-semibold rounded-md hover:bg-slate-500"
            >
                <Icon name="cogs" className="mr-2" />
                Gestionar Plantillas
            </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-300">Historial de Trabajos</h2>
            <div className="flex items-center space-x-2">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600'}`}>Todos</button>
                <button onClick={() => setFilter('imports')} className={`px-3 py-1 text-sm rounded-md ${filter === 'imports' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600'}`}>Importaciones</button>
                <button onClick={() => setFilter('exports')} className={`px-3 py-1 text-sm rounded-md ${filter === 'exports' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600'}`}>Exportaciones</button>
            </div>
        </div>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plantilla</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Resumen</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {filteredJobs.map(job => {
                        const template = importExportTemplates.find(t => t.id === job.templateId);
                        const isImport = isImportJob(job);
                        const config = isImport ? statusConfig[job.status] : null;
                        
                        return (
                            <tr key={`${isImport ? 'import' : 'export'}-${job.id}`}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{new Date(job.timestamp).toLocaleString()}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isImport ? 'bg-green-500/10 text-green-300' : 'bg-blue-500/10 text-blue-300'}`}>
                                        <Icon name={isImport ? 'file-import' : 'file-export'} className="mr-1.5"/>
                                        {isImport ? 'Importación' : 'Exportación'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200">{template?.name || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{job.summary}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {isImport && config && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorVariants[(config.color + 'Bg') as keyof typeof colorVariants]}`}>
                                            <Icon name={config.icon} className="mr-1.5" />
                                            {job.status}
                                        </span>
                                    )}
                                    {!isImport && (
                                        <span className="text-slate-500">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                    {isImport && job.status === 'Completado' && (
                                        <button 
                                            onClick={() => onUndoImport(job.id as number)}
                                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-md hover:bg-yellow-500/30 text-xs font-semibold flex items-center"
                                        >
                                            <Icon name="undo" className="mr-1.5"/>
                                            Deshacer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        {filteredJobs.length === 0 && (
            <div className="text-center p-12 text-slate-500">
                <Icon name="folder-open" className="text-4xl mb-4" />
                <p>No se han realizado operaciones todavía.</p>
            </div>
        )}
      </div>
    </div>
  );
};
