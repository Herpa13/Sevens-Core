"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentMaturityDashboard = void 0;
const react_1 = __importDefault(require("react"));
// FIX: Update type to correctly reference PublicationPlanning
const statusIconConfig = {
    textContent: { name: 'Texto', icon: 'T' },
    aPlusContent: { name: 'A+', icon: 'A+' },
    publishedInStore: { name: 'Store', icon: 'S' },
    videos: { name: 'Vídeos', icon: 'V' },
};
const StatusIcon = ({ item, type }) => {
    const config = statusIconConfig[type];
    const status = item?.status || 'Pendiente Modificacion';
    const isPublished = status === 'Publicado';
    const observaciones = item?.observaciones;
    const color = isPublished ? 'text-green-400' : 'text-yellow-400';
    const title = `${config.name}: ${status}${observaciones ? ` - ${observaciones}` : ''}`;
    return (<div title={title} className="flex flex-col items-center">
            <span className={`font-bold text-sm ${color}`}>{config.icon}</span>
        </div>);
};
const ContentMaturityDashboard = ({ appData, onSelectItem }) => {
    const { products, platforms, countries } = appData;
    const amazonPlatforms = platforms.filter(p => p.name.startsWith('Amazon'));
    const amazonCountries = countries.filter(c => amazonPlatforms.some(p => p.countryId === c.id));
    return (<div>
      <h1 className="text-2xl font-bold text-slate-200 mb-6">Matriz de Madurez de Contenido</h1>
      <div className="bg-slate-800 rounded-lg overflow-hidden">
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 border-collapse">
            <thead className="bg-slate-700/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 border-r border-slate-700">Producto</th>
                {amazonCountries.map(country => (<th key={country.id} className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amazon {country.iso}
                  </th>))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {products.map(product => (<tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200 border-r border-slate-700">{product.name}</td>
                  {amazonCountries.map(country => {
                // FIX: Get planning status from product.publicationPlanning, not amazonContents
                const publicationPlanning = product.publicationPlanning?.find(pp => pp.countryId === country.id);
                const planningStatus = publicationPlanning?.planningStatus;
                return (<td key={country.id} className="px-2 py-2 whitespace-nowrap text-center text-sm border-l border-slate-700/50 hover:bg-slate-700/50 cursor-pointer" onClick={() => onSelectItem('products', product)}>
                         {planningStatus ? (<div className="flex justify-around items-center">
                                <StatusIcon item={planningStatus.textContent} type="textContent"/>
                                <StatusIcon item={planningStatus.aPlusContent} type="aPlusContent"/>
                                <StatusIcon item={planningStatus.publishedInStore} type="publishedInStore"/>
                                <StatusIcon item={planningStatus.videos} type="videos"/>
                            </div>) : (<span className="text-slate-600">-</span>)}
                      </td>);
            })}
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
exports.ContentMaturityDashboard = ContentMaturityDashboard;
