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
exports.ProjectDetailView = void 0;
const react_1 = __importStar(require("react"));
const TaskBoardDashboard_1 = require("../dashboards/TaskBoardDashboard");
const lodash_es_1 = require("lodash-es");
const ProjectDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onTaskUpdate, onSelectItem, setIsDirty, setSaveHandler }) => {
    // For this view, we'll make it read-only for now, focusing on the Kanban board.
    // Editing project details (name, status) can be added later.
    const [data, setData] = (0, react_1.useState)(initialData);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess)
            onSuccess();
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const projectTasks = appData.tasks.filter(t => t.linkedEntity?.entityType === 'proyectos' && t.linkedEntity.entityId === initialData.id);
    const completedTasks = projectTasks.filter(t => t.status === 'Completada').length;
    const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
    const projectAppData = {
        ...appData,
        tasks: projectTasks,
    };
    return (<div className="bg-slate-800 rounded-lg h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">{initialData.name}</h2>
            <p className="text-sm text-slate-400">Gestionando las tareas del proyecto.</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">
              Volver a Proyectos
            </button>
          </div>
        </div>
        <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                <span>Progreso General</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 flex-grow overflow-hidden">
        {/* We reuse the TaskBoardDashboard, passing a projectId to filter its tasks */}
        <TaskBoardDashboard_1.TaskBoardDashboard appData={projectAppData} onSelectItem={onSelectItem} // Navigation is handled by the main app
     onAddNew={() => { }} // New tasks should be created globally for now
     currentUser={appData.users.find(u => u.role === 'Administrador')} // Fake user for now
     onSaveSubtask={() => { }} onTaskUpdate={onTaskUpdate} onStartProject={() => { }} isProjectView={true} // A new prop to hide filters/buttons
    />
      </div>
    </div>);
};
exports.ProjectDetailView = ProjectDetailView;
