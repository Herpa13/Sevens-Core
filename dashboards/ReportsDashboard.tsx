import React, { useMemo } from 'react';
import type { AppData, TaskStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Icon } from '../components/common/Icon';

interface ReportsDashboardProps {
  appData: AppData;
}

const TasksByStatusWidget: React.FC<{ tasks: AppData['tasks'] }> = ({ tasks }) => {
    const data = useMemo(() => {
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<TaskStatus, number>);

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [tasks]);

    const COLORS: Record<TaskStatus, string> = {
        'Pendiente': '#f59e0b', // amber-500
        'En Proceso': '#3b82f6', // blue-500
        'En Revisión': '#8b5cf6', // violet-500
        'Bloqueada': '#ef4444', // red-500
        'Completada': '#22c55e', // green-500
    };

    return (
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Tareas por Estado</h3>
            {tasks.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as TaskStatus]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                                borderColor: '#475569',
                                borderRadius: '0.5rem',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-500">
                    <Icon name="folder-open" className="text-4xl mb-2"/>
                    <span>No hay tareas para mostrar.</span>
                </div>
            )}
        </div>
    );
};


export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ appData }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-200 mb-6">Dashboard de Informes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TasksByStatusWidget tasks={appData.tasks} />
                {/* Future widgets will be added here */}
            </div>
        </div>
    );
};