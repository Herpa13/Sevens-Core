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
exports.ProductNotificationListView = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const statusConfig = {
    'Pendiente': { color: 'yellow', icon: 'hourglass-start' },
    'En proceso': { color: 'blue', icon: 'cogs' },
    'Notificado': { color: 'green', icon: 'check-circle' },
    'No necesario': { color: 'gray', icon: 'minus-circle' },
    'Espera de decision': { color: 'purple', icon: 'pause-circle' },
    // FIX: Add missing properties to statusConfig to match the ProductNotification['status'] type.
    'No Notificable': { color: 'gray', icon: 'ban' },
    'Pendiente nueva notificación': { color: 'yellow', icon: 'sync-alt' }
};
const colorVariants = {
    yellowBg: 'bg-yellow-500/10 text-yellow-300',
    blueBg: 'bg-blue-500/10 text-blue-300',
    greenBg: 'bg-green-500/10 text-green-300',
    grayBg: 'bg-slate-500/20 text-slate-400',
    purpleBg: 'bg-purple-500/10 text-purple-300',
};
const ProductNotificationListView = ({ notifications, products, countries, onSelectItem, onAddNew }) => {
    const [grouping, setGrouping] = (0, react_1.useState)('flat');
    const getProductName = (id) => products.find(p => p.id === id)?.name || `ID: ${id}`;
    const enrichedNotifications = (0, react_1.useMemo)(() => {
        return notifications.map(n => {
            const country = countries.find(c => c.id === n.countryId);
            return {
                ...n,
                productName: getProductName(n.productId),
                country,
            };
        }).sort((a, b) => a.productName.localeCompare(b.productName) || (a.country?.name || '').localeCompare(b.country?.name || ''));
    }, [notifications, products, countries]);
    const groupedData = (0, react_1.useMemo)(() => {
        if (grouping === 'flat') {
            return { 'Todas las Notificaciones': enrichedNotifications };
        }
        const groups = {};
        enrichedNotifications.forEach(n => {
            const key = grouping === 'product' ? n.productName : n.country?.name || 'Sin País';
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(n);
        });
        return groups;
    }, [grouping, enrichedNotifications]);
    const renderTableRows = (items) => {
        return items.map(item => {
            const config = statusConfig[item.status];
            return (<tr key={item.id} className="hover:bg-slate-700/50 cursor-pointer" onClick={() => onSelectItem('productNotifications', item)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {item.country ? (<span className="inline-flex items-center bg-slate-700 text-slate-200 text-sm font-medium px-2.5 py-1 rounded-full">
                            <img src={`https://flagcdn.com/w20/${item.country.iso.toLowerCase()}.png`} alt={item.country.name} className="w-4 h-auto mr-2"/>
                            {item.country.name}
                        </span>) : (`ID: ${item.countryId}`)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorVariants[(config.color + 'Bg')]}`}>
                        <Icon_1.Icon name={config.icon} className="mr-1.5"/>
                        {item.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.notifiedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.agencyName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.notificationDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{(item.costAgencyFee || 0) + (item.costGovernmentFee || 0)} €</td>
            </tr>);
        });
    };
    const GroupingButton = ({ label, value, current, onClick }) => (<button onClick={() => onClick(value)} className={`px-3 py-1.5 text-sm font-medium rounded-md ${current === value
            ? 'bg-cyan-500 text-slate-900'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
      {label}
    </button>);
    return (<div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-200">Gestión de Notificaciones</h1>
                <div className="flex items-center space-x-2 mt-2">
                    <GroupingButton label="Lista Plana" value="flat" current={grouping} onClick={setGrouping}/>
                    <GroupingButton label="Agrupar por Producto" value="product" current={grouping} onClick={setGrouping}/>
                    <GroupingButton label="Agrupar por País" value="country" current={grouping} onClick={setGrouping}/>
                </div>
            </div>
            <button onClick={() => onAddNew('productNotifications')} className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500">
                <Icon_1.Icon name="plus" className="mr-2"/>
                Añadir Notificación
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">País</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Notificado Por</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Agencia</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fecha Notificación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Coste Total</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {Object.entries(groupedData).map(([groupName, items]) => (<react_1.default.Fragment key={groupName}>
                        {grouping !== 'flat' && (<tr className="bg-slate-700/70">
                                <td colSpan={7} className="px-4 py-2 text-sm font-bold text-slate-300">
                                    {groupName} <span className="text-xs font-normal text-slate-400">({items.length} notificaciones)</span>
                                </td>
                            </tr>)}
                        {renderTableRows(items)}
                      </react_1.default.Fragment>))}
                </tbody>
            </table>
        </div>
         {notifications.length === 0 && (<div className="text-center p-12 text-slate-500">
                <Icon_1.Icon name="folder-open" className="text-4xl mb-4"/>
                <p>No hay notificaciones para mostrar.</p>
            </div>)}
    </div>);
};
exports.ProductNotificationListView = ProductNotificationListView;
