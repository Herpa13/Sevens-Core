



export type LanguageCode = 'ES' | 'IT' | 'FR' | 'DE' | 'PT' | 'SV' | 'NL' | 'PL' | 'EN' | 'TR';

export interface DocumentAttachment {
    id: number | string;
    name: string;
    url: string;
    comment?: string;
}

// FIX: Added 'batches', 'purchaseOrders', and 'countries' to NoteEntityType to allow notes on these entities.
export type NoteEntityType = 'products' | 'platforms' | 'competitorBrands' | 'etiquetas' | 'ingredients' | 'countries' | 'envases' | 'competitorProducts' | 'tasks' | 'videoProjects' | 'knowledgeBaseEntries' | 'batches' | 'purchaseOrders';

export interface NoteAttachment {
    id: number | string;
    name: string;
    url: string;
}

export interface Note {
    id: number | 'new';
    entityType: NoteEntityType;
    entityId: number;
    authorName: string;
    text: string;
    attachments?: NoteAttachment[];
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    status: 'Activa' | 'Archivada';
    archiveReason?: string;
}

export type KnowledgeBaseEntryStatus = 'Borrador' | 'En Revisión' | 'Aprobado' | 'Archivado';
export type KnowledgeBaseEntryType = 'Texto' | 'Archivo' | 'Enlace';
export type KnowledgeBaseCategory = 'Textos Legales' | 'Guías de Marca' | 'Marketing' | 'Certificados' | 'General' | 'Buenas Prácticas' | 'Guías de Uso';

export interface KnowledgeBaseEntry {
    id: number | 'new';
    title: string;
    description: string;
    entryType: KnowledgeBaseEntryType;
    category: KnowledgeBaseCategory;
    tags: string[];
    content: {
        text?: string;
        files?: DocumentAttachment[];
        url?: string;
    };
    status: KnowledgeBaseEntryStatus;
    version: number;
    parentId: number | null; // N:1 self-reference for versioning
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
}

export interface KnowledgeBaseUsage {
    id: number | 'new';
    entryId: number;
    entryVersion: number;
    entityType: keyof AppData;
    entityId: number;
    usedAt: string; // ISO String
    userId: number;
}


export interface Subtask {
    id: number | 'new';
    taskId: number;
    name: string;
    isCompleted: boolean;
    assigneeId?: number;
    dueDate?: string; // ISO String (Date only)
}

export interface AISettings {
    globalTranslationRules: string;
}

export type ContentPartType = 'field' | 'static';

export interface ContentPartReference {
    id: string; // for React keys
    type: ContentPartType;
    // For 'field' type
    sourceType?: 'General' | 'Marketing' | 'Amazon' | 'Composición';
    sourceKey?: string;
    // For 'static' type
    value?: string;
}

export interface ContentRecipe {
    id: number | 'new';
    name: string; 
    target: 'title' | 'description'; 
    parts: ContentPartReference[]; 
}

export interface Layer2Translation {
    lang: LanguageCode;
    finalVersion: string;
}

export interface Layer2ContentBlock {
    recipeId?: number; 
    spanishContent: {
        rawConcatenated: string;
        aiRevised?: string;
        finalVersion: string;
    };
    translations: Layer2Translation[];
}

export interface Layer2Content {
    title: Layer2ContentBlock;
    description: Layer2ContentBlock;
}

export interface ShopifyFAQ {
    id: string;
    question: string;
    answer: string;
}

export interface ShopifyPost {
    id: string;
    title: string;
}

export interface ShopifyContent {
    titleShopify: string;
    descriptionShopify: string;
    benefitsShopify: string;
    focusSummaryShopify: string;
    highlightBenefit1?: string;
    highlightBenefit2?: string;
    highlightBenefit3?: string;
    highlightBenefit4?: string;
    highlightBenefit5?: string;
    faqs?: ShopifyFAQ[];
    relatedPosts?: ShopifyPost[];
}

export interface AmazonInfographic {
    imageUrl: string;
    comment: string; // This is now "Guía de creación"
    cosmoAnalysis: string;
    referenceImageUrl?: string;
}

