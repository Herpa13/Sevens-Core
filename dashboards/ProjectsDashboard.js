"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsDashboard = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = require("../components/common/Icon");
const ProjectCard = ({ project, tasks, owner, onClick }) => {
    const projectTasks = tasks.filter(t => t.linkedEntity?.entityType === 'proyectos' && t.linkedEntity.entityId === project.id);
    const completedTasks = projectTasks.filter(t => t.status === 'Completada').length;
    const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
    const now = new Date();
    const overdueTasks = projectTasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completada').length;
    return (<div onClick={onClick} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-cyan-500 cursor-pointer flex flex-col justify-between h-full">
            <div>
                <h3 className="font-bold text-slate-200 truncate">{project.name}</h3>
                <p className="text-xs text-slate-400">Iniciado por: {owner?.name || 'Desconocido'}</p>
                 <span className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'Activo' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                    {project.status}
                </span>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                    <span>{projectTasks.length} Tareas Totales</span>
                    {overdueTasks > 0 && (<span className="text-red-400 font-semibold">{overdueTasks} Atrasadas</span>)}
                </div>
            </div>
        </div>);
};
const ProjectsDashboard = ({ appData, onSelectItem }) => {
    const { proyectos, tasks, users } = appData;
    return (<div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-200">Centro de Mando de Proyectos</h1>
        <p className="text-sm text-slate-400 mt-1">Sigue el progreso de todas las iniciativas y flujos de trabajo.</p>
      </div>
      <div className="p-4 sm:p-6">
        {proyectos.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {proyectos.map(project => (<ProjectCard key={project.id} project={project} tasks={tasks} owner={users.find(u => u.id === project.ownerId)} onClick={() => onSelectItem('proyectos', project)}/>))}
             </div>) : (<div className="text-center p-12 text-slate-500">
                <Icon_1.Icon name="folder-open" className="text-4xl mb-4"/>
                <p>No se ha iniciado ningún proyecto todavía.</p>
                <p className="text-xs mt-2">Puedes iniciar uno desde el dashboard de Tareas usando un esquema de "Proyecto Independiente".</p>
            </div>)}
      </div>
    </div>);
};
exports.ProjectsDashboard = ProjectsDashboard;
