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
exports.NotificationsDashboard = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const statusConfig = {
    'Pendiente': { color: 'yellow', icon: 'hourglass-start' },
    'En proceso': { color: 'blue', icon: 'cogs' },
    'Notificado': { color: 'green', icon: 'check-circle' },
    'No necesario': { color: 'gray', icon: 'minus-circle' },
    'Espera de decision': { color: 'purple', icon: 'pause-circle' },
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
const STATUS_OPTIONS = ['Pendiente', 'En proceso', 'Notificado', 'No necesario', 'Espera de decision', 'No Notificable', 'Pendiente nueva notificación'];
const NotificationsDashboard = ({ notifications, products, countries, onStatusChange, onEditDetails }) => {
    const [dropdown, setDropdown] = (0, react_1.useState)({ open: false, productId: null, countryId: null, x: 0, y: 0 });
    const [countryOrder, setCountryOrder] = (0, react_1.useState)(countries.map(c => c.id));
    (0, react_1.useEffect)(() => {
        const handleClickOutside = () => {
            if (dropdown.open) {
                setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdown.open]);
    const orderedCountries = (0, react_1.useMemo)(() => {
        return countryOrder.map(id => countries.find(c => c.id === id)).filter(Boolean);
    }, [countryOrder, countries]);
    const handleDragStart = (e, countryId) => {
        e.dataTransfer.setData('countryId', String(countryId));
    };
    const handleDrop = (e, targetCountryId) => {
        e.preventDefault();
        const draggedCountryId = Number(e.dataTransfer.getData('countryId'));
        if (draggedCountryId !== targetCountryId) {
            const newOrder = [...countryOrder];
            const draggedIndex = newOrder.indexOf(draggedCountryId);
            const targetIndex = newOrder.indexOf(targetCountryId);
            // Swap elements
            const temp = newOrder[draggedIndex];
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, temp);
            setCountryOrder(newOrder);
        }
        e.currentTarget.classList.remove('bg-cyan-500/20');
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-cyan-500/20');
    };
    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-cyan-500/20');
    };
    const handleCellClick = (e, productId, countryId) => {
        e.stopPropagation();
        setDropdown({
            open: true,
            productId: productId,
            countryId: countryId,
            x: e.clientX,
            y: e.clientY,
        });
    };
    const handleStatusSelect = (status) => {
        if (dropdown.productId !== null && dropdown.countryId !== null) {
            onStatusChange(dropdown.productId, dropdown.countryId, status);
        }
        setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
    };
    const handleEditDetailsClick = () => {
        if (dropdown.productId === null || dropdown.countryId === null)
            return;
        let notification = notifications.find(n => n.productId === dropdown.productId && n.countryId === dropdown.countryId);
        if (!notification) {
            notification = {
                id: 'new',
                productId: dropdown.productId,
                countryId: dropdown.countryId,
                status: 'Pendiente',
                notifiedBy: '',
            };
        }
        onEditDetails(notification);
        setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
    };
    const StatusDropdown = () => {
        if (!dropdown.open)
            return null;
        return (<div className="fixed z-10 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1" style={{ top: dropdown.y + 10, left: dropdown.x }} onClick={(e) => e.stopPropagation()}>
          {STATUS_OPTIONS.map(status => (<button key={status} onClick={() => handleStatusSelect(status)} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-center">
              <Icon_1.Icon name={statusConfig[status].icon} className={`mr-2 ${colorVariants[(statusConfig[status].color + 'Bg')].split(' ')[1]}`}/>
              {status}
            </button>))}
           <div className="border-t border-slate-600 my-1"></div>
            <button onClick={handleEditDetailsClick} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-center">
              <Icon_1.Icon name="pencil-alt" className="mr-2 text-slate-400"/>
              Editar Detalles
            </button>
        </div>);
    };
    return (<div>
      <h1 className="text-2xl font-bold text-slate-200 mb-6">Matriz de Notificaciones Regulatorias</h1>
      <StatusDropdown />
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 border-collapse">
            <thead className="bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 whitespace-nowrap border-r border-slate-700">
                  Producto
                </th>
                {orderedCountries.map(country => (<th key={country.id} draggable onDragStart={(e) => handleDragStart(e, country.id)} onDrop={(e) => handleDrop(e, country.id)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap cursor-grab active:cursor-grabbing transition-colors">
                    {country.name}
                  </th>))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {products.map(product => (<tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200 border-r border-slate-700">
                    {product.name}
                  </td>
                  {orderedCountries.map(country => {
                const notification = notifications.find(n => n.productId === product.id && n.countryId === country.id);
                const status = notification?.status;
                const config = status ? statusConfig[status] : null;
                return (<td key={country.id} className="px-4 py-3 whitespace-nowrap text-center text-sm border-l border-slate-700/50">
                        <button onClick={(e) => handleCellClick(e, product.id, country.id)} className={`w-full h-full inline-flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors duration-200 
                            ${config ? colorVariants[(config.color + 'Bg')] : 'bg-slate-700/50 hover:bg-slate-600 text-slate-500'}`}>
                          {config && <Icon_1.Icon name={config.icon} className="mr-1.5"/>}
                          {status || 'N/A'}
                        </button>
                      </td>);
            })}
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
exports.NotificationsDashboard = NotificationsDashboard;