export interface AmazonVideo {
    videoId: number;
    comment: string;
}

export interface AmazonBulletPoint {
    text: string;
    associatedBenefits: string[];
}

// --- START NEW AMAZON CONTENT VERSIONING MODEL ---
export type AmazonContentPlanningStatus = 'Publicado' | 'Pendiente Modificacion';

export interface AmazonContentPlanningItem {
    status: AmazonContentPlanningStatus;
    observaciones?: string;
}

export interface PublicationPlanning {
    countryId: number;
    planningStatus: {
        textContent: AmazonContentPlanningItem;
        aPlusContent: AmazonContentPlanningItem;
        publishedInStore: AmazonContentPlanningItem;
        videos: AmazonContentPlanningItem;
    };
}

export interface AmazonContentVersion {
    versionId: number; // e.g., timestamp
    createdAt: string; // ISO String
    authorName: string;
    changeReason: string;
    content: {
        title: string;
        description: string;
        bulletPoints: AmazonBulletPoint[];
        searchTerms: string[];
        backendKeywords: string[];
        infographics: AmazonInfographic[];
    };
}

export interface AmazonUnversionedContent {
    mainImageUrl?: string;
    amazonVideos: AmazonVideo[];
    amazonBenefits: string[];
}

export interface AmazonContent {
    countryId: number;
    currentVersionId: number | null;
    versions: AmazonContentVersion[];
    unversionedContent: AmazonUnversionedContent;
}
// --- END NEW AMAZON CONTENT VERSIONING MODEL ---


export type AmazonAttributeUnitLength = 'Milímetros' | 'Centímetros';
export type AmazonAttributeUnitWeight = 'Miligramos' | 'Gramos' | 'Kilográmos';
export type AmazonAttributeGender = 'Femenino' | 'Masculino' | 'Unisex';
export type AmazonAttributeAgeRange = 'Adolescente' | 'Adulto' | 'Infant' | 'Neonato' | 'Niño' | 'Toddler';
export type AmazonAttributeMaterialFeature = 'Bajo en carbohidratos' | 'Bajo en sodio' | 'Certificado orgánico' | 'Natural' | 'Sin colorantes artificiales' | 'Sin conservantes artificiales' | 'Sin crueldad' | 'Sin edulcorantes artificiales' | 'Sin OGM' | 'Sin saborizantes artificiales';
export type AmazonAttributeStorageTemperature = 'Ambiente: Temperatura de la habitación' | 'Congelado: 0 grados' | 'Refrigerado: entre 33 y 38 grados';
export type AmazonAttributeServingUnit = 'Ampolla' | 'Bar' | 'cápsula(s)' | 'Cucharada(s)' | 'Gramos' | 'Microgramos' | 'Miligramos' | 'Mililitros' | 'Onzas de líquido' | 'píldoras' | 'Porcentaje de la cantidad diaria' | 'Porción(es)' | 'teaspoon(s)';
export type AmazonAttributeExpiryType = 'Does Not Expire' | 'Expiration Date Required' | 'Expiration On Package' | 'Production Date Required' | 'Shelf Life';
export type AmazonAttributeFulfillmentCenterShelfLifeUnit = 'Días';
export type AmazonAttributeItemForm = 'Aerosol' | 'Barrita' | 'Capleta' | 'Cápsula' | 'Cápsula blanda' | 'Copo' | 'Crema' | 'Gel' | 'Gominola' | 'Gránulo' | 'Líquido' | 'Masticable' | 'Oblea' | 'Pastilla' | 'Polvo';
export type AmazonAttributeUnitCountType = 'gramo' | 'miligramo' | 'unidad';
export type AmazonAttributeContainerType = 'Barreño' | 'Blister' | 'Bolsa' | 'Botella' | 'Caja' | 'Paquete de palitos' | 'Tarro' | 'Tuba';
export type AmazonAttributeDietType = 'A base de plantas' | 'Halal' | 'Keto' | 'Kosher' | 'Paleo' | 'sin gluten' | 'Vegano' | 'Vegetariano';
export type AmazonAttributeSupplementFormulation = 'Multisuplemento' | 'Suplemento único';
export type AmazonAttributePillCoating = 'Azúcar' | 'Compresión' | 'Entérico' | 'Gelatina' | 'Película' | 'Sin recubrimiento';
export type AmazonAttributeDoseReleaseMethod = 'Liberación dirigida' | 'Liberación extendida' | 'Liberación inmediata' | 'Liberación osmótica' | 'Liberación pulsátil' | 'Liberación retrasada';
export type AmazonAttributeComplianceStatus = 'En conformidad' | 'Exento' | 'No conformado';


