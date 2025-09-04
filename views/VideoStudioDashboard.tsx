import React, { useState, useMemo } from 'react';
import type { AppData, VideoProject, VideoProjectStatus, Entity, EntityType } from '../types';
import { Icon } from '../components/common/Icon';
import { CreateProjectFromTemplateModal } from '../components/modals/CreateProjectFromTemplateModal';
import { Select } from '../components/common/Select';
import { KeywordManager } from '../components/common/KeywordManager';
import { TextInput } from '../components/common/TextInput';

interface VideoStudioDashboardProps {
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onSaveProject: (entityType: 'videoProjects', data: VideoProject) => void;
}

// --- START HELPER FUNCTIONS & COMPONENTS ---

const getWeekNumber = (d: Date): [number, number] => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
};

const getStartOfWeek = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay() || 7; 
    if (day !== 1) date.setHours(-24 * (day - 1));
    date.setHours(0,0,0,0);
    return date;
}

const CalendarEvent: React.FC<{
    project: VideoProject,
    type: 'creation' | 'publication',
    onClick: () => void,
}> = ({ project, type, onClick }) => {
    const isCreation = type === 'creation';
    const color = isCreation ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-green-500/20 text-green-300 border-green-500/50';
    const icon = isCreation ? 'pencil-ruler' : 'rocket';

    return (
        <div onClick={onClick} className={`p-1.5 rounded-md text-xs cursor-pointer ${color} hover:opacity-80`}>
            <Icon name={icon} className="mr-1.5" />
            {project.name}
        </div>
    );
};

