import React, { FC, useState, useEffect } from 'react';
// FIX: Import Entity and EntityType from their canonical source in `types/index.ts`.
import type { AppData, User, KnowledgeBaseEntry, EntityType, Entity } from '../../types/index';
import { Icon } from '../common/Icon';
import { hasPermission } from '../../utils/authUtils';

type DashboardType = 'notifications' | 'contentMaturity' | 'importExport' | 'pvprMatrix' | 'tasks' | 'proyectos' | 'videoStudio' | 'pricesByPlatform' | 'priceHistoryLogs' | 'pricingDashboard' | 'amazonFlashDeals' | 'reports';
type SpecialViewType = 'aiSettings';

interface SidebarProps {
  appData: AppData;
  setActiveView: (view: { type: 'list', entityType: EntityType } | { type: 'dashboard', entityType: DashboardType } | { type: 'aiSettings' } | { type: 'detail', entityType: EntityType, entity: Entity }) => void;
  activeEntityType?: EntityType | DashboardType | SpecialViewType;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentUser: User | null;
  onLogout: () => void;
  onBackupData: () => void;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
}

const NavLink: FC<{ icon: string; label: string; count?: number; isActive: boolean; onClick: () => void; collapsed: boolean; isChild?: boolean; }> = 
({ icon, label, count, isActive, onClick, collapsed, isChild = false }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className={`flex items-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 group ${ isChild ? 'py-2' : ''} ${
            isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        <Icon name={icon} className={`w-5 h-5 mr-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'}`} />
        {!collapsed && (
            <>
                <span className="flex-1">{label}</span>
                {typeof count !== 'undefined' && (
                    <span className={`px-2 py-0.5 ml-auto text-xs font-semibold rounded-full ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-300'}`}>
                        {count}
                    </span>
                )}
            </>
        )}
    </a>
);

const NavGroup: FC<{ icon: string; label: string; isActive: boolean; isOpen: boolean; onToggle: () => void; collapsed: boolean; children: React.ReactNode; }> =
({ icon, label, isActive, isOpen, onToggle, collapsed, children }) => {
    return (
        <div>
            <button
                onClick={onToggle}
                className={`w-full flex items-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 group ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
                 <Icon name={icon} className={`w-5 h-5 mr-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'}`} />
                 {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{label}</span>
                        <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                    </>
                 )}
            </button>
            {isOpen && !collapsed && (
                <div className="pl-6 border-l border-slate-700 ml-6 my-1">
                    {children}
                </div>
            )}
        </div>
    )
}


const CompanyLogo: FC = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-white">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M84 43 L65 49 L58 35 L30 15 L16 43 L33 49 L38 60 L22 65 L45 90 L68 70 L50 65 L62 56 L58 42 L40 46 L36 43 M65 49 L58 42 M58 35 L65 49 M30 15 L58 35 M30 15 L33 49 M16 43 L33 49 M33 49 L38 60 M38 60 L68 70 M50 65 L62 56 M36 43 L58 42 M36 43 L33 49 M58 42 L65 49 M38 60 L50 65" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
);