export interface AmazonAttributes {
    // Dimensions & Weight
    itemLength?: number;
    itemLengthUnit?: AmazonAttributeUnitLength;
    itemWidth?: number;
    itemWidthUnit?: AmazonAttributeUnitLength;
    itemHeight?: number;
    itemHeightUnit?: AmazonAttributeUnitLength;
    packageWeight?: number;
    packageWeightUnit?: AmazonAttributeUnitWeight;
    
    // General Sales Info
    safetyWarning?: string;
    countryOfOrigin?: number; // Country ID
    category?: string;
    navigationNode?: string; 
    gender?: AmazonAttributeGender;
    ageRangeDescription?: AmazonAttributeAgeRange;
    numberOfItems?: number;

    // Benefits & Marketing
    benefit1?: string;
    benefit2?: string;
    benefit3?: string;
    benefit4?: string;
    benefit5?: string;
    specialIngredients?: string;

    // Product Features
    recommendedServing?: string;
    materialFeatures?: AmazonAttributeMaterialFeature;
    storageTemperature?: AmazonAttributeStorageTemperature;
    servingSuggestion?: string;
    servingSize?: number;
    servingSizeUnit?: AmazonAttributeServingUnit;
    flavor?: string;
    ingredients?: string;
    allergenInfo?: string;

    // Compliance & Expiry
    isProductExpirable?: boolean;
    productExpiryType?: AmazonAttributeExpiryType;
    fulfillmentCenterShelfLife?: number;
    fulfillmentCenterShelfLifeUnit?: AmazonAttributeFulfillmentCenterShelfLifeUnit;
    
    // Extra fields
    unitCount?: number;
    unitCountType?: AmazonAttributeUnitCountType;
    itemForm?: AmazonAttributeItemForm;
    specificUses?: string;
    containerType?: AmazonAttributeContainerType;
    dietType?: AmazonAttributeDietType;
    dosageForm?: string;
    primarySupplementType?: string;
    servingsPerContainer?: number;
    supplementFormulation?: AmazonAttributeSupplementFormulation;
    pillCoating?: AmazonAttributePillCoating;
    doseReleaseMethod?: AmazonAttributeDoseReleaseMethod;
    complianceCertificationStatus?: AmazonAttributeComplianceStatus;
    regulatoryBodyName?: string;
    complianceCertifications?: string;
    directions?: string;
}

// --- START PRICING MODELS ---
export interface Pvpr {
    id: number | 'new';
    productId: number;
    countryId: number;
    amount: number;
    currency: string;
}

export type PriceCalculationMethod = 'USE_PVPR' | 'FIXED_PRICE' | 'DISCOUNT_FROM_PVPR_PERCENTAGE' | 'DISCOUNT_FROM_PVPR_AMOUNT' | 'MARKUP_FROM_COST';

export interface PricingRule {
    id: number | 'new';
    name: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    scope: {
        productIds: number[] | null; // null means all
        platformIds: number[] | null; // null means all
        countryIds: number[] | null; // null means all
    };
    calculation: {
        method: PriceCalculationMethod;
        value?: number;
    };
}

export interface Price {
    id: number | 'new';
    productId: number;
    platformId: number;
    countryId: number;
    amount: number; // Can be manually overridden
    currency: string;
    discountInfo?: string;
    lastUpdatedBy?: 'manual' | 'rule' | 'flash_deal';
    discountPercentage?: number | null;
    couponPercentage?: number | null;
}

