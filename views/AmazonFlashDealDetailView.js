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
exports.AmazonFlashDealDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const AmazonFlashDealDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
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
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let finalValue = value;
        if (type === 'number') {
            finalValue = value === '' ? undefined : Number(value);
        }
        if (type === 'datetime-local') {
            finalValue = new Date(value).toISOString();
        }
        setData(prev => ({ ...prev, [name]: finalValue }));
    };
    const overlappingCoupon = (0, react_1.useMemo)(() => {
        if (!data.productId || !data.platformId || !data.startDate || !data.endDate) {
            return undefined;
        }
        const dealStart = new Date(data.startDate);
        const dealEnd = new Date(data.endDate);
        return appData.prices.find(price => price.productId === data.productId &&
            price.platformId === data.platformId &&
            price.couponPercentage && price.couponPercentage > 0
        // This is a simplified check. A real app would check date ranges.
        // For now, we just check if any coupon exists.
        );
    }, [data.productId, data.platformId, data.startDate, data.endDate, appData.prices]);
    const handleDeleteClick = () => onDelete(data.id);
    const toDateTimeLocal = (isoString) => {
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Oferta Flash' : `Editando Oferta: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField_1.FormField label="Nombre de la Campaña" htmlFor="name" className="md:col-span-2">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        
        <FormField_1.FormField label="Producto">
            <Select_1.Select name="productId" value={data.productId} onChange={handleInputChange}>
                <option value="">Seleccionar producto...</option>
                {appData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select_1.Select>
        </FormField_1.FormField>
         <FormField_1.FormField label="Plataforma">
            <Select_1.Select name="platformId" value={data.platformId} onChange={handleInputChange}>
                <option value="">Seleccionar plataforma...</option>
                {appData.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select_1.Select>
        </FormField_1.FormField>
         <FormField_1.FormField label="ASIN">
            <TextInput_1.TextInput name="asin" value={data.asin} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Estado">
            <Select_1.Select name="status" value={data.status} onChange={handleInputChange}>
                <option value="Borrador">Borrador</option>
                <option value="Programada">Programada</option>
                <option value="Activa">Activa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
            </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Fecha y Hora de Inicio">
            <TextInput_1.TextInput type="datetime-local" name="startDate" value={toDateTimeLocal(data.startDate)} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Fecha y Hora de Fin">
            <TextInput_1.TextInput type="datetime-local" name="endDate" value={toDateTimeLocal(data.endDate)} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Precio de Oferta">
            <TextInput_1.TextInput type="number" name="dealPrice" value={data.dealPrice} onChange={handleInputChange} step="0.01"/>
        </FormField_1.FormField>
         <FormField_1.FormField label="Moneda">
            <TextInput_1.TextInput name="currency" value={data.currency} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Límite de Stock (Opcional)">
            <TextInput_1.TextInput type="number" name="stockLimit" value={data.stockLimit || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
      </div>

      {overlappingCoupon && (<div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-300">
            <Icon_1.Icon name="exclamation-triangle" className="mr-2"/>
            <strong>¡Atención!</strong> Ya existe un cupón del <strong>{overlappingCoupon.couponPercentage}%</strong> para este producto en esta plataforma. El precio final para el cliente se calculará sobre el precio de la oferta.
          </div>)}

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Oferta</button>
      </div>
    </div>);
};
exports.AmazonFlashDealDetailView = AmazonFlashDealDetailView;