export const Sidebar: FC<SidebarProps> = ({ appData, setActiveView, activeEntityType, collapsed, setCollapsed, currentUser, onLogout, onBackupData, onSelectItem }) => {
    
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        marketTracker: true,
        ai: true,
        pricing: true,
        automation: true,
        videoStudio: true,
        videoTemplates: true,
    });
    
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const getWeekNumber = (d: Date): number => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return weekNo;
    }

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(currentDate);

    const formattedTime = new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(currentDate);

    const weekNum = getWeekNumber(currentDate);


    const toggleGroup = (key: string) => {
        setOpenGroups(prev => ({...prev, [key]: !prev[key]}));
    };
    
    const handleShowHelp = () => {
        const helpGuide = appData.knowledgeBaseEntries.find(
            entry => entry.title === "Guía de Inicio Rápido para el Responsable de Contenidos"
        );
        if (helpGuide) {
            onSelectItem('knowledgeBaseEntries', helpGuide as Entity);
        } else {
            alert("No se encontró la guía de inicio rápido.");
        }
    };

    const managementItems = [
        { key: 'products', label: 'Productos', icon: 'box-open', count: appData.products.length },
        { key: 'knowledgeBaseEntries', label: 'Base de Conocimiento', icon: 'book', count: appData.knowledgeBaseEntries.length },
        {
            key: 'automationGroup',
            label: 'Automatización',
            icon: 'cogs',
            children: [
                { key: 'contentRecipes', label: 'Recetas de Contenido', icon: 'blender', count: appData.contentRecipes.length, type: 'list' },
                { key: 'taskSchemas', label: 'Esquemas de Trabajo', icon: 'drafting-compass', count: appData.taskSchemas.length, type: 'list' },
            ]
        },
        {
            key: 'aiGroup',
            label: 'Inteligencia Artificial',
            icon: 'wand-magic-sparkles',
            children: [
                { key: 'promptTemplates', label: 'Plantillas de IA', icon: 'robot', count: appData.promptTemplates.length, type: 'list' },
                { key: 'aiSettings', label: 'Ajustes de IA', icon: 'cogs', type: 'special' },
            ]
        },
        {
            key: 'pricingGroup',
            label: 'Estrategias de Precios',
            icon: 'dollar-sign',
            children: [
                { key: 'pricingDashboard', label: 'Dashboard de Precios', icon: 'chart-area', type: 'dashboard'},
                { key: 'amazonFlashDeals', label: 'Ofertas Flash', icon: 'bolt', type: 'dashboard'},
                { key: 'pvprMatrix', label: 'Matriz de PVPR', icon: 'table', type: 'dashboard'},
                { key: 'pricesByPlatform', label: 'Precios por Plataforma', icon: 'tags', type: 'dashboard'},
                { key: 'pricingRules', label: 'Reglas de Precios', icon: 'gavel', count: appData.pricingRules.length, type: 'list' },
                { key: 'priceHistoryLogs', label: 'Historial de Precios', icon: 'history', type: 'dashboard'},
            ]
        },
        {
            key: 'marketTracker',
            label: 'Market Tracker',
            icon: 'chart-line',
            children: [
                { key: 'competitorProducts', label: 'Productos Comp.', icon: 'users-viewfinder', count: appData.competitorProducts.length, type: 'list' },
                { key: 'competitorBrands', label: 'Marcas Comp.', icon: 'copyright', count: appData.competitorBrands.length, type: 'list' },
            ],
        },
        { key: 'countries', label: 'Países', icon: 'globe', count: appData.countries.length },
        { key: 'platforms', label: 'Plataformas', icon: 'store', count: appData.platforms.length },
        { key: 'videos', label: 'Videos', icon: 'video', count: appData.videos.length },
        { key: 'etiquetas', label: 'Etiquetas', icon: 'tags', count: appData.etiquetas.length },
        { key: 'envases', label: 'Envases', icon: 'box', count: appData.envases.length },
        { key: 'ingredients', label: 'Ingredientes', icon: 'flask-vial', count: appData.ingredients.length },
        { key: 'productNotifications', label: 'Gestión Notificaciones', icon: 'clipboard-check', count: appData.productNotifications.length },
        { key: 'notes', label: 'Notas', icon: 'note-sticky', count: appData.notes.length },
        { key: 'logs', label: 'Registro de Actividad', icon: 'history', count: appData.logs.length },
        { key: 'translationTerms', label: 'Términos Traducción', icon: 'language', count: appData.translationTerms.length },
        { key: 'tickets', label: 'Atención Cliente', icon: 'headset', count: appData.tickets.length },
        { key: 'users', label: 'Gestión de Usuarios', icon: 'users-cog', count: appData.users.length },
    ];
    
    const dashboardItems = [
        { key: 'tasks' as const, label: 'Tareas', icon: 'tasks' },
        { key: 'proyectos' as const, label: 'Proyectos', icon: 'project-diagram' },
        {
            key: 'videoStudio' as const,
            label: 'Estudio de Vídeo',
            icon: 'film',
            isGroup: true,
            children: [
                { key: 'videoStudio', label: 'Proyectos de Vídeo', icon: 'video', type: 'dashboard' },
                { key: 'mediaAssets', label: 'Biblioteca de Medios', icon: 'images', count: appData.mediaAssets.length, type: 'list' },
                { 
                    key: 'videoTemplates', 
                    label: 'Plantillas', 
                    icon: 'drafting-compass', 
                    isGroup: true,
                    children: [
                         { key: 'videoCompositionTemplates', label: 'Plantillas de Vídeo', icon: 'photo-video', count: appData.videoCompositionTemplates.length, type: 'list' },
                         { key: 'sequenceTemplates', label: 'Plantillas de Secuencia', icon: 'puzzle-piece', count: appData.sequenceTemplates.length, type: 'list' },
                    ]
                },
            ]
        },
        { key: 'reports' as const, label: 'Informes', icon: 'chart-pie' },
        { key: 'notifications' as const, label: 'Notificaciones', icon: 'bell' },
        { key: 'contentMaturity' as const, label: 'Matriz de Contenido', icon: 'tasks' },
        { key: 'importExport' as const, label: 'Centro de Publicación', icon: 'exchange-alt' },
    ];

    const visibleDashboardItems = dashboardItems.filter(item => {
        if (item.isGroup) {
            // A group is visible if any of its children are visible
            return item.children.some(child => {
                 if ((child as any).isGroup) {
                    return (child as any).children.some((subChild: any) => currentUser && hasPermission(currentUser, subChild.key))
                 }
                 return currentUser && hasPermission(currentUser, child.key)
            });
        }
        return currentUser && hasPermission(currentUser, item.key)
    });
    
    const visibleManagementItems = managementItems
        .map(item => {
            if (item.children) {
                const visibleChildren = item.children.filter(child =>
                    currentUser && hasPermission(currentUser, child.key)
                );
                if (visibleChildren.length > 0) {
                    return { ...item, children: visibleChildren };
                }
                return null;
            }
            return currentUser && hasPermission(currentUser, item.key) ? item : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
        
    const renderNavGroup = (item: any) => {
        const isGroupActive = item.children.some((child: any) => {
             if (child.isGroup) {
                return child.children.some((subChild: any) => subChild.key === activeEntityType);
             }
             return child.key === activeEntityType;
        });
        
        return (
             <NavGroup
                key={item.key}
                icon={item.icon}
                label={item.label}
                isActive={isGroupActive}
                isOpen={openGroups[item.key as keyof typeof openGroups] || false}
                onToggle={() => toggleGroup(item.key)}
                collapsed={collapsed}
            >
                {item.children.map((child: any) => {
                    if (child.isGroup) {
                        return renderNavGroup(child); // Recursive call for nested groups
                    }
                     let clickHandler;
                    switch(child.type) {
                        case 'dashboard':
                            clickHandler = () => setActiveView({ type: 'dashboard', entityType: child.key as DashboardType });
                            break;
                        case 'list':
                             clickHandler = () => setActiveView({ type: 'list', entityType: child.key as any });
                             break;
                        case 'special':
                             clickHandler = () => setActiveView({ type: 'aiSettings' });
                             break;
                        default:
                            clickHandler = () => setActiveView({ type: 'list', entityType: child.key as any });
                    }

                    return (
                        <NavLink
                            key={child.key}
                            icon={child.icon}
                            label={child.label}
                            count={child.count}
                            isActive={activeEntityType === child.key}
                            onClick={clickHandler}
                            collapsed={collapsed}
                            isChild
                        />
                    );
                })}
            </NavGroup>
        );
    };

    return (
        <aside className={`fixed top-0 left-0 h-full bg-slate-800 text-white flex flex-col transition-all duration-300 border-r border-slate-700 ${collapsed ? 'w-16' : 'w-64'}`}>
             <div className={`flex items-center h-16 p-4 border-b border-slate-700 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                     <div className="flex items-center space-x-3">
                        <CompanyLogo />
                        <span className="text-xl font-bold text-slate-200">PIM</span>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md text-slate-400 hover:bg-slate-700">
                   <Icon name={collapsed ? 'arrow-right' : 'arrow-left'} />
                </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                <div className={`px-4 pt-2 pb-4 border-b border-slate-700 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
                    <p className="font-bold text-slate-200 text-center">{formattedTime}</p>
                    <p className="text-xs text-slate-400 text-center capitalize">{formattedDate}</p>
                    <p className="text-xs text-slate-400 text-center font-semibold mt-1">Semana {weekNum}</p>
                </div>
                <div className="mb-4">
                    <h3 className={`px-4 mb-2 text-xs font-semibold uppercase text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>Dashboards</h3>
                     {visibleDashboardItems.map(item => {
                         if (item.isGroup) {
                            return renderNavGroup(item);
                         }
                         return (
                            <NavLink
                                key={item.key}
                                icon={item.icon}
                                label={item.label}
                                isActive={activeEntityType === item.key}
                                onClick={() => setActiveView({ type: 'dashboard', entityType: item.key })}
                                collapsed={collapsed}
                            />
                        )
                    })}
                </div>
                <div>
                     <h3 className={`px-4 mb-2 text-xs font-semibold uppercase text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>Gestión</h3>
                    {visibleManagementItems.map(item => {
                        if (item.children) {
                           return renderNavGroup(item);
                        }
                        return (
                             <NavLink
                                key={item.key}
                                icon={item.icon}
                                label={item.label}
                                count={(item as any).count}
                                isActive={activeEntityType === item.key}
                                onClick={() => setActiveView({ type: 'list', entityType: item.key as EntityType })}
                                collapsed={collapsed}
                            />
                        )
                    })}
                </div>
            </nav>
            <div className={`border-t border-slate-700 p-4 mt-auto ${collapsed ? 'py-4 px-2' : ''}`}>
                {currentUser && (
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                            {currentUser.name.charAt(0)}
                        </div>
                        {!collapsed && (
                            <div className="ml-3 flex-grow min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{currentUser.name}</p>

                                <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
                            </div>
                        )}
                         <div className={`flex items-center ${collapsed ? 'flex-col space-y-2 mt-2' : 'ml-2'}`}>
                            {currentUser.role === 'Administrador' && (
                                <button onClick={onBackupData} title="Backup de Datos" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">
                                    <Icon name="database" />
                                </button>
                            )}
                            <button onClick={handleShowHelp} title="Ayuda y Guía de Uso" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">
                                <Icon name="question-circle" />
                            </button>
                            <button onClick={onLogout} title="Cerrar Sesión" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">
                                <Icon name="sign-out-alt" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};