export type PriceHistoryLogSourceType = 'rule' | 'manual' | 'pvpr' | 'flash_deal';

export interface PriceHistoryLogSource {
    type: PriceHistoryLogSourceType;
    id: number;
    name: string;
}

export interface PriceHistoryLog {
    id: number | 'new';
    timestamp: string; // ISO String
    userId: number;
    userName: string;
    productId: number;
    platformId: number;
    countryId: number;
    oldAmount: number | null;
    newAmount: number;
    oldDiscountPercentage?: number | null;
    newDiscountPercentage?: number | null;
    oldCouponPercentage?: number | null;
    newCouponPercentage?: number | null;
    currency: string;
    source: PriceHistoryLogSource;
    trigger: 'manual_rule_execution' | 'manual_override' | 'flash_deal_start' | 'flash_deal_end';
}

export type AmazonFlashDealStatus = 'Borrador' | 'Programada' | 'Activa' | 'Finalizada' | 'Cancelada';

export interface AmazonFlashDeal {
    id: number | 'new';
    name: string; 
    productId: number;
    platformId: number; 
    asin: string;
    
    startDate: string; // ISO String con hora
    endDate: string; // ISO String con hora

    dealPrice: number;
    currency: string;
    
    status: AmazonFlashDealStatus;

    stockLimit?: number; 
    unitsSold?: number; 
    totalRevenue?: number;

    reusedFromDealId?: number; 
}
// --- END PRICING MODELS ---

// --- START Import/Export ---
export interface PublicationFieldValidation {
    required?: boolean;
    maxLength?: number;
    mobileMaxLength?: number;
}

export interface PublicationField {
    id: string;
    columnHeader: string;
    mappingType: 'static' | 'mapped' | 'formula';
    value: string; // static value, placeholder path, or formula
    validation?: PublicationFieldValidation;
}

export interface ImportExportTemplate {
    id: number | 'new';
    name: string;
    entity: 'products';
    templateType: 'publication' | 'import' | 'amazonContent';
    isPreset?: boolean;
    platformId?: number;
    fields: PublicationField[];
}
// --- END Import/Export ---

// --- START AI ---
export type PromptableEntity = 'general' | 'products' | 'etiquetas' | 'ingredients' | 'productNotifications' | 'competitorProducts' | 'knowledgeBaseEntries';
export interface PromptTemplate {
    id: number | 'new';
    name: string;
    category: 'Revisión' | 'Traducción' | 'Generación' | 'Análisis' | 'Optimización' | 'Generación de Prompt de Imagen' | 'Generación de Prompt de Vídeo';
    entityType: PromptableEntity;
    description: string;
    template: string;
}
// --- END AI ---

// --- START Tasks/Projects ---
export type TaskStatus = 'Pendiente' | 'En Proceso' | 'En Revisión' | 'Bloqueada' | 'Completada';
export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';
export type TaskRecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TaskRecurrence {
    frequency: TaskRecurrenceFrequency;
    interval: number; // e.g., every 2 weeks
}

export interface LinkedEntity {
    entityType: keyof AppData;
    entityId: number;
    entityName: string;
}

export interface Task {
    id: number | 'new';
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: number;
    creatorId: number;
    dueDate?: string; // ISO String (Date only)
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    linkedEntity: LinkedEntity;
    tags?: string[];
    estimatedHours?: number;
    loggedHours?: number;
    blocks?: number[];
    isBlockedBy?: number[];
    recurrence?: TaskRecurrence;
}

export interface TaskComment {
    id: number | 'new';
    taskId: number;
    authorId: number;
    text: string;
    createdAt: string; // ISO String
}

export interface TemplateTask {
    title: string;
    description: string;
    defaultAssigneeId: number;
    dueDaysOffset: number;
    templateSubtasks?: string[];
}

export type TaskSchemaTriggerType = 'manual' | 'entity_creation' | 'entity_status_change';

