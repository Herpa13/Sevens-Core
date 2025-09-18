"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISettingsSchema = exports.ProductPlatformStatusSchema = exports.InvoiceSchema = exports.DeliveryNoteSchema = exports.BatchSchema = exports.PurchaseOrderSchema = exports.VideoCompositionTemplateSchema = exports.MediaAssetSchema = exports.VideoProjectSchema = exports.SequenceTemplateSchema = exports.KnowledgeBaseUsageSchema = exports.KnowledgeBaseEntrySchema = exports.ProyectoSchema = exports.SubtaskSchema = exports.TaskSchemaSchema = exports.TaskCommentSchema = exports.TaskSchema = exports.UserSchema = exports.AmazonFlashDealSchema = exports.PriceHistoryLogSchema = exports.PricingRuleSchema = exports.PriceSchema = exports.PvprSchema = exports.ImportJobChangeLogSchema = exports.ImportJobSchema = exports.ExportJobSchema = exports.ImportExportTemplateSchema = exports.PromptTemplateSchema = exports.LogEntrySchema = exports.ContentRecipeSchema = exports.CompetitorProductSchema = exports.CompetitorBrandSchema = exports.ProductNotificationSchema = exports.TranslationTermSchema = exports.NoteSchema = exports.IngredientSchema = exports.EtiquetaSchema = exports.CustomerSupportTicketSchema = void 0;
const zod_1 = require("zod");
exports.CustomerSupportTicketSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    customerName: zod_1.z.string(),
    channel: zod_1.z.union([
        zod_1.z.literal("Email"),
        zod_1.z.literal("Amazon"),
        zod_1.z.literal("Web"),
        zod_1.z.literal("Redes Sociales"),
    ]),
    status: zod_1.z.union([
        zod_1.z.literal("Abierto"),
        zod_1.z.literal("Respondido"),
        zod_1.z.literal("Cerrado"),
    ]),
    entryDate: zod_1.z.string(),
});
const etiquetaStatusSchema = zod_1.z.union([
    zod_1.z.literal("Pendiente enviar a imprenta"),
    zod_1.z.literal("Enviado a imprenta"),
    zod_1.z.literal("Aprobado en imprenta"),
    zod_1.z.literal("En el mercado"),
    zod_1.z.literal("Obsoleto"),
]);
const documentAttachmentSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    name: zod_1.z.string(),
    url: zod_1.z.string(),
    comment: zod_1.z.string().optional(),
});
const languageCodeSchema = zod_1.z.union([
    zod_1.z.literal("ES"),
    zod_1.z.literal("IT"),
    zod_1.z.literal("FR"),
    zod_1.z.literal("DE"),
    zod_1.z.literal("PT"),
    zod_1.z.literal("SV"),
    zod_1.z.literal("NL"),
    zod_1.z.literal("PL"),
    zod_1.z.literal("EN"),
    zod_1.z.literal("TR"),
]);
const labelContentSchema = zod_1.z.object({
    lang: languageCodeSchema,
    productName: zod_1.z.string(),
    contenido: zod_1.z.string().optional(),
    alergenos: zod_1.z.array(zod_1.z.string()).optional(),
});
const measureUnitSchema = zod_1.z.union([
    zod_1.z.literal("mg"),
    zod_1.z.literal("g"),
    zod_1.z.literal("\u00B5g"),
    zod_1.z.literal("UI"),
]);
const labelIngredientTranslationSchema = zod_1.z.object({
    lang: languageCodeSchema,
    name: zod_1.z.string(),
    vrn: zod_1.z.string(),
    permittedClaims: zod_1.z.array(zod_1.z.string()),
    labelDisclaimers: zod_1.z.array(zod_1.z.string()),
});
const labelIngredientSchema = zod_1.z.object({
    ingredientId: zod_1.z.number(),
    quantity: zod_1.z.number(),
    measureUnit: measureUnitSchema,
    translations: zod_1.z.array(labelIngredientTranslationSchema),
});
exports.EtiquetaSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    identifier: zod_1.z.string(),
    productId: zod_1.z.number().optional(),
    createdAt: zod_1.z.string(),
    status: etiquetaStatusSchema,
    creationType: zod_1.z.union([zod_1.z.literal("Etiqueta 0"), zod_1.z.literal("Remplazo")]),
    batchNumber: zod_1.z.string().optional(),
    mainAttachment: zod_1.z
        .object({
        name: zod_1.z.string(),
        url: zod_1.z.string(),
    })
        .optional(),
    additionalAttachments: zod_1.z.array(documentAttachmentSchema).optional(),
    contentByLanguage: zod_1.z.array(labelContentSchema),
    ingredientSnapshot: zod_1.z.array(labelIngredientSchema),
});
const vrnSchema = zod_1.z.object({
    baseQuantity: zod_1.z.number(),
    baseUnit: measureUnitSchema,
    percentage: zod_1.z.number(),
});
const ingredientCountryDetailSchema = zod_1.z.object({
    countryId: zod_1.z.number(),
    name: zod_1.z.string(),
    status: zod_1.z.union([
        zod_1.z.literal("Permitido"),
        zod_1.z.literal("Prohibido"),
        zod_1.z.literal("Con restricciones"),
        zod_1.z.literal("En estudio"),
    ]),
    permittedClaims: zod_1.z.array(zod_1.z.string()),
    labelDisclaimers: zod_1.z.array(zod_1.z.string()),
    vrn: vrnSchema.optional(),
    sourceInfo: zod_1.z.string().optional(),
});
exports.IngredientSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    latinName: zod_1.z.string(),
    type: zod_1.z.union([
        zod_1.z.literal("Componente Activo"),
        zod_1.z.literal("Excipiente"),
        zod_1.z.literal(""),
    ]),
    measureUnit: measureUnitSchema,
    countryDetails: zod_1.z.array(ingredientCountryDetailSchema),
});
const noteEntityTypeSchema = zod_1.z.union([
    zod_1.z.literal("products"),
    zod_1.z.literal("platforms"),
    zod_1.z.literal("competitorBrands"),
    zod_1.z.literal("etiquetas"),
    zod_1.z.literal("ingredients"),
    zod_1.z.literal("countries"),
    zod_1.z.literal("envases"),
    zod_1.z.literal("competitorProducts"),
    zod_1.z.literal("tasks"),
    zod_1.z.literal("videoProjects"),
    zod_1.z.literal("knowledgeBaseEntries"),
    zod_1.z.literal("batches"),
    zod_1.z.literal("purchaseOrders"),
]);
const noteAttachmentSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    name: zod_1.z.string(),
    url: zod_1.z.string(),
});
exports.NoteSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    entityType: noteEntityTypeSchema,
    entityId: zod_1.z.number(),
    authorName: zod_1.z.string(),
    text: zod_1.z.string(),
    attachments: zod_1.z.array(noteAttachmentSchema).optional(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
    status: zod_1.z.union([zod_1.z.literal("Activa"), zod_1.z.literal("Archivada")]),
    archiveReason: zod_1.z.string().optional(),
});
const translationSchema = zod_1.z.object({
    lang: languageCodeSchema,
    value: zod_1.z.string(),
});
exports.TranslationTermSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    spanish: zod_1.z.string(),
    translations: zod_1.z.array(translationSchema),
});
exports.ProductNotificationSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    productId: zod_1.z.number(),
    countryId: zod_1.z.number(),
    status: zod_1.z.union([
        zod_1.z.literal("Pendiente"),
        zod_1.z.literal("En proceso"),
        zod_1.z.literal("Notificado"),
        zod_1.z.literal("No necesario"),
        zod_1.z.literal("Espera de decision"),
        zod_1.z.literal("No Notificable"),
        zod_1.z.literal("Pendiente nueva notificaci\u00F3n"),
    ]),
    notifiedBy: zod_1.z.union([
        zod_1.z.literal("Interno"),
        zod_1.z.literal("Agencia Externa"),
        zod_1.z.literal(""),
    ]),
    agencyName: zod_1.z.string().optional(),
    notificationDate: zod_1.z.string().optional(),
    costGovernmentFee: zod_1.z.number().optional(),
    costAgencyFee: zod_1.z.number().optional(),
    checklist: zod_1.z.string().optional(),
    attachedFiles: zod_1.z.array(documentAttachmentSchema).optional(),
});
exports.CompetitorBrandSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    logoUrl: zod_1.z.string().optional(),
    productTypology: zod_1.z.string().optional(),
});
const competitorProductSnapshotSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    competitorProductId: zod_1.z.number().optional(),
    createdAt: zod_1.z.string(),
    amazonTitle: zod_1.z.string(),
    amazonDescription: zod_1.z.string(),
    amazonBulletPoints: zod_1.z.array(zod_1.z.string()),
    amazonPhotos: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string(),
    })),
    titleAnalysis: zod_1.z.string(),
    descriptionAnalysis: zod_1.z.string(),
    aPlusAnalysis: zod_1.z.string(),
    infographicsAnalysis: zod_1.z.string(),
    reviewsAnalysis: zod_1.z.string(),
});
exports.CompetitorProductSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    competitorBrandId: zod_1.z.number().nullable(),
    countryId: zod_1.z.number(),
    asin: zod_1.z.string(),
    name: zod_1.z.string(),
    typology: zod_1.z.string().optional(),
    competesWith: zod_1.z.string().optional(),
    snapshots: zod_1.z.array(competitorProductSnapshotSchema),
});
const contentPartTypeSchema = zod_1.z.union([
    zod_1.z.literal("field"),
    zod_1.z.literal("static"),
]);
const contentPartReferenceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: contentPartTypeSchema,
    sourceType: zod_1.z
        .union([
        zod_1.z.literal("General"),
        zod_1.z.literal("Marketing"),
        zod_1.z.literal("Amazon"),
        zod_1.z.literal("Composici\u00F3n"),
    ])
        .optional(),
    sourceKey: zod_1.z.string().optional(),
    value: zod_1.z.string().optional(),
});
exports.ContentRecipeSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    target: zod_1.z.union([zod_1.z.literal("title"), zod_1.z.literal("description")]),
    parts: zod_1.z.array(contentPartReferenceSchema),
});
const loggedEntityTypeSchema = zod_1.z.union([
    zod_1.z.literal("products"),
    zod_1.z.literal("etiquetas"),
    zod_1.z.literal("ingredients"),
    zod_1.z.literal("productNotifications"),
    zod_1.z.literal("knowledgeBaseEntries"),
    zod_1.z.literal("videos"),
    zod_1.z.literal("batches"),
]);
const changeDetailSchema = zod_1.z.object({
    field: zod_1.z.string(),
    fieldName: zod_1.z.string(),
    oldValue: zod_1.z.any(),
    newValue: zod_1.z.any(),
});
exports.LogEntrySchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    timestamp: zod_1.z.string(),
    userId: zod_1.z.number(),
    userName: zod_1.z.string(),
    actionType: zod_1.z.union([
        zod_1.z.literal("Creaci\u00F3n"),
        zod_1.z.literal("Actualizaci\u00F3n"),
        zod_1.z.literal("Eliminaci\u00F3n"),
    ]),
    entityType: loggedEntityTypeSchema,
    entityId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    entityName: zod_1.z.string(),
    changes: zod_1.z.array(changeDetailSchema).optional(),
});
const promptableEntitySchema = zod_1.z.union([
    zod_1.z.literal("general"),
    zod_1.z.literal("products"),
    zod_1.z.literal("etiquetas"),
    zod_1.z.literal("ingredients"),
    zod_1.z.literal("productNotifications"),
    zod_1.z.literal("competitorProducts"),
    zod_1.z.literal("knowledgeBaseEntries"),
]);
exports.PromptTemplateSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    category: zod_1.z.union([
        zod_1.z.literal("Revisi\u00F3n"),
        zod_1.z.literal("Traducci\u00F3n"),
        zod_1.z.literal("Generaci\u00F3n"),
        zod_1.z.literal("An\u00E1lisis"),
        zod_1.z.literal("Optimizaci\u00F3n"),
        zod_1.z.literal("Generaci\u00F3n de Prompt de Imagen"),
        zod_1.z.literal("Generaci\u00F3n de Prompt de V\u00EDdeo"),
    ]),
    entityType: promptableEntitySchema,
    description: zod_1.z.string(),
    template: zod_1.z.string(),
});
const publicationFieldValidationSchema = zod_1.z.object({
    required: zod_1.z.boolean().optional(),
    maxLength: zod_1.z.number().optional(),
    mobileMaxLength: zod_1.z.number().optional(),
});
const publicationFieldSchema = zod_1.z.object({
    id: zod_1.z.string(),
    columnHeader: zod_1.z.string(),
    mappingType: zod_1.z.union([
        zod_1.z.literal("static"),
        zod_1.z.literal("mapped"),
        zod_1.z.literal("formula"),
    ]),
    value: zod_1.z.string(),
    validation: publicationFieldValidationSchema.optional(),
});
exports.ImportExportTemplateSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    entity: zod_1.z.literal("products"),
    templateType: zod_1.z.union([
        zod_1.z.literal("publication"),
        zod_1.z.literal("import"),
        zod_1.z.literal("amazonContent"),
    ]),
    isPreset: zod_1.z.boolean().optional(),
    platformId: zod_1.z.number().optional(),
    fields: zod_1.z.array(publicationFieldSchema),
});
exports.ExportJobSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    timestamp: zod_1.z.string(),
    userId: zod_1.z.number(),
    userName: zod_1.z.string(),
    templateId: zod_1.z.number(),
    summary: zod_1.z.string(),
});
exports.ImportJobSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    timestamp: zod_1.z.string(),
    userId: zod_1.z.number(),
    userName: zod_1.z.string(),
    templateId: zod_1.z.number(),
    status: zod_1.z.union([
        zod_1.z.literal("Completado"),
        zod_1.z.literal("Fallido"),
        zod_1.z.literal("Deshecho"),
    ]),
    summary: zod_1.z.string(),
    changeLogId: zod_1.z.number().optional(),
});
const importJobChangeLogEntrySchema = zod_1.z.object({
    action: zod_1.z.union([zod_1.z.literal("Creación"), zod_1.z.literal("Actualización")]),
    entityType: zod_1.z.literal("products"),
    entityId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    beforeState: zod_1.z.any().optional(),
});
exports.ImportJobChangeLogSchema = zod_1.z.object({
    id: zod_1.z.number(),
    jobId: zod_1.z.number(),
    changes: zod_1.z.array(importJobChangeLogEntrySchema),
});
exports.PvprSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    productId: zod_1.z.number(),
    countryId: zod_1.z.number(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
});
exports.PriceSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    productId: zod_1.z.number(),
    platformId: zod_1.z.number(),
    countryId: zod_1.z.number(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    discountInfo: zod_1.z.string().optional(),
    lastUpdatedBy: zod_1.z
        .union([zod_1.z.literal("manual"), zod_1.z.literal("rule"), zod_1.z.literal("flash_deal")])
        .optional(),
    discountPercentage: zod_1.z.number().optional().nullable(),
    couponPercentage: zod_1.z.number().optional().nullable(),
});
const priceCalculationMethodSchema = zod_1.z.union([
    zod_1.z.literal("USE_PVPR"),
    zod_1.z.literal("FIXED_PRICE"),
    zod_1.z.literal("DISCOUNT_FROM_PVPR_PERCENTAGE"),
    zod_1.z.literal("DISCOUNT_FROM_PVPR_AMOUNT"),
    zod_1.z.literal("MARKUP_FROM_COST"),
]);
exports.PricingRuleSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    scope: zod_1.z.object({
        productIds: zod_1.z.array(zod_1.z.number()).nullable(),
        platformIds: zod_1.z.array(zod_1.z.number()).nullable(),
        countryIds: zod_1.z.array(zod_1.z.number()).nullable(),
    }),
    calculation: zod_1.z.object({
        method: priceCalculationMethodSchema,
        value: zod_1.z.number().optional(),
    }),
});
const priceHistoryLogSourceTypeSchema = zod_1.z.union([
    zod_1.z.literal("rule"),
    zod_1.z.literal("manual"),
    zod_1.z.literal("pvpr"),
    zod_1.z.literal("flash_deal"),
]);
const priceHistoryLogSourceSchema = zod_1.z.object({
    type: priceHistoryLogSourceTypeSchema,
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.PriceHistoryLogSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    timestamp: zod_1.z.string(),
    userId: zod_1.z.number(),
    userName: zod_1.z.string(),
    productId: zod_1.z.number(),
    platformId: zod_1.z.number(),
    countryId: zod_1.z.number(),
    oldAmount: zod_1.z.number().nullable(),
    newAmount: zod_1.z.number(),
    oldDiscountPercentage: zod_1.z.number().optional().nullable(),
    newDiscountPercentage: zod_1.z.number().optional().nullable(),
    oldCouponPercentage: zod_1.z.number().optional().nullable(),
    newCouponPercentage: zod_1.z.number().optional().nullable(),
    currency: zod_1.z.string(),
    source: priceHistoryLogSourceSchema,
    trigger: zod_1.z.union([
        zod_1.z.literal("manual_rule_execution"),
        zod_1.z.literal("manual_override"),
        zod_1.z.literal("flash_deal_start"),
        zod_1.z.literal("flash_deal_end"),
    ]),
});
const amazonFlashDealStatusSchema = zod_1.z.union([
    zod_1.z.literal("Borrador"),
    zod_1.z.literal("Programada"),
    zod_1.z.literal("Activa"),
    zod_1.z.literal("Finalizada"),
    zod_1.z.literal("Cancelada"),
]);
exports.AmazonFlashDealSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    productId: zod_1.z.number(),
    platformId: zod_1.z.number(),
    asin: zod_1.z.string(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    dealPrice: zod_1.z.number(),
    currency: zod_1.z.string(),
    status: amazonFlashDealStatusSchema,
    stockLimit: zod_1.z.number().optional(),
    unitsSold: zod_1.z.number().optional(),
    totalRevenue: zod_1.z.number().optional(),
    reusedFromDealId: zod_1.z.number().optional(),
});
const roleSchema = zod_1.z.union([
    zod_1.z.literal("Administrador"),
    zod_1.z.literal("Nivel 2"),
    zod_1.z.literal("Nivel 3"),
]);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string().optional(),
    role: roleSchema,
    allowedViews: zod_1.z.array(zod_1.z.string()).optional(),
});
const taskStatusSchema = zod_1.z.union([
    zod_1.z.literal("Pendiente"),
    zod_1.z.literal("En Proceso"),
    zod_1.z.literal("En Revisi\u00F3n"),
    zod_1.z.literal("Bloqueada"),
    zod_1.z.literal("Completada"),
]);
const taskPrioritySchema = zod_1.z.union([
    zod_1.z.literal("Baja"),
    zod_1.z.literal("Media"),
    zod_1.z.literal("Alta"),
    zod_1.z.literal("Urgente"),
]);
const linkedEntitySchema = zod_1.z.object({
    entityType: zod_1.z.any(),
    entityId: zod_1.z.number(),
    entityName: zod_1.z.string(),
});
const taskRecurrenceFrequencySchema = zod_1.z.union([
    zod_1.z.literal("daily"),
    zod_1.z.literal("weekly"),
    zod_1.z.literal("monthly"),
    zod_1.z.literal("yearly"),
]);
const taskRecurrenceSchema = zod_1.z.object({
    frequency: taskRecurrenceFrequencySchema,
    interval: zod_1.z.number(),
});
exports.TaskSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    assigneeId: zod_1.z.number(),
    creatorId: zod_1.z.number(),
    dueDate: zod_1.z.string().optional(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
    linkedEntity: linkedEntitySchema,
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    estimatedHours: zod_1.z.number().optional(),
    loggedHours: zod_1.z.number().optional(),
    blocks: zod_1.z.array(zod_1.z.number()).optional(),
    isBlockedBy: zod_1.z.array(zod_1.z.number()).optional(),
    recurrence: taskRecurrenceSchema.optional(),
});
exports.TaskCommentSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    taskId: zod_1.z.number(),
    authorId: zod_1.z.number(),
    text: zod_1.z.string(),
    createdAt: zod_1.z.string(),
});
const templateTaskSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    defaultAssigneeId: zod_1.z.number(),
    dueDaysOffset: zod_1.z.number(),
    templateSubtasks: zod_1.z.array(zod_1.z.string()).optional(),
});
const taskSchemaTriggerTypeSchema = zod_1.z.union([
    zod_1.z.literal("manual"),
    zod_1.z.literal("entity_creation"),
    zod_1.z.literal("entity_status_change"),
]);
const taskSchemaTriggerSchema = zod_1.z.object({
    type: taskSchemaTriggerTypeSchema,
    entityType: zod_1.z.union([
        zod_1.z.literal("products"),
        zod_1.z.literal("etiquetas"),
        zod_1.z.literal("batches"),
    ]).optional(),
    targetStatus: zod_1.z.string().optional(),
});
exports.TaskSchemaSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    trigger: taskSchemaTriggerSchema,
    templateTasks: zod_1.z.array(templateTaskSchema),
});
exports.SubtaskSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    taskId: zod_1.z.number(),
    name: zod_1.z.string(),
    isCompleted: zod_1.z.boolean(),
    assigneeId: zod_1.z.number().optional(),
    dueDate: zod_1.z.string().optional(),
});
exports.ProyectoSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    taskSchemaId: zod_1.z.number(),
    status: zod_1.z.union([
        zod_1.z.literal("Activo"),
        zod_1.z.literal("Completado"),
        zod_1.z.literal("Pausado"),
    ]),
    createdAt: zod_1.z.string(),
    ownerId: zod_1.z.number(),
});
const knowledgeBaseEntryTypeSchema = zod_1.z.union([
    zod_1.z.literal("Texto"),
    zod_1.z.literal("Archivo"),
    zod_1.z.literal("Enlace"),
]);
const knowledgeBaseCategorySchema = zod_1.z.union([
    zod_1.z.literal("Textos Legales"),
    zod_1.z.literal("Gu\u00EDas de Marca"),
    zod_1.z.literal("Marketing"),
    zod_1.z.literal("Certificados"),
    zod_1.z.literal("General"),
    zod_1.z.literal("Buenas Pr\u00E1cticas"),
    zod_1.z.literal("Gu\u00EDas de Uso"),
]);
const knowledgeBaseEntryStatusSchema = zod_1.z.union([
    zod_1.z.literal("Borrador"),
    zod_1.z.literal("En Revisi\u00F3n"),
    zod_1.z.literal("Aprobado"),
    zod_1.z.literal("Archivado"),
]);
exports.KnowledgeBaseEntrySchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    entryType: knowledgeBaseEntryTypeSchema,
    category: knowledgeBaseCategorySchema,
    tags: zod_1.z.array(zod_1.z.string()),
    content: zod_1.z.object({
        text: zod_1.z.string().optional(),
        files: zod_1.z.array(documentAttachmentSchema).optional(),
        url: zod_1.z.string().optional(),
    }),
    status: knowledgeBaseEntryStatusSchema,
    version: zod_1.z.number(),
    parentId: zod_1.z.number().nullable(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.KnowledgeBaseUsageSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    entryId: zod_1.z.number(),
    entryVersion: zod_1.z.number(),
    entityType: zod_1.z.any(),
    entityId: zod_1.z.number(),
    usedAt: zod_1.z.string(),
    userId: zod_1.z.number(),
});
const sequenceTemplateCategorySchema = zod_1.z.union([
    zod_1.z.literal("Introducciones"),
    zod_1.z.literal("Demostraciones"),
    zod_1.z.literal("Cierres"),
    zod_1.z.literal("Gen\u00E9rico"),
]);
exports.SequenceTemplateSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    category: sequenceTemplateCategorySchema,
    description: zod_1.z.string(),
    defaultDuration: zod_1.z.number(),
});
const videoProjectStatusSchema = zod_1.z.union([
    zod_1.z.literal("Planificaci\u00F3n"),
    zod_1.z.literal("Storyboard"),
    zod_1.z.literal("Revisi\u00F3n"),
    zod_1.z.literal("Acabado"),
    zod_1.z.literal("Publicado"),
]);
const videoTransitionSchema = zod_1.z.union([
    zod_1.z.literal("Corte"),
    zod_1.z.literal("Fundido"),
]);
const projectSequenceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    order: zod_1.z.number(),
    sequenceTemplateId: zod_1.z.number().optional(),
    mediaAssetId: zod_1.z.number().optional(),
    duration: zod_1.z.number(),
    voiceoverScript: zod_1.z.string(),
    image: zod_1.z.object({
        userDescription: zod_1.z.string(),
        finalPrompt: zod_1.z.string(),
        sourceUrl: zod_1.z.string(),
        generatedUrl: zod_1.z.string().optional(),
    }),
    video: zod_1.z.object({
        userDescription: zod_1.z.string(),
        finalPrompt: zod_1.z.string(),
        sourceUrl: zod_1.z.string(),
        generatedUrl: zod_1.z.string().optional(),
    }),
    transitionToNext: videoTransitionSchema,
});
exports.VideoProjectSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    plannedCreationDate: zod_1.z.string().optional(),
    plannedPublicationDate: zod_1.z.string().optional(),
    productId: zod_1.z.number().optional(),
    countryId: zod_1.z.number().optional(),
    languageCode: languageCodeSchema.optional(),
    compositionTemplateId: zod_1.z.number().optional(),
    status: videoProjectStatusSchema,
    sequences: zod_1.z.array(projectSequenceSchema),
    globalSettings: zod_1.z.object({
        musicPrompt: zod_1.z.string().optional(),
        useSubtitles: zod_1.z.boolean().optional(),
        finalVoiceoverUrl: zod_1.z.string().optional(),
        finalVideoUrl: zod_1.z.string().optional(),
    }),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.MediaAssetSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()),
    duration: zod_1.z.number(),
    imageUrl: zod_1.z.string(),
    videoUrl: zod_1.z.string(),
    voiceoverScript: zod_1.z.string().optional(),
});
exports.VideoCompositionTemplateSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    sequenceTemplateIds: zod_1.z.array(zod_1.z.union([zod_1.z.number(), zod_1.z.string()])),
});
exports.PurchaseOrderSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    orderNumber: zod_1.z.string(),
    manufacturerName: zod_1.z.string(),
    status: zod_1.z.union([
        zod_1.z.literal("Borrador"),
        zod_1.z.literal("Enviado a Fabricante"),
        zod_1.z.literal("Parcialmente Recibido"),
        zod_1.z.literal("Completado"),
        zod_1.z.literal("Cancelado"),
    ]),
    orderDate: zod_1.z.string(),
    expectedDeliveryDate: zod_1.z.string(),
    productId: zod_1.z.number(),
    unitsRequested: zod_1.z.number(),
    costPerUnit: zod_1.z.number(),
    totalCost: zod_1.z.number(),
});
const batchDocumentSchema = zod_1.z.object({
    name: zod_1.z.string(),
    url: zod_1.z.string(),
});
exports.BatchSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    purchaseOrderId: zod_1.z.number(),
    productId: zod_1.z.number(),
    labelId: zod_1.z.number().optional(),
    batchNumber: zod_1.z.string(),
    status: zod_1.z.union([
        zod_1.z.literal("En producci\u00F3n"),
        zod_1.z.literal("En tr\u00E1nsito"),
        zod_1.z.literal("Disponible"),
        zod_1.z.literal("Agotado"),
    ]),
    manufacturingDate: zod_1.z.string(),
    expiryDate: zod_1.z.string().optional(),
    unitsManufactured: zod_1.z.number(),
    unitsAvailable: zod_1.z.number(),
    technicalDataSheet: batchDocumentSchema.optional(),
    manufacturingCertificate: batchDocumentSchema.optional(),
});
exports.DeliveryNoteSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    purchaseOrderId: zod_1.z.number(),
    deliveryNoteNumber: zod_1.z.string(),
    unitsReceived: zod_1.z.number(),
    receivedDate: zod_1.z.string(),
    documentUrl: zod_1.z.string().optional(),
});
exports.InvoiceSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal("new")]),
    purchaseOrderId: zod_1.z.number(),
    invoiceNumber: zod_1.z.string(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    issueDate: zod_1.z.string(),
    dueDate: zod_1.z.string(),
    status: zod_1.z.union([
        zod_1.z.literal("Pendiente de Pago"),
        zod_1.z.literal("Pagada"),
        zod_1.z.literal("Vencida"),
    ]),
    documentUrl: zod_1.z.string().optional(),
});
exports.ProductPlatformStatusSchema = zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.number(),
    platformId: zod_1.z.number(),
    status: zod_1.z.union([
        zod_1.z.literal("Publicado"),
        zod_1.z.literal("Planificado"),
        zod_1.z.literal("Pendiente decision"),
        zod_1.z.literal("Retirado"),
        zod_1.z.literal("N/A"),
    ]),
    lastChecked: zod_1.z.string(),
});
exports.AISettingsSchema = zod_1.z.object({
    globalTranslationRules: zod_1.z.string(),
});
