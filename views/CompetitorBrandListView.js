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
exports.CompetitorBrandListView = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const CompetitorBrandListView = ({ brands, products, onSelectItem, onAddNew }) => {
    const [openBrands, setOpenBrands] = (0, react_1.useState)({});
    const toggleBrand = (brandId) => {
        setOpenBrands(prev => ({ ...prev, [brandId]: !prev[brandId] }));
    };
    return (<div className="bg-slate-800 rounded-lg">
             <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-200">Marcas de la Competencia</h1>
                <button onClick={() => onAddNew('competitorBrands')} className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500">
                    <Icon_1.Icon name="plus" className="mr-2"/>
                    Añadir Nueva Marca
                </button>
            </div>

            <div className="space-y-2 p-2">
                {brands.map(brand => {
            const associatedProducts = products.filter(p => p.competitorBrandId === brand.id);
            const isOpen = openBrands[brand.id] || false;
            return (<div key={brand.id} className="border border-slate-700 rounded-lg bg-slate-800/50 transition-shadow hover:shadow-lg">
                            <button onClick={() => toggleBrand(brand.id)} className="w-full flex items-center p-3 text-left focus:outline-none">
                                <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mr-4">
                                    {brand.logoUrl ? (<img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover rounded-full"/>) : (<Icon_1.Icon name="copyright" className="text-xl text-slate-400"/>)}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-slate-200">{brand.name}</h3>
                                    {brand.productTypology && <p className="text-xs text-slate-400">{brand.productTypology}</p>}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{associatedProducts.length} Productos</span>
                                    <button onClick={(e) => { e.stopPropagation(); onSelectItem('competitorBrands', brand); }} className="text-cyan-400 hover:text-cyan-300 p-1 rounded-full"><Icon_1.Icon name="edit"/></button>
                                    <Icon_1.Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="transition-transform text-slate-500"/>
                                </div>
                            </button>
                            {isOpen && (<div className="p-4 border-t border-slate-700">
                                    {associatedProducts.length > 0 ? (<ul className="space-y-2">
                                            {associatedProducts.map(product => (<li key={product.id} onClick={() => onSelectItem('competitorProducts', product)} className="flex items-center p-2 rounded-md hover:bg-slate-700 cursor-pointer">
                                                    <Icon_1.Icon name="box" className="mr-3 text-slate-500"/>
                                                    <span className="text-sm font-medium text-slate-300">{product.name}</span>
                                                    <span className="ml-auto text-xs text-slate-400">{product.asin}</span>
                                                </li>))}
                                        </ul>) : (<p className="text-sm text-slate-500 text-center py-4">No hay productos asociados a esta marca.</p>)}
                                </div>)}
                        </div>);
        })}
            </div>
        </div>);
};
exports.CompetitorBrandListView = CompetitorBrandListView;