export interface TaskSchemaTrigger {
    type: TaskSchemaTriggerType;
    // For 'entity_creation' and 'entity_status_change'
// FIX: Added 'batches' to allow schemas to be triggered from this entity type.
    entityType?: Extract<keyof AppData, 'products' | 'etiquetas' | 'batches'>;
    // For 'entity_status_change'
    targetStatus?: string; // e.g., 'Aprobado en imprenta'
}

export interface TaskSchema {
    id: number | 'new';
    name: string;
    description: string;
    trigger: TaskSchemaTrigger;
    templateTasks: TemplateTask[];
}

export interface Proyecto {
    id: number | 'new';
    name: string;
    taskSchemaId: number;
    status: 'Activo' | 'Completado' | 'Pausado';
    createdAt: string;
    ownerId: number;
}
// --- END Tasks/Projects ---

// --- START Video Studio ---
export type SequenceTemplateCategory = 'Introducciones' | 'Demostraciones' | 'Cierres' | 'Genérico';
export interface SequenceTemplate {
    id: number | 'new';
    name: string;
    category: SequenceTemplateCategory;
    description: string;
    defaultDuration: number;
}

export interface VideoCompositionTemplate {
    id: number | 'new';
    name: string;
    description: string;
    sequenceTemplateIds: (number | string)[];
}

export interface MediaAsset {
    id: number | 'new';
    name: string;
    description?: string;
    tags: string[];
    duration: number;
    imageUrl: string;
    videoUrl: string;
    voiceoverScript?: string;
}

export type VideoTransition = 'Corte' | 'Fundido';
export type VideoProjectStatus = 'Planificación' | 'Storyboard' | 'Revisión' | 'Acabado' | 'Publicado';

export interface ProjectSequence {
    id: string;
    order: number;
    sequenceTemplateId?: number;
    mediaAssetId?: number;
    duration: number;
    voiceoverScript: string;
    image: {
        userDescription: string;
        finalPrompt: string;
        sourceUrl: string;
        generatedUrl?: string;
    };
    video: {
        userDescription: string;
        finalPrompt: string;
        sourceUrl: string;
        generatedUrl?: string;
    };
    transitionToNext: VideoTransition;
}

export interface VideoProject {
    id: number | 'new';
    name: string;
    description?: string;
    tags?: string[];
    plannedCreationDate?: string;
    plannedPublicationDate?: string;
    productId?: number;
    countryId?: number;
    languageCode?: LanguageCode;
    compositionTemplateId?: number;
    status: VideoProjectStatus;
    sequences: ProjectSequence[];
    globalSettings: {
        musicPrompt?: string;
        useSubtitles?: boolean;
        finalVoiceoverUrl?: string;
        finalVideoUrl?: string;
    };
    createdAt: string;
    updatedAt: string;
}
// --- END Video Studio ---

// --- START Manufacturing & Logistics ---
export interface BatchDocument {
    name: string;
    url: string;
}

export interface Batch {
    id: number | 'new';
    purchaseOrderId: number;
    productId: number;
    labelId?: number;
    batchNumber: string;
    status: 'En producción' | 'En tránsito' | 'Disponible' | 'Agotado';
    manufacturingDate: string; // ISO String (Date only)
    expiryDate?: string; // ISO String (Date only)
    unitsManufactured: number;
    unitsAvailable: number;
    technicalDataSheet?: BatchDocument;
    manufacturingCertificate?: BatchDocument;
}

export interface PurchaseOrder {
    id: number | 'new';
    orderNumber: string;
    manufacturerName: string;
    status: 'Borrador' | 'Enviado a Fabricante' | 'Parcialmente Recibido' | 'Completado' | 'Cancelado';
    orderDate: string; // ISO String (Date only)
    expectedDeliveryDate: string; // ISO String (Date only)
    productId: number;
    unitsRequested: number;
    costPerUnit: number;
    totalCost: number;
}

export interface DeliveryNote {
    id: number | 'new';
    purchaseOrderId: number;
    deliveryNoteNumber: string;
    unitsReceived: number;
    receivedDate: string; // ISO String (Date only)
    documentUrl?: string;
}