const CalendarView: React.FC<{
    projects: VideoProject[];
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}> = ({ projects, onSelectItem }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    let startDay = startOfMonth.getDay();
    if (startDay === 0) startDay = 7; // Sunday is 0, make it 7
    startDay -=1; // Monday is 0
    
    const daysInMonth = useMemo(() => {
        const days = [];
        for (let i = 0; i < startDay; i++) { days.push(null); }
        for (let i = 1; i <= endOfMonth.getDate(); i++) { days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i)); }
        return days;
    }, [currentDate]);

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };
  
    const getEventsForDay = (day: Date) => {
      const dayStr = day.toISOString().split('T')[0];
      return projects.filter(p => p.plannedCreationDate === dayStr || p.plannedPublicationDate === dayStr);
    };

    return (
         <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700"><Icon name="chevron-left"/></button>
                <h2 className="text-xl font-bold text-slate-200 capitalize">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700"><Icon name="chevron-right"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase pb-2">{day}</div>
                ))}
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="border border-slate-800 rounded-md"></div>;
                    
                    const events = getEventsForDay(day);
                    const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                    
                    return (
                        <div key={day.toString()} className={`border border-slate-700 rounded-md p-1.5 min-h-[100px] ${isToday ? 'bg-cyan-500/10' : ''}`}>
                            <div className={`font-semibold text-xs text-right ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>{day.getDate()}</div>
                            <div className="space-y-1 mt-1">
                                {events.map(project => {
                                    const isCreation = project.plannedCreationDate === day.toISOString().split('T')[0];
                                    return <CalendarEvent key={`${project.id}-${isCreation ? 'c' : 'p'}`} project={project} type={isCreation ? 'creation' : 'publication'} onClick={() => onSelectItem('videoProjects', project)} />
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ListView: React.FC<{
    projects: VideoProject[];
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}> = ({ projects, appData, onSelectItem }) => {
    
    const statusConfig: Record<VideoProjectStatus, { color: string, text: string }> = {
        'Planificación': { color: 'bg-blue-500/20 text-blue-300', text: 'Planificación' },
        'Storyboard': { color: 'bg-indigo-500/20 text-indigo-300', text: 'Storyboard' },
        'Revisión': { color: 'bg-yellow-500/20 text-yellow-300', text: 'Revisión' },
        'Acabado': { color: 'bg-purple-500/20 text-purple-300', text: 'Acabado' },
        'Publicado': { color: 'bg-green-500/20 text-green-300', text: 'Publicado' },
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nombre Proyecto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fecha Creación</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fecha Publicación</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {projects.map(project => {
                        const product = appData.products.find(p => p.id === project.productId);
                        return (
                        <tr key={project.id} onClick={() => onSelectItem('videoProjects', project)} className="hover:bg-slate-700/50 cursor-pointer">
                            <td className="px-4 py-3 text-sm font-medium text-slate-200">{project.name}</td>
                             <td className="px-4 py-3 text-sm text-slate-400">{product?.name || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}>
                                    {statusConfig[project.status].text}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-400">{project.plannedCreationDate ? new Date(project.plannedCreationDate + 'T00:00:00').toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-slate-400">{project.plannedPublicationDate ? new Date(project.plannedPublicationDate + 'T00:00:00').toLocaleDateString() : '-'}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

const KPICard: React.FC<{ title: string, toFinish: number, toPublish: number }> = ({ title, toFinish, toPublish }) => (
    <div className="bg-slate-800/60 p-3 rounded-lg">
        <h4 className="font-bold text-slate-200 text-sm">{title}</h4>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>A Finalizar: <strong className="text-blue-300">{toFinish}</strong></span>
            <span>A Publicar: <strong className="text-green-300">{toPublish}</strong></span>
        </div>
    </div>
);


const KPIsPanel: React.FC<{ projects: VideoProject[] }> = ({ projects }) => {
    const kpis = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;

        const getProjectsInDateRange = (startDate: Date, endDate: Date) => {
            const toFinish = projects.filter(p => p.plannedCreationDate && new Date(p.plannedCreationDate) >= startDate && new Date(p.plannedCreationDate) <= endDate).length;
            const toPublish = projects.filter(p => p.plannedPublicationDate && new Date(p.plannedPublicationDate) >= startDate && new Date(p.plannedPublicationDate) <= endDate).length;
            return { toFinish, toPublish };
        };

        const months = Array.from({ length: 6 }).map((_, i) => {
            const date = new Date(currentYear, currentMonth + i, 1);
            const name = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return { name, ...getProjectsInDateRange(startDate, endDate) };
        });

        const quarters = Array.from({ length: 4 }).map((_, i) => {
            const quarter = currentQuarter + i;
            const year = currentYear + Math.floor((quarter - 1) / 4);
            const q = ((quarter - 1) % 4) + 1;
            const name = `Q${q} ${year}`;
            const startDate = new Date(year, (q - 1) * 3, 1);
            const endDate = new Date(year, q * 3, 0);
            return { name, ...getProjectsInDateRange(startDate, endDate) };
        });

        const year = {
            name: `${currentYear}`,
            ...getProjectsInDateRange(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31))
        };

        return { months, quarters, year };
    }, [projects]);

    return (
        <div className="sticky top-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-200">KPIs de Planificación</h3>
            <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Mensual</h4>
                <div className="space-y-2">
                    {kpis.months.map(m => <KPICard key={m.name} title={m.name} toFinish={m.toFinish} toPublish={m.toPublish} />)}
                </div>
            </div>
             <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Trimestral</h4>
                <div className="space-y-2">
                     {kpis.quarters.map(q => <KPICard key={q.name} title={q.name} toFinish={q.toFinish} toPublish={q.toPublish} />)}
                </div>
            </div>
             <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Anual</h4>
                 <KPICard title={kpis.year.name} toFinish={kpis.year.toFinish} toPublish={kpis.year.toPublish} />
            </div>
        </div>
    );
};

const WeeklyPlanningView: React.FC<{
    projects: VideoProject[];
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}> = ({ projects, onSelectItem }) => {
    
    const weeklyData = useMemo(() => {
        const weeks: Record<string, {
            weekNumber: number;
            year: number;
            startDate: Date;
            toFinish: VideoProject[];
            toPublish: VideoProject[];
        }> = {};

        projects.forEach(p => {
            if (p.plannedCreationDate) {
                const date = new Date(p.plannedCreationDate + 'T00:00:00');
                const startOfWeek = getStartOfWeek(date);
                const [year, weekNum] = getWeekNumber(date);
                const key = `${year}-W${weekNum}`;
                if (!weeks[key]) weeks[key] = { weekNumber: weekNum, year, startDate: startOfWeek, toFinish: [], toPublish: [] };
                weeks[key].toFinish.push(p);
            }
            if (p.plannedPublicationDate) {
                const date = new Date(p.plannedPublicationDate + 'T00:00:00');
                const startOfWeek = getStartOfWeek(date);
                const [year, weekNum] = getWeekNumber(date);
                 const key = `${year}-W${weekNum}`;
                if (!weeks[key]) weeks[key] = { weekNumber: weekNum, year, startDate: startOfWeek, toFinish: [], toPublish: [] };
                weeks[key].toPublish.push(p);
            }
        });

        return Object.values(weeks).sort((a,b) => a.startDate.getTime() - b.startDate.getTime());

    }, [projects]);
    
    const ProjectCard: React.FC<{ project: VideoProject }> = ({ project }) => (
        <div onClick={() => onSelectItem('videoProjects', project)} className="bg-slate-800 p-2 rounded-md border border-slate-700 hover:border-cyan-500 cursor-pointer">
            <p className="text-sm font-semibold text-slate-200">{project.name}</p>
            <p className="text-xs text-slate-400">{project.status}</p>
        </div>
    );

    if (projects.length === 0) {
        return <p className="text-center text-slate-500 p-8">No hay vídeos planificados que coincidan con los filtros.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {weeklyData.map(week => {
                    if (week.toFinish.length === 0 && week.toPublish.length === 0) return null;
                    return (
                        <div key={`${week.year}-${week.weekNumber}`}>
                            <h3 className="text-lg font-bold text-slate-300 border-b-2 border-slate-700 pb-2 mb-3">
                                Semana {week.weekNumber} <span className="text-sm font-normal text-slate-400">({week.startDate.toLocaleDateString()})</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-blue-300 mb-2">A Finalizar</h4>
                                    <div className="space-y-2">
                                        {week.toFinish.map(p => <ProjectCard key={p.id} project={p} />)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-300 mb-2">A Publicar</h4>
                                    <div className="space-y-2">
                                        {week.toPublish.map(p => <ProjectCard key={p.id} project={p} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="lg:col-span-1">
                <KPIsPanel projects={projects} />
            </div>
        </div>
    );
};


// --- END HELPER FUNCTIONS & COMPONENTS ---

export const VideoStudioDashboard: React.FC<VideoStudioDashboardProps> = ({ appData, onSelectItem, onSaveProject }) => {
  const [modalState, setModalState] = useState<{ open: boolean; isBlank: boolean }>({ open: false, isBlank: false });
  const [view, setView] = useState<'calendar' | 'list' | 'weekly'>('calendar');
  const [filters, setFilters] = useState<{ productId: string, tags: string[], status: string, startDate: string, endDate: string }>({ productId: '', tags: [], status: '', startDate: '', endDate: '' });

  const allTags = useMemo(() => {
      const tagSet = new Set<string>();
      appData.videoProjects.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
      return Array.from(tagSet);
  }, [appData.videoProjects]);

  const filteredProjects = useMemo(() => {
      return appData.videoProjects.filter(p => {
          const productMatch = !filters.productId || p.productId === Number(filters.productId);
          const tagsMatch = filters.tags.length === 0 || filters.tags.every(t => p.tags?.includes(t));
          const statusMatch = !filters.status || p.status === filters.status;
          const startDateMatch = !filters.startDate || (p.plannedPublicationDate && p.plannedPublicationDate >= filters.startDate);
          const endDateMatch = !filters.endDate || (p.plannedPublicationDate && p.plannedPublicationDate <= filters.endDate);
          return productMatch && tagsMatch && statusMatch && startDateMatch && endDateMatch;
      }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [appData.videoProjects, filters]);

  const handleCreateProject = (compositionTemplateId: number | undefined, productId: number | undefined, projectName: string) => {
      const now = new Date().toISOString();
      const newProject: VideoProject = {
          id: 'new',
          name: projectName,
          productId,
          compositionTemplateId,
          status: 'Planificación',
          sequences: [],
          globalSettings: { useSubtitles: true },
          createdAt: now,
          updatedAt: now,
      };
      onSaveProject('videoProjects', newProject);
      setModalState({ open: false, isBlank: false });
  };

  return (
    <div className="bg-slate-800 rounded-lg">
      {modalState.open && (
        <CreateProjectFromTemplateModal
            appData={appData}
            onClose={() => setModalState({ open: false, isBlank: false })}
            onCreate={handleCreateProject}
            initialBlank={modalState.isBlank}
        />
      )}
      <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-200">Estudio de Vídeo</h1>
            <p className="text-sm text-slate-400 mt-1">Planifica, produce y gestiona todos tus activos de vídeo.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setModalState({ open: true, isBlank: true })}
                className="flex items-center px-4 py-2 bg-slate-600 text-slate-200 font-semibold rounded-md hover:bg-slate-500"
            >
                <Icon name="file" className="mr-2" />
                Nuevo Proyecto en Blanco
            </button>
            <button
                onClick={() => setModalState({ open: true, isBlank: false })}
                className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600"
            >
                <Icon name="plus" className="mr-2" />
                Nuevo desde Plantilla
            </button>
        </div>
      </div>
       <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
            <div className="bg-slate-900/50 p-1 rounded-lg flex space-x-1">
                <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'calendar' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Calendario</button>
                <button onClick={() => setView('list')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Lista</button>
                <button onClick={() => setView('weekly')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'weekly' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Planificación Semanal</button>
            </div>
        </div>

        {view !== 'weekly' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Select value={filters.status} onChange={e => setFilters(p => ({...p, status: e.target.value}))}>
                    <option value="">Filtrar por estado...</option>
                    {['Planificación', 'Storyboard', 'Revisión', 'Acabado', 'Publicado'].map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select value={filters.productId} onChange={e => setFilters(p => ({...p, productId: e.target.value}))}>
                    <option value="">Filtrar por producto...</option>
                    {appData.products.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
                </Select>
                <TextInput type="date" value={filters.startDate} onChange={e => setFilters(p => ({...p, startDate: e.target.value}))}/>
                <TextInput type="date" value={filters.endDate} onChange={e => setFilters(p => ({...p, endDate: e.target.value}))}/>
                 <div className="lg:col-span-4">
                    <KeywordManager keywords={filters.tags} onChange={tags => setFilters(p => ({...p, tags}))}/>
                </div>
            </div>
        )}

        {view === 'calendar' && <CalendarView projects={filteredProjects} onSelectItem={onSelectItem} />}
        {view === 'list' && <ListView projects={filteredProjects} appData={appData} onSelectItem={onSelectItem} />}
        {view === 'weekly' && <WeeklyPlanningView projects={appData.videoProjects} onSelectItem={onSelectItem} />}
      </div>
    </div>
  );
};