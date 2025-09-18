"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskBoardDashboard = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const Select_1 = require("../components/common/Select");
const StartProjectModal_1 = require("../components/modals/StartProjectModal");
const TASK_STATUSES = ['Pendiente', 'En Proceso', 'En Revisión', 'Bloqueada', 'Completada'];
const TASK_PRIORITIES = ['Baja', 'Media', 'Alta', 'Urgente'];
const priorityConfig = {
    'Baja': { color: 'text-slate-400', icon: 'arrow-down' },
    'Media': { color: 'text-blue-400', icon: 'equals' },
    'Alta': { color: 'text-yellow-400', icon: 'arrow-up' },
    'Urgente': { color: 'text-red-500', icon: 'exclamation-circle' },
};
const TaskCard = ({ task, appData, onClick, onSaveSubtask, onDragStart }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const assignee = appData.users.find(u => u.id === task.assigneeId);
    const priority = priorityConfig[task.priority];
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completada';
    const subtasks = (0, react_1.useMemo)(() => appData.subtasks.filter(s => s.taskId === task.id), [appData.subtasks, task.id]);
    const completedSubtasks = (0, react_1.useMemo)(() => subtasks.filter(s => s.isCompleted).length, [subtasks]);
    const blockingTasks = (0, react_1.useMemo)(() => {
        return (task.isBlockedBy || [])
            .map(id => appData.tasks.find(t => t.id === id))
            .filter((t) => !!t && t.status !== 'Completada');
    }, [task.isBlockedBy, appData.tasks]);
    const isBlocked = blockingTasks.length > 0;
    return (<div draggable={!isBlocked} onDragStart={(e) => onDragStart(e, task.id)} className={`bg-slate-800 p-3 rounded-md border border-slate-700 shadow-sm space-y-2 ${isBlocked ? 'cursor-not-allowed opacity-70' : 'hover:border-cyan-500 cursor-grab active:cursor-grabbing'}`}>
            <div className="flex justify-between items-start">
                <p onClick={onClick} className="font-semibold text-sm text-slate-200 cursor-pointer flex-grow">{task.name}</p>
                 <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                    {isBlocked && <Icon_1.Icon name="lock" className="text-yellow-400" title={`Bloqueada por: ${blockingTasks.map(t => t.name).join(', ')}`}/>}
                    {task.linkedEntity ? (<span title={`Vinculado a: ${task.linkedEntity.entityName}`} className="text-slate-500">
                            {task.linkedEntity.entityType === 'proyectos' ? <Icon_1.Icon name="project-diagram"/> : <Icon_1.Icon name="link"/>}
                        </span>) : (<span title="Tarea sin vincular" className="text-slate-500"><Icon_1.Icon name="tasks"/></span>)}
                </div>
            </div>
            
            {subtasks.length > 0 && (<div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Subtareas: {completedSubtasks}/{subtasks.length}</span>
                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="text-slate-500 hover:text-cyan-400">
                           <Icon_1.Icon name={isExpanded ? 'chevron-up' : 'chevron-down'}/>
                        </button>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                        <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}></div>
                    </div>
                    {isExpanded && (<div className="mt-2 space-y-1 pr-1 max-h-32 overflow-y-auto">
                            {subtasks.map(st => (<div key={st.id} className="flex items-center space-x-2 p-1 rounded-md hover:bg-slate-700/50">
                                     <input type="checkbox" checked={st.isCompleted} onChange={(e) => onSaveSubtask({ ...st, isCompleted: e.target.checked })} className="h-3 w-3 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900"/>
                                    <span className={`text-xs ${st.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                        {st.name}
                                    </span>
                                </div>))}
                        </div>)}
                </div>)}

            <div className="flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                    <span title={priority.icon} className={priority.color}><Icon_1.Icon name={priority.icon}/></span>
                    {task.dueDate && (<span className={`flex items-center ${isOverdue ? 'text-red-400 font-bold' : ''}`}>
                            <Icon_1.Icon name="calendar-alt" className="mr-1"/> {new Date(task.dueDate).toLocaleDateString()}
                        </span>)}
                </div>
                {assignee && (<div title={assignee.name} className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-200 ring-2 ring-slate-800">
                        {assignee.name.charAt(0)}
                    </div>)}
            </div>
        </div>);
};
const TeamMemberCard = ({ user, tasks, appData, onSaveSubtask, onSelectItem }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const userTasks = tasks.filter(t => t.assigneeId === user.id);
    const now = new Date();
    const stats = (0, react_1.useMemo)(() => {
        const result = {
            'Pendiente': 0, 'En Proceso': 0, 'En Revisión': 0, 'Bloqueada': 0, 'Completada': 0,
            'Atrasadas': 0, 'Total': userTasks.length,
        };
        userTasks.forEach(task => {
            result[task.status]++;
            if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Completada') {
                result['Atrasadas']++;
            }
        });
        return result;
    }, [userTasks]);
    return (<div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div onClick={() => setIsExpanded(!isExpanded)} className="flex items-center mb-3 cursor-pointer">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">
                    {user.name.charAt(0)}
                </div>
                <h3 className="ml-3 font-bold text-slate-200 flex-grow">{user.name}</h3>
                <Icon_1.Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} className="text-slate-400"/>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <span><Icon_1.Icon name="tasks" className="mr-2 text-slate-400"/>Total: <strong>{stats.Total}</strong></span>
                <span className={stats.Atrasadas > 0 ? 'text-red-400' : ''}>
                    <Icon_1.Icon name="calendar-times" className="mr-2"/>Atrasadas: <strong>{stats.Atrasadas}</strong>
                </span>
                <span><Icon_1.Icon name="hourglass-start" className="mr-2 text-slate-400"/>Pendientes: <strong>{stats.Pendiente}</strong></span>
                <span><Icon_1.Icon name="cogs" className="mr-2 text-slate-400"/>En Proceso: <strong>{stats['En Proceso']}</strong></span>
            </div>
            {isExpanded && (<div className="mt-4 border-t border-slate-700 pt-3 space-y-2">
                    {userTasks.map(task => (<TaskCard key={task.id} task={task} appData={appData} onClick={() => onSelectItem('tasks', task)} onSaveSubtask={onSaveSubtask} onDragStart={() => { }}/>))}
                </div>)}
        </div>);
};
const TaskBoardDashboard = ({ appData, onSelectItem, onAddNew, currentUser, onSaveSubtask, onStartProject, onTaskUpdate = () => { }, isProjectView = false }) => {
    const [filters, setFilters] = (0, react_1.useState)({ assigneeId: '', priority: '' });
    const [myTasksOnly, setMyTasksOnly] = (0, react_1.useState)(false);
    const [view, setView] = (0, react_1.useState)('kanban');
    const [isProjectModalOpen, setIsProjectModalOpen] = (0, react_1.useState)(false);
    const [draggedTaskId, setDraggedTaskId] = (0, react_1.useState)(null);
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const filteredTasks = (0, react_1.useMemo)(() => {
        return appData.tasks.filter(task => {
            const assigneeMatch = !filters.assigneeId || task.assigneeId === Number(filters.assigneeId);
            const priorityMatch = !filters.priority || task.priority === filters.priority;
            const myTasksMatch = !myTasksOnly || task.assigneeId === currentUser.id;
            return assigneeMatch && priorityMatch && myTasksMatch;
        });
    }, [appData.tasks, filters, myTasksOnly, currentUser.id]);
    const tasksByStatus = (0, react_1.useMemo)(() => {
        const grouped = { 'Pendiente': [], 'En Proceso': [], 'En Revisión': [], 'Bloqueada': [], 'Completada': [] };
        filteredTasks.forEach(task => { if (grouped[task.status])
            grouped[task.status].push(task); });
        return grouped;
    }, [filteredTasks]);
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
    };
    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedTaskId) {
            const task = appData.tasks.find(t => t.id === draggedTaskId);
            const blockingTasks = (task?.isBlockedBy || [])
                .map(id => appData.tasks.find(t => t.id === id))
                .filter(t => t && t.status !== 'Completada');
            if (newStatus === 'Completada' && blockingTasks.length > 0) {
                alert(`No se puede completar la tarea. Sigue bloqueada por: ${blockingTasks.map(t => t?.name).join(', ')}`);
            }
            else {
                onTaskUpdate(draggedTaskId, { status: newStatus });
            }
        }
        setDraggedTaskId(null);
        e.currentTarget.classList.remove('bg-cyan-500/10');
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-cyan-500/10');
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-cyan-500/10');
    };
    const canSeeTeamView = currentUser.role === 'Administrador' || currentUser.role === 'Nivel 2';
    return (<div className="h-full flex flex-col">
      {isProjectModalOpen && (<StartProjectModal_1.StartProjectModal schemas={appData.taskSchemas.filter(s => s.trigger.type === 'manual')} onStart={onStartProject} onClose={() => setIsProjectModalOpen(false)}/>)}
      {!isProjectView && (<>
            <div className="flex-shrink-0 flex flex-wrap justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Tablero de Tareas</h1>
                    <p className="text-sm text-slate-400">Organiza y sigue el trabajo de tu equipo.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600">
                        <Icon_1.Icon name="rocket" className="mr-2"/>
                        Iniciar Proyecto
                    </button>
                    <button onClick={() => onAddNew('tasks')} className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600">
                        <Icon_1.Icon name="plus" className="mr-2"/> Nueva Tarea
                    </button>
                </div>
            </div>
            
            <div className="flex-shrink-0 flex flex-wrap justify-between items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <button onClick={() => setMyTasksOnly(p => !p)} className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center ${myTasksOnly ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                        <Icon_1.Icon name="user" className="mr-2"/>Mis Tareas
                    </button>
                    <Select_1.Select name="assigneeId" value={filters.assigneeId} onChange={handleFilterChange} className="w-40" disabled={myTasksOnly}>
                        <option value="">Todos los Asignados</option>
                        {appData.users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </Select_1.Select>
                    <Select_1.Select name="priority" value={filters.priority} onChange={handleFilterChange} className="w-40">
                        <option value="">Todas las Prioridades</option>
                        {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select_1.Select>
                </div>
                {canSeeTeamView && (<div className="bg-slate-800 p-1 rounded-lg flex space-x-1">
                        <button onClick={() => setView('kanban')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'kanban' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Vista Kanban</button>
                        <button onClick={() => setView('team')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'team' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Vista de Equipo</button>
                    </div>)}
            </div>
        </>)}

      {view === 'kanban' || isProjectView ? (<div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
            {TASK_STATUSES.map(status => (<div key={status} onDrop={(e) => handleDrop(e, status)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="bg-slate-800 rounded-lg flex flex-col h-full transition-colors">
                <h3 className="text-md font-semibold text-slate-300 p-3 border-b border-slate-700 flex-shrink-0">
                {status} <span className="text-sm text-slate-500 font-normal">({tasksByStatus[status].length})</span>
                </h3>
                <div className="p-2 space-y-2 overflow-y-auto flex-grow">
                {tasksByStatus[status].map(task => (<TaskCard key={task.id} task={task} appData={appData} onClick={() => onSelectItem('tasks', task)} onSaveSubtask={onSaveSubtask} onDragStart={handleDragStart}/>))}
                </div>
            </div>))}
        </div>) : (<div className="flex-grow overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appData.users.map(user => (<TeamMemberCard key={user.id} user={user} tasks={appData.tasks} appData={appData} onSaveSubtask={onSaveSubtask} onSelectItem={onSelectItem}/>))}
            </div>
        </div>)}
    </div>);
};
exports.TaskBoardDashboard = TaskBoardDashboard;