export interface Invoice {
    id: number | 'new';
    purchaseOrderId: number;
    invoiceNumber: string;
    amount: number;
    currency: string;
    issueDate: string; // ISO String (Date only)
    dueDate: string; // ISO String (Date only)
    status: 'Pendiente de Pago' | 'Pagada' | 'Vencida';
    documentUrl?: string;
}
// --- END Manufacturing & Logistics ---

// --- START Core Entities ---
export type MeasureUnit = 'mg' | 'g' | 'µg' | 'UI';

export interface VRN {
    baseQuantity: number;
    baseUnit: MeasureUnit;
    percentage: number;
}

export interface IngredientCountryDetail {
    countryId: number;
    name: string;
    status: 'Permitido' | 'Prohibido' | 'Con restricciones' | 'En estudio';
    permittedClaims: string[];
    labelDisclaimers: string[];
    vrn?: VRN;
    sourceInfo?: string;
}

export interface Ingredient {
    id: number | 'new';
    latinName: string;
    type: 'Componente Activo' | 'Excipiente' | '';
    measureUnit: MeasureUnit;
    countryDetails: IngredientCountryDetail[];
}

export interface ProductCompositionItem {
    ingredientId: number;
    quantity: number;
    form: string;
    vrnPercentages: { countryId: number; value: number | null }[];
}

export interface Product {
    id: number | 'new';
    name: string;
    sku: string;
    marca?: string;
    status: 'En Estudio' | 'Activo' | 'Inactivo';
    format?: string;
    asin?: string;
    ean?: string;
    units?: number;
    mainImageUrl?: string;
    amazonContents: AmazonContent[];
    publicationPlanning?: PublicationPlanning[];
    shopifyContent?: ShopifyContent;
    layer2Content?: Layer2Content;
    competitorProductIds?: number[];
    composition?: ProductCompositionItem[];
    videoIds: (number | string)[];
    allowedCountryIds?: number[];
    envaseId?: number;

    // Marketing fields
    puntosFuertes?: string;
    puntosDebiles?: string;
    analisisCompetencia?: string;
    resenasIaAmazon?: string;
    publicoObjetivo?: string;
    keySellingPoints?: string;
    miniNarrativa?: string;
    sugerenciasUso?: string;
    ideasContenidoRedes?: string;
    ejemplosTestimonios?: string;
    
    // Label fields
    pesoNetoEtiqueta?: string;
    pesoNeto?: number;
    pesoEnvio?: number;
    modoUso?: string;
    unidadToma?: string;
    unidadesPorToma?: number;
    beneficiosGenericos?: string[];
    otrosNombres?: string[];
    informacionNutricional?: string;
    alergenos?: string[];
    expiryInMonths?: number;
    unitWeight?: number;
    recommendedDailyDose?: string;
    netQuantityLabel?: string;
    netQuantityNutritionalInfo?: string;
    conservacion?: string;
    caracteristicasProducto?: string[];
    duracionProducto?: { valor: number; unidad: 'dias' | 'semanas' | 'meses' | 'años' };
    envaseColor?: string;
    tapaColor?: string;
    hasRepercap?: boolean;
    isRepercapScreenPrinted?: boolean;
    barcodeImageUrl?: string;
    amazonAttributes?: AmazonAttributes;
}

export interface Country {
    id: number | 'new';
    name: string;
    iso: string;
    notificationProcess?: string;
    requiredDocuments?: string;
}

export interface Platform {
    id: number | 'new';
    name: string;
    countryId: number;
    type: 'Marketplace' | 'Reventa' | 'Web propia' | '';
    status: 'En estudio' | 'En apertura' | 'Activa' | 'Cerrada';
    shipsBy: 'Platform' | 'Us';
    url?: string;
    orderSystemUrl?: string;
    orderSystemUser?: string;
    orderSystemPassword?: string;
    orderSystemDetails?: string;
    attachedDocuments?: DocumentAttachment[];
}

export interface Envase {
    id: number | 'new';
    name: string;
    tipo?: 'Bote' | 'Doypack' | 'Blister' | 'Caja';
    fotoUrl?: string;
    height?: number;
    width?: number;
    length?: number;
    peso?: number;
    capacidad?: string;
}

