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
exports.ReportsDashboard = void 0;
const react_1 = __importStar(require("react"));
const recharts_1 = require("recharts");
const Icon_1 = require("../components/common/Icon");
const TasksByStatusWidget = ({ tasks }) => {
    const data = (0, react_1.useMemo)(() => {
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [tasks]);
    const COLORS = {
        'Pendiente': '#f59e0b', // amber-500
        'En Proceso': '#3b82f6', // blue-500
        'En Revisión': '#8b5cf6', // violet-500
        'Bloqueada': '#ef4444', // red-500
        'Completada': '#22c55e', // green-500
    };
    return (<div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Tareas por Estado</h3>
            {tasks.length > 0 ? (<recharts_1.ResponsiveContainer width="100%" height="100%">
                    <recharts_1.PieChart>
                        <recharts_1.Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                            {data.map((entry) => (<recharts_1.Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]}/>))}
                        </recharts_1.Pie>
                        <recharts_1.Tooltip contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(4px)',
            }}/>
                        <recharts_1.Legend />
                    </recharts_1.PieChart>
                </recharts_1.ResponsiveContainer>) : (<div className="flex-grow flex flex-col items-center justify-center text-slate-500">
                    <Icon_1.Icon name="folder-open" className="text-4xl mb-2"/>
                    <span>No hay tareas para mostrar.</span>
                </div>)}
        </div>);
};
const ReportsDashboard = ({ appData }) => {
    return (<div>
            <h1 className="text-2xl font-bold text-slate-200 mb-6">Dashboard de Informes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TasksByStatusWidget tasks={appData.tasks}/>
                {/* Future widgets will be added here */}
            </div>
        </div>);
};
exports.ReportsDashboard = ReportsDashboard;
