import type { ChangeDetail, LoggedEntityType, AppData, Entity, EntityType } from '../types';
import { LANGUAGES } from '../data/languages';

const FIELD_NAMES: Record<string, string> = {
    name: 'General - Nombre',
    sku: 'SKU (Identificador)',
    status: 'General - Estado',
    ean: 'General - EAN',
    format: 'General - Formato',
    units: 'General - Unidades',
    pesoNetoEtiqueta: 'General - Peso Neto (Etiqueta)',
    pesoNeto: 'General - Peso Neto (g)',
    pesoEnvio: 'General - Peso Envío (g)',
    modoUso: 'General - Modo de Uso',
    recommendedDailyDose: 'General - Dosis Diaria Recomendada',
    netQuantityLabel: 'General - Cantidad Neta (Etiqueta)',
    netQuantityNutritionalInfo: 'General - Info Nutricional Cantidad Neta',
    envaseColor: 'General - Color Envase',
    tapaColor: 'General - Color Tapa',
    hasRepercap: 'General - ¿Tiene Repercap?',
    isRepercapScreenPrinted: 'General - ¿Repercap Serigrafiado?',

    puntosFuertes: 'Marketing - Puntos Fuertes',
    puntosDebiles: 'Marketing - Puntos Débiles',
    publicoObjetivo: 'Marketing - Público Objetivo',
    keySellingPoints: 'Marketing - Key Selling Points',
    miniNarrativa: 'Marketing - Mini Narrativa',
    sugerenciasUso: 'Marketing - Sugerencias de Uso',
    
    'layer2Content.title.spanishContent.finalVersion': 'Layer2 - Título Final (ES)',
    'layer2Content.description.spanishContent.finalVersion': 'Layer2 - Descripción Final (ES)',
    
    'shopifyContent.titleShopify': 'Shopify - Título',
    'shopifyContent.descriptionShopify': 'Shopify - Descripción',

    'amazonAttributes.flavor': 'Atributos Amazon / Sabor',

    identifier: 'Identificador',
    productId: 'Producto Asociado',
    latinName: 'Nombre Latín',
    type: 'Tipo',
    measureUnit: 'Unidad de Medida',
    notifiedBy: 'Notificado Por',
    agencyName: 'Nombre Agencia',
    notificationDate: 'Fecha de Notificación',
};

const IGNORED_FIELDS = ['id', 'updatedAt', 'createdAt', 'composition'];

const isObject = (obj: any): obj is Record<string, any> => obj !== null && typeof obj === 'object' && !Array.isArray(obj);

const formatFieldName = (path: string, appData: AppData): string => {
    if (FIELD_NAMES[path]) {
        return FIELD_NAMES[path];
    }

    if (path.startsWith('amazonContents.')) {
        const parts = path.split('.');
        const countryIso = parts[1];
        const fieldKey = parts.slice(2).join('.');
        const countryName = appData.countries.find(c => c.iso === countryIso)?.name || countryIso;
        
        let fieldName = fieldKey;
        if(fieldKey.startsWith('bulletPoints')) {
            const bpIndex = fieldKey.split('.')[1];
            fieldName = `Bullet Point ${parseInt(bpIndex, 10) + 1} / Texto`;
        }
        
        return `Contenido Amazon (${countryName}) / ${fieldName}`;
    }
    
    if (path.startsWith('layer2Content.title.translations.')) {
        const langCode = path.split('.').pop();
        return `Contenido Layer2 / Título / Traducción (${langCode})`;
    }
    if (path.startsWith('layer2Content.description.translations.')) {
        const langCode = path.split('.').pop();
        return `Contenido Layer2 / Descripción / Traducción (${langCode})`;
    }

    return path.replace(/\./g, ' / ');
}

const deepDiff = (path: string, obj1: any, obj2: any, changes: ChangeDetail[], appData: AppData) => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) return;

    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    for (const key of keys) {
        const currentPath = path ? `${path}.${key}` : key;
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];

        if (isObject(val1) || isObject(val2)) {
            deepDiff(currentPath, val1 || {}, val2 || {}, changes, appData);
        } else if (Array.isArray(val1) || Array.isArray(val2)) {
             if (currentPath === 'amazonContents') {
                const allCountryIds = new Set([...(val1 || []).map(c => c.countryId), ...(val2 || []).map(c => c.countryId)]);
                for (const countryId of allCountryIds) {
                    const oldContent = (val1 || []).find(c => c.countryId === countryId);
                    const newContent = (val2 || []).find(c => c.countryId === countryId);
                    const country = appData.countries.find(c => c.id === countryId);
                    const countryCode = country ? country.iso : `ID ${countryId}`;
                    deepDiff(`${currentPath}.${countryCode}`, oldContent, newContent, changes, appData);
                }
             } else if (currentPath.endsWith('.translations')) {
                 const parentPath = currentPath.replace('.translations', '');
                 LANGUAGES.forEach(lang => {
                    const item1 = (val1 || []).find(t => t.lang === lang.code);
                    const item2 = (val2 || []).find(t => t.lang === lang.code);
                    if (JSON.stringify(item1) !== JSON.stringify(item2)) {
                        const fieldPath = `${parentPath}.translations.${lang.code}`;
                        changes.push({
                            field: fieldPath,
                            fieldName: formatFieldName(fieldPath, appData),
                            oldValue: item1?.finalVersion ?? 'vacío',
                            newValue: item2?.finalVersion ?? 'vacío',
                        });
                    }
                 });
             } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                changes.push({
                    field: currentPath,
                    fieldName: formatFieldName(currentPath, appData),
                    oldValue: val1,
                    newValue: val2,
                });
            }
        } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            changes.push({
                field: currentPath,
                fieldName: formatFieldName(currentPath, appData),
                oldValue: val1 ?? 'vacío',
                newValue: val2 ?? 'vacío',
            });
        }
    }
}


export const generateChangeDetails = (entityType: EntityType, oldEntity: Entity, newEntity: Entity, appData: AppData): ChangeDetail[] => {
  const changes: ChangeDetail[] = [];
  
  const oldEntityClean = JSON.parse(JSON.stringify(oldEntity));
  const newEntityClean = JSON.parse(JSON.stringify(newEntity));

  deepDiff('', oldEntityClean, newEntityClean, changes, appData);

  // Filter out ignored fields from the final changes
  return changes.filter(change => !IGNORED_FIELDS.some(ignored => change.field.startsWith(ignored)));
};