export interface Video {
    id: number | 'new';
    name: string;
    url: string;
    platform: string;
    type: 'Producto' | 'Marca' | 'Testimonio' | 'Educativo';
    duration: number;
    status: 'Planificado' | 'Grabado' | 'En Edición' | 'Publicado' | 'Archivado';
    countryId: number;
    productIds?: number[];
}

export type EtiquetaStatus = 'Pendiente enviar a imprenta' | 'Enviado a imprenta' | 'Aprobado en imprenta' | 'En el mercado' | 'Obsoleto';
export interface LabelIngredientTranslation {
    lang: LanguageCode;
    name: string;
    vrn: string; // VRN as a string (e.g., "1250%")
    permittedClaims: string[];
    labelDisclaimers: string[];
}
export interface LabelIngredient {
    ingredientId: number;
    quantity: number;
    measureUnit: MeasureUnit;
    translations: LabelIngredientTranslation[];
}
export interface LabelContent {
    lang: LanguageCode;
    productName: string;
    contenido?: string;
    alergenos?: string[];
}
export interface Etiqueta {
    id: number | 'new';
    identifier: string;
    productId?: number;
    createdAt: string; // ISO string
    status: EtiquetaStatus;
    creationType: 'Etiqueta 0' | 'Remplazo';
    batchNumber?: string;
    mainAttachment?: { name: string, url: string };
    additionalAttachments?: DocumentAttachment[];
    contentByLanguage: LabelContent[];
    ingredientSnapshot: LabelIngredient[];
}

export interface Translation {
    lang: LanguageCode;
    value: string;
}
export interface TranslationTerm {
    id: number | 'new';
    spanish: string;
    translations: Translation[];
}
// --- END Core Entities ---

// --- START System & Admin ---
export type Role = 'Administrador' | 'Nivel 2' | 'Nivel 3';
export interface User {
    id: number | 'new';
    name: string;
    email: string;
    password?: string;
    role: Role;
    allowedViews?: string[];
}
export interface CustomerSupportTicket {
    id: number | 'new';
    customerName: string;
    channel: 'Email' | 'Amazon' | 'Web' | 'Redes Sociales';
    status: 'Abierto' | 'Respondido' | 'Cerrado';
    entryDate: string; // ISO String (Date only)
}

export interface ProductNotification {
    id: number | 'new';
    productId: number;
    countryId: number;
    status: 'Pendiente' | 'En proceso' | 'Notificado' | 'No necesario' | 'Espera de decision' | 'No Notificable' | 'Pendiente nueva notificación';
    notifiedBy: 'Interno' | 'Agencia Externa' | '';
    agencyName?: string;
    notificationDate?: string;
    costGovernmentFee?: number;
    costAgencyFee?: number;
    checklist?: string;
    attachedFiles?: DocumentAttachment[];
}

export interface ProductPlatformStatus {
    id: string; // e.g., 'product1-platform1'
    productId: number;
    platformId: number;
    status: 'Publicado' | 'Planificado' | 'Pendiente decision' | 'Retirado' | 'N/A';
    lastChecked: string; // ISO String
}

export interface CompetitorBrand {
    id: number | 'new';
    name: string;
    logoUrl?: string;
    productTypology?: string;
}

export interface CompetitorProductSnapshot {
    id: number | 'new';
    competitorProductId?: number;
    createdAt: string; // ISO String
    amazonTitle: string;
    amazonDescription: string;
    amazonBulletPoints: string[];
    amazonPhotos: { url: string }[];
    titleAnalysis: string;
    descriptionAnalysis: string;
    aPlusAnalysis: string;
    infographicsAnalysis: string;
    reviewsAnalysis: string;
}

