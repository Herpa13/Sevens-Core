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
exports.PricesByPlatformDashboard = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const MultiSelect_1 = require("../components/common/MultiSelect");
const TextInput_1 = require("../components/common/TextInput");
const pricingService_1 = require("../services/pricingService");
const PricesByPlatformDashboard = ({ appData, onSave, setIsDirty, setSaveHandler }) => {
    const [selectedProductIds, setSelectedProductIds] = (0, react_1.useState)(null);
    const [editedPrices, setEditedPrices] = (0, react_1.useState)({});
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        const toUpdate = [];
        Object.entries(editedPrices).forEach(([priceIdStr, edits]) => {
            const priceId = Number(priceIdStr);
            const originalPrice = appData.prices.find(p => p.id === priceId);
            if (originalPrice) {
                // If the amount was edited, it's a manual update
                const updatedPrice = { ...originalPrice, ...edits };
                if (edits.amount !== undefined) {
                    updatedPrice.lastUpdatedBy = 'manual';
                }
                toUpdate.push(updatedPrice);
            }
        });
        if (toUpdate.length > 0) {
            onSave(toUpdate);
        }
        else if (onSuccess) {
            onSuccess();
            return;
        }
        else {
            alert("No hay cambios para guardar.");
        }
        setEditedPrices({});
        if (onSuccess) {
            onSuccess();
        }
    }, [editedPrices, appData.prices, onSave]);
    (0, react_1.useEffect)(() => {
        const hasChanges = Object.keys(editedPrices).length > 0;
        setIsDirty(hasChanges);
    }, [editedPrices, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => {
            setSaveHandler(null);
        };
    }, [handleSaveClick, setSaveHandler]);
    const filteredProducts = (0, react_1.useMemo)(() => {
        if (selectedProductIds === null)
            return appData.products;
        return appData.products.filter(p => selectedProductIds.includes(p.id));
    }, [appData.products, selectedProductIds]);
    const activePlatforms = (0, react_1.useMemo)(() => appData.platforms.filter(p => p.status === 'Activa').sort((a, b) => a.name.localeCompare(b.name)), [appData.platforms]);
    const handlePriceDataChange = (priceId, field, value) => {
        const numericValue = value === '' ? null : parseFloat(value);
        setEditedPrices(prev => ({
            ...prev,
            [priceId]: {
                ...prev[priceId],
                [field]: numericValue,
            }
        }));
    };
    const handleProductFilterChange = (ids) => {
        setSelectedProductIds(ids);
    };
    return (<div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Precios por Plataforma</h1>
                    <p className="text-sm text-slate-400 mt-1">Gestiona precios, descuentos y cupones manuales sobre los precios calculados.</p>
                </div>
                 <button onClick={() => handleSaveClick()} disabled={Object.keys(editedPrices).length === 0} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 flex items-center">
                    <Icon_1.Icon name="save" className="mr-2"/>
                    Guardar Cambios
                </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <CollapsibleSection_1.CollapsibleSection title="Filtros de Visualización">
                    <div className="p-4">
                        <MultiSelect_1.MultiSelect options={appData.products.map(p => ({ id: p.id, name: p.name }))} selectedIds={selectedProductIds} onSelectionChange={handleProductFilterChange} placeholder="Filtrar productos..."/>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
                
                <div className="overflow-x-auto border border-slate-700 rounded-lg">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-slate-700/50 sticky top-0 z-10">
                            <tr>
                                <th rowSpan={2} className="p-2 text-left font-semibold sticky left-0 bg-slate-700/50 border-r border-b border-slate-700 z-20">Producto</th>
                                {activePlatforms.map(platform => (<th key={platform.id} colSpan={4} className="p-2 text-center font-semibold whitespace-nowrap border-b border-l border-slate-700">{platform.name}</th>))}
                            </tr>
                            <tr>
                                {activePlatforms.flatMap(platform => [
            <th key={`${platform.id}-pub`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Precio Pub.</th>,
            <th key={`${platform.id}-dto`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Descuento %</th>,
            <th key={`${platform.id}-cup`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Cupón %</th>,
            <th key={`${platform.id}-fin`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Precio Final</th>,
        ])}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredProducts.map(product => (<tr key={product.id}>
                                    <td className="p-2 font-medium text-slate-300 sticky left-0 bg-slate-800 whitespace-nowrap border-r border-slate-700 z-10">{product.name}</td>
                                    {activePlatforms.map(platform => {
                const price = appData.prices.find(p => p.productId === product.id && p.platformId === platform.id);
                if (!price) {
                    return <td key={platform.id} colSpan={4} className="p-2 text-center text-slate-500 border-l border-slate-700">N/A</td>;
                }
                const editedPrice = editedPrices[price.id];
                const isManuallySet = (editedPrice?.amount !== undefined) ? true : price.lastUpdatedBy === 'manual';
                const currentAmount = editedPrice?.amount !== undefined ? editedPrice.amount : price.amount;
                const discount = editedPrice?.discountPercentage !== undefined ? editedPrice.discountPercentage : price.discountPercentage;
                const coupon = editedPrice?.couponPercentage !== undefined ? editedPrice.couponPercentage : price.couponPercentage;
                const finalPrice = (0, pricingService_1.calculateFinalCustomerPrice)(currentAmount, discount, coupon);
                const isDirty = !!editedPrice;
                return (<react_1.default.Fragment key={platform.id}>
                                                <td className="p-1 text-center font-mono border-l border-slate-700">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        {isManuallySet && <Icon_1.Icon name="user-edit" className="text-cyan-400" title="Precio manual"/>}
                                                        <TextInput_1.TextInput type="number" step="0.01" value={currentAmount ?? ''} onChange={e => handlePriceDataChange(price.id, 'amount', e.target.value)} className={`!py-1 text-center w-24 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`}/>
                                                    </div>
                                                </td>
                                                <td className="p-1 text-center border-l border-slate-700">
                                                    <TextInput_1.TextInput type="number" step="0.1" value={discount ?? ''} onChange={e => handlePriceDataChange(price.id, 'discountPercentage', e.target.value)} className={`!py-1 text-center w-20 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`} placeholder="-"/>
                                                </td>
                                                <td className="p-1 text-center border-l border-slate-700">
                                                    <TextInput_1.TextInput type="number" step="0.1" value={coupon ?? ''} onChange={e => handlePriceDataChange(price.id, 'couponPercentage', e.target.value)} className={`!py-1 text-center w-20 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`} placeholder="-"/>
                                                </td>
                                                <td className={`p-1 text-center font-mono font-bold border-l border-slate-700 ${isDirty ? 'text-yellow-300' : 'text-slate-200'}`}>{finalPrice.toFixed(2)}€</td>
                                            </react_1.default.Fragment>);
            })}
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
};
exports.PricesByPlatformDashboard = PricesByPlatformDashboard;
