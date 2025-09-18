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
exports.PvprMatrixDashboard = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const TextInput_1 = require("../components/common/TextInput");
const PvprMatrixDashboard = ({ appData, onSave, setIsDirty, setSaveHandler }) => {
    const { products, countries, pvprs } = appData;
    const [editedPvprs, setEditedPvprs] = (0, react_1.useState)({});
    const matrixData = (0, react_1.useMemo)(() => {
        return products.map(product => {
            const row = {};
            countries.forEach(country => {
                row[country.id] = pvprs.find(p => p.productId === product.id && p.countryId === country.id);
            });
            return {
                productId: product.id,
                productName: product.name,
                pvprsByCountry: row,
            };
        });
    }, [products, countries, pvprs]);
    const handlePriceChange = (productId, countryId, amount) => {
        const key = `${productId}-${countryId}`;
        const originalPvpr = pvprs.find(p => p.productId === productId && p.countryId === countryId);
        setEditedPvprs(prev => ({
            ...prev,
            [key]: {
                amount: amount,
                isNew: !originalPvpr
            }
        }));
    };
    const hasChanges = Object.keys(editedPvprs).length > 0;
    (0, react_1.useEffect)(() => {
        setIsDirty(hasChanges);
    }, [hasChanges, setIsDirty]);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        const toUpdate = [];
        Object.entries(editedPvprs).forEach(([key, value]) => {
            const [productId, countryId] = key.split('-').map(Number);
            const originalPvpr = pvprs.find(p => p.productId === productId && p.countryId === countryId);
            if (originalPvpr) {
                // Update existing
                if (originalPvpr.amount !== Number(value.amount)) {
                    toUpdate.push({ ...originalPvpr, amount: Number(value.amount) });
                }
            }
            else {
                // Create new
                if (value.amount !== '') {
                    toUpdate.push({
                        id: -Date.now(), // Temporary ID for new items
                        productId,
                        countryId,
                        amount: Number(value.amount),
                        currency: 'EUR' // Default currency
                    });
                }
            }
        });
        if (toUpdate.length > 0) {
            onSave(toUpdate);
        }
        else if (onSuccess) {
            // If called from "Save & Exit", we still need to call onSuccess to navigate.
            onSuccess();
            return;
        }
        else {
            alert("No hay cambios para guardar.");
        }
        setEditedPvprs({});
        if (onSuccess) {
            onSuccess();
        }
    }, [editedPvprs, onSave, pvprs]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => {
            setSaveHandler(null);
        };
    }, [handleSaveClick, setSaveHandler]);
    return (<div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-200">Matriz de PVPR</h1>
        <button onClick={() => handleSaveClick()} disabled={!hasChanges} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 flex items-center">
          <Icon_1.Icon name="save" className="mr-2"/>
          Guardar Cambios
        </button>
      </div>
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 border-collapse">
            <thead className="bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 whitespace-nowrap border-r border-slate-700">
                  Producto
                </th>
                {countries.map(country => (<th key={country.id} className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {country.name}
                  </th>))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {matrixData.map(row => (<tr key={row.productId}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-200 border-r border-slate-700">
                    {row.productName}
                  </td>
                  {countries.map(country => {
                const pvpr = row.pvprsByCountry[country.id];
                const editKey = `${row.productId}-${country.id}`;
                const editedValue = editedPvprs[editKey];
                const currentValue = editedValue ? editedValue.amount : pvpr?.amount;
                const isDirty = editedValue !== undefined;
                return (<td key={country.id} className="whitespace-nowrap text-center text-sm border-l border-slate-700/50 p-1">
                        <TextInput_1.TextInput type="number" step="0.01" value={currentValue ?? ''} onChange={(e) => handlePriceChange(row.productId, country.id, e.target.value)} className={`!py-1 text-center text-xs bg-slate-900 text-slate-200 ${isDirty ? 'border-yellow-400 ring-yellow-400' : 'border-slate-600'}`} placeholder="-"/>
                      </td>);
            })}
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
exports.PvprMatrixDashboard = PvprMatrixDashboard;