export interface CompetitorProduct {
    id: number | 'new';
    competitorBrandId: number | null;
    countryId: number;
    asin: string;
    name: string;
    typology?: string;
    competesWith?: string;
    snapshots: CompetitorProductSnapshot[];
}
export interface ChangeDetail {
    field: string;
    fieldName: string;
    oldValue: any;
    newValue: any;
}
// FIX: Added 'batches' to LoggedEntityType to allow logging for this entity.
export type LoggedEntityType = 'products' | 'etiquetas' | 'ingredients' | 'productNotifications' | 'knowledgeBaseEntries' | 'videos' | 'batches';
export interface LogEntry {
    id: number | 'new';
    timestamp: string; // ISO String
    userId: number;
    userName: string;
    actionType: 'Creación' | 'Actualización' | 'Eliminación';
    entityType: LoggedEntityType;
    entityId: number | string;
    entityName: string;
    changes?: ChangeDetail[];
}

export interface ImportJobChangeLogEntry {
    action: 'Creación' | 'Actualización';
    entityType: 'products';
    entityId: number | string;
    beforeState?: Entity;
}

export interface ImportJobChangeLog {
    id: number;
    jobId: number;
    changes: ImportJobChangeLogEntry[];
}

export interface ImportJob {
    id: number | 'new';
    timestamp: string; // ISO String
    userId: number;
    userName: string;
    templateId: number;
    status: 'Completado' | 'Fallido' | 'Deshecho';
    summary: string;
    changeLogId?: number;
}
export interface ExportJob {
    id: number | 'new';
    timestamp: string; // ISO String
    userId: number;
    userName: string;
    templateId: number;
    summary: string;
}
// --- END System & Admin ---


// --- Main AppData and Entity Type ---
export interface AppData {
    products: Product[];
    countries: Country[];
    platforms: Platform[];
    tickets: CustomerSupportTicket[];
    envases: Envase[];
    etiquetas: Etiqueta[];
    videos: Video[];
    ingredients: Ingredient[];
    notes: Note[];
    translationTerms: TranslationTerm[];
    productNotifications: ProductNotification[];
    productPlatformStatuses: ProductPlatformStatus[];
    competitorBrands: CompetitorBrand[];
    competitorProducts: CompetitorProduct[];
    contentRecipes: ContentRecipe[];
    promptTemplates: PromptTemplate[];
    logs: LogEntry[];
    importExportTemplates: ImportExportTemplate[];
    importJobs: ImportJob[];
    exportJobs: ExportJob[];
    importJobChangeLogs: ImportJobChangeLog[];
    aiSettings: AISettings;
    pvprs: Pvpr[];
    prices: Price[];
    pricingRules: PricingRule[];
    priceHistoryLogs: PriceHistoryLog[];
    amazonFlashDeals: AmazonFlashDeal[];
    users: User[];
    tasks: Task[];
    taskComments: TaskComment[];
    taskSchemas: TaskSchema[];
    subtasks: Subtask[];
    proyectos: Proyecto[];
    knowledgeBaseEntries: KnowledgeBaseEntry[];
    knowledgeBaseUsages: KnowledgeBaseUsage[];
    sequenceTemplates: SequenceTemplate[];
    videoCompositionTemplates: VideoCompositionTemplate[];
    videoProjects: VideoProject[];
    mediaAssets: MediaAsset[];
    // FIX: Added missing manufacturing-related entities to the main data structure.
    purchaseOrders: PurchaseOrder[];
    batches: Batch[];
    deliveryNotes: DeliveryNote[];
    invoices: Invoice[];
}

// FIX: Added missing manufacturing-related entities to the global Entity union type.
export type Entity = Product | Country | Platform | CustomerSupportTicket | Envase | Etiqueta | Video | Ingredient | Note | TranslationTerm | ProductNotification | CompetitorBrand | CompetitorProduct | ContentRecipe | LogEntry | PromptTemplate | ImportExportTemplate | ExportJob | ImportJob | ImportJobChangeLog | Pvpr | Price | PricingRule | PriceHistoryLog | AmazonFlashDeal | User | Task | TaskComment | TaskSchema | Subtask | Proyecto | KnowledgeBaseEntry | KnowledgeBaseUsage | SequenceTemplate | VideoProject | MediaAsset | VideoCompositionTemplate | PurchaseOrder | Batch | DeliveryNote | Invoice;
export type EntityType = keyof AppData;