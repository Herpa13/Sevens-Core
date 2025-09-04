import { z } from "zod";

export const CustomerSupportTicketSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  customerName: z.string(),
  channel: z.union([
    z.literal("Email"),
    z.literal("Amazon"),
    z.literal("Web"),
    z.literal("Redes Sociales"),
  ]),
  status: z.union([
    z.literal("Abierto"),
    z.literal("Respondido"),
    z.literal("Cerrado"),
  ]),
  entryDate: z.string(),
});

export type CustomerSupportTicket = z.infer<typeof CustomerSupportTicketSchema>;

const etiquetaStatusSchema = z.union([
  z.literal("Pendiente enviar a imprenta"),
  z.literal("Enviado a imprenta"),
  z.literal("Aprobado en imprenta"),
  z.literal("En el mercado"),
  z.literal("Obsoleto"),
]);

const documentAttachmentSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  url: z.string(),
  comment: z.string().optional(),
});

const languageCodeSchema = z.union([
  z.literal("ES"),
  z.literal("IT"),
  z.literal("FR"),
  z.literal("DE"),
  z.literal("PT"),
  z.literal("SV"),
  z.literal("NL"),
  z.literal("PL"),
  z.literal("EN"),
  z.literal("TR"),
]);

const labelContentSchema = z.object({
  lang: languageCodeSchema,
  productName: z.string(),
  contenido: z.string().optional(),
  alergenos: z.array(z.string()).optional(),
});

const measureUnitSchema = z.union([
  z.literal("mg"),
  z.literal("g"),
  z.literal("\u00B5g"),
  z.literal("UI"),
]);

const labelIngredientTranslationSchema = z.object({
  lang: languageCodeSchema,
  name: z.string(),
  vrn: z.string(),
  permittedClaims: z.array(z.string()),
  labelDisclaimers: z.array(z.string()),
});

const labelIngredientSchema = z.object({
  ingredientId: z.number(),
  quantity: z.number(),
  measureUnit: measureUnitSchema,
  translations: z.array(labelIngredientTranslationSchema),
});

export const EtiquetaSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  identifier: z.string(),
  productId: z.number().optional(),
  createdAt: z.string(),
  status: etiquetaStatusSchema,
  creationType: z.union([z.literal("Etiqueta 0"), z.literal("Remplazo")]),
  batchNumber: z.string().optional(),
  mainAttachment: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  additionalAttachments: z.array(documentAttachmentSchema).optional(),
  contentByLanguage: z.array(labelContentSchema),
  ingredientSnapshot: z.array(labelIngredientSchema),
});

export type Etiqueta = z.infer<typeof EtiquetaSchema>;

const vrnSchema = z.object({
  baseQuantity: z.number(),
  baseUnit: measureUnitSchema,
  percentage: z.number(),
});

const ingredientCountryDetailSchema = z.object({
  countryId: z.number(),
  name: z.string(),
  status: z.union([
    z.literal("Permitido"),
    z.literal("Prohibido"),
    z.literal("Con restricciones"),
    z.literal("En estudio"),
  ]),
  permittedClaims: z.array(z.string()),
  labelDisclaimers: z.array(z.string()),
  vrn: vrnSchema.optional(),
  sourceInfo: z.string().optional(),
});

export const IngredientSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  latinName: z.string(),
  type: z.union([
    z.literal("Componente Activo"),
    z.literal("Excipiente"),
    z.literal(""),
  ]),
  measureUnit: measureUnitSchema,
  countryDetails: z.array(ingredientCountryDetailSchema),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

const noteEntityTypeSchema = z.union([
  z.literal("products"),
  z.literal("platforms"),
  z.literal("competitorBrands"),
  z.literal("etiquetas"),
  z.literal("ingredients"),
  z.literal("countries"),
  z.literal("envases"),
  z.literal("competitorProducts"),
  z.literal("tasks"),
  z.literal("videoProjects"),
  z.literal("knowledgeBaseEntries"),
  z.literal("batches"),
  z.literal("purchaseOrders"),
]);

const noteAttachmentSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  url: z.string(),
});

export const NoteSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  entityType: noteEntityTypeSchema,
  entityId: z.number(),
  authorName: z.string(),
  text: z.string(),
  attachments: z.array(noteAttachmentSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.union([z.literal("Activa"), z.literal("Archivada")]),
  archiveReason: z.string().optional(),
});

export type Note = z.infer<typeof NoteSchema>;

const translationSchema = z.object({
  lang: languageCodeSchema,
  value: z.string(),
});

export const TranslationTermSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  spanish: z.string(),
  translations: z.array(translationSchema),
});

export type TranslationTerm = z.infer<typeof TranslationTermSchema>;

export const ProductNotificationSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  productId: z.number(),
  countryId: z.number(),
  status: z.union([
    z.literal("Pendiente"),
    z.literal("En proceso"),
    z.literal("Notificado"),
    z.literal("No necesario"),
    z.literal("Espera de decision"),
    z.literal("No Notificable"),
    z.literal("Pendiente nueva notificaci\u00F3n"),
  ]),
  notifiedBy: z.union([
    z.literal("Interno"),
    z.literal("Agencia Externa"),
    z.literal(""),
  ]),
  agencyName: z.string().optional(),
  notificationDate: z.string().optional(),
  costGovernmentFee: z.number().optional(),
  costAgencyFee: z.number().optional(),
  checklist: z.string().optional(),
  attachedFiles: z.array(documentAttachmentSchema).optional(),
});

export type ProductNotification = z.infer<typeof ProductNotificationSchema>;

export const CompetitorBrandSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  logoUrl: z.string().optional(),
  productTypology: z.string().optional(),
});

export type CompetitorBrand = z.infer<typeof CompetitorBrandSchema>;

const competitorProductSnapshotSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  competitorProductId: z.number().optional(),
  createdAt: z.string(),
  amazonTitle: z.string(),
  amazonDescription: z.string(),
  amazonBulletPoints: z.array(z.string()),
  amazonPhotos: z.array(
    z.object({
      url: z.string(),
    }),
  ),
  titleAnalysis: z.string(),
  descriptionAnalysis: z.string(),
  aPlusAnalysis: z.string(),
  infographicsAnalysis: z.string(),
  reviewsAnalysis: z.string(),
});

export const CompetitorProductSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  competitorBrandId: z.number().nullable(),
  countryId: z.number(),
  asin: z.string(),
  name: z.string(),
  typology: z.string().optional(),
  competesWith: z.string().optional(),
  snapshots: z.array(competitorProductSnapshotSchema),
});

export type CompetitorProduct = z.infer<typeof CompetitorProductSchema>;

const contentPartTypeSchema = z.union([
  z.literal("field"),
  z.literal("static"),
]);

const contentPartReferenceSchema = z.object({
  id: z.string(),
  type: contentPartTypeSchema,
  sourceType: z
    .union([
      z.literal("General"),
      z.literal("Marketing"),
      z.literal("Amazon"),
      z.literal("Composici\u00F3n"),
    ])
    .optional(),
  sourceKey: z.string().optional(),
  value: z.string().optional(),
});

export const ContentRecipeSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  target: z.union([z.literal("title"), z.literal("description")]),
  parts: z.array(contentPartReferenceSchema),
});

export type ContentRecipe = z.infer<typeof ContentRecipeSchema>;

const loggedEntityTypeSchema = z.union([
  z.literal("products"),
  z.literal("etiquetas"),
  z.literal("ingredients"),
  z.literal("productNotifications"),
  z.literal("knowledgeBaseEntries"),
  z.literal("videos"),
  z.literal("batches"),
]);

const changeDetailSchema = z.object({
  field: z.string(),
  fieldName: z.string(),
  oldValue: z.any(),
  newValue: z.any(),
});

export const LogEntrySchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  timestamp: z.string(),
  userId: z.number(),
  userName: z.string(),
  actionType: z.union([
    z.literal("Creaci\u00F3n"),
    z.literal("Actualizaci\u00F3n"),
    z.literal("Eliminaci\u00F3n"),
  ]),
  entityType: loggedEntityTypeSchema,
  entityId: z.union([z.number(), z.string()]),
  entityName: z.string(),
  changes: z.array(changeDetailSchema).optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

const promptableEntitySchema = z.union([
  z.literal("general"),
  z.literal("products"),
  z.literal("etiquetas"),
  z.literal("ingredients"),
  z.literal("productNotifications"),
  z.literal("competitorProducts"),
  z.literal("knowledgeBaseEntries"),
]);

export const PromptTemplateSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  category: z.union([
    z.literal("Revisi\u00F3n"),
    z.literal("Traducci\u00F3n"),
    z.literal("Generaci\u00F3n"),
    z.literal("An\u00E1lisis"),
    z.literal("Optimizaci\u00F3n"),
    z.literal("Generaci\u00F3n de Prompt de Imagen"),
    z.literal("Generaci\u00F3n de Prompt de V\u00EDdeo"),
  ]),
  entityType: promptableEntitySchema,
  description: z.string(),
  template: z.string(),
});

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;

const publicationFieldValidationSchema = z.object({
  required: z.boolean().optional(),
  maxLength: z.number().optional(),
  mobileMaxLength: z.number().optional(),
});

const publicationFieldSchema = z.object({
  id: z.string(),
  columnHeader: z.string(),
  mappingType: z.union([
    z.literal("static"),
    z.literal("mapped"),
    z.literal("formula"),
  ]),
  value: z.string(),
  validation: publicationFieldValidationSchema.optional(),
});

export const ImportExportTemplateSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  entity: z.literal("products"),
  templateType: z.union([
    z.literal("publication"),
    z.literal("import"),
    z.literal("amazonContent"),
  ]),
  isPreset: z.boolean().optional(),
  platformId: z.number().optional(),
  fields: z.array(publicationFieldSchema),
});

export type ImportExportTemplate = z.infer<typeof ImportExportTemplateSchema>;

export const ExportJobSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  timestamp: z.string(),
  userId: z.number(),
  userName: z.string(),
  templateId: z.number(),
  summary: z.string(),
});

export type ExportJob = z.infer<typeof ExportJobSchema>;

export const ImportJobSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  timestamp: z.string(),
  userId: z.number(),
  userName: z.string(),
  templateId: z.number(),
  status: z.union([
    z.literal("Completado"),
    z.literal("Fallido"),
    z.literal("Deshecho"),
  ]),
  summary: z.string(),
  changeLogId: z.number().optional(),
});

export type ImportJob = z.infer<typeof ImportJobSchema>;

const importJobChangeLogEntrySchema = z.object({
  action: z.union([z.literal("Creación"), z.literal("Actualización")]),
  entityType: z.literal("products"),
  entityId: z.union([z.number(), z.string()]),
  beforeState: z.any().optional(),
});

export const ImportJobChangeLogSchema = z.object({
  id: z.number(),
  jobId: z.number(),
  changes: z.array(importJobChangeLogEntrySchema),
});

export type ImportJobChangeLog = z.infer<typeof ImportJobChangeLogSchema>;

export const PvprSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  productId: z.number(),
  countryId: z.number(),
  amount: z.number(),
  currency: z.string(),
});

export type Pvpr = z.infer<typeof PvprSchema>;

export const PriceSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  productId: z.number(),
  platformId: z.number(),
  countryId: z.number(),
  amount: z.number(),
  currency: z.string(),
  discountInfo: z.string().optional(),
  lastUpdatedBy: z
    .union([z.literal("manual"), z.literal("rule"), z.literal("flash_deal")])
    .optional(),
  discountPercentage: z.number().optional().nullable(),
  couponPercentage: z.number().optional().nullable(),
});

export type Price = z.infer<typeof PriceSchema>;

const priceCalculationMethodSchema = z.union([
  z.literal("USE_PVPR"),
  z.literal("FIXED_PRICE"),
  z.literal("DISCOUNT_FROM_PVPR_PERCENTAGE"),
  z.literal("DISCOUNT_FROM_PVPR_AMOUNT"),
  z.literal("MARKUP_FROM_COST"),
]);

export const PricingRuleSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  scope: z.object({
    productIds: z.array(z.number()).nullable(),
    platformIds: z.array(z.number()).nullable(),
    countryIds: z.array(z.number()).nullable(),
  }),
  calculation: z.object({
    method: priceCalculationMethodSchema,
    value: z.number().optional(),
  }),
});

export type PricingRule = z.infer<typeof PricingRuleSchema>;

const priceHistoryLogSourceTypeSchema = z.union([
  z.literal("rule"),
  z.literal("manual"),
  z.literal("pvpr"),
  z.literal("flash_deal"),
]);

const priceHistoryLogSourceSchema = z.object({
  type: priceHistoryLogSourceTypeSchema,
  id: z.number(),
  name: z.string(),
});

export const PriceHistoryLogSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  timestamp: z.string(),
  userId: z.number(),
  userName: z.string(),
  productId: z.number(),
  platformId: z.number(),
  countryId: z.number(),
  oldAmount: z.number().nullable(),
  newAmount: z.number(),
  oldDiscountPercentage: z.number().optional().nullable(),
  newDiscountPercentage: z.number().optional().nullable(),
  oldCouponPercentage: z.number().optional().nullable(),
  newCouponPercentage: z.number().optional().nullable(),
  currency: z.string(),
  source: priceHistoryLogSourceSchema,
  trigger: z.union([
    z.literal("manual_rule_execution"),
    z.literal("manual_override"),
    z.literal("flash_deal_start"),
    z.literal("flash_deal_end"),
  ]),
});

export type PriceHistoryLog = z.infer<typeof PriceHistoryLogSchema>;

const amazonFlashDealStatusSchema = z.union([
  z.literal("Borrador"),
  z.literal("Programada"),
  z.literal("Activa"),
  z.literal("Finalizada"),
  z.literal("Cancelada"),
]);

export const AmazonFlashDealSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  productId: z.number(),
  platformId: z.number(),
  asin: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  dealPrice: z.number(),
  currency: z.string(),
  status: amazonFlashDealStatusSchema,
  stockLimit: z.number().optional(),
  unitsSold: z.number().optional(),
  totalRevenue: z.number().optional(),
  reusedFromDealId: z.number().optional(),
});

export type AmazonFlashDeal = z.infer<typeof AmazonFlashDealSchema>;

const roleSchema = z.union([
  z.literal("Administrador"),
  z.literal("Nivel 2"),
  z.literal("Nivel 3"),
]);

export const UserSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  email: z.string(),
  password: z.string().optional(),
  role: roleSchema,
  allowedViews: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;

const taskStatusSchema = z.union([
  z.literal("Pendiente"),
  z.literal("En Proceso"),
  z.literal("En Revisi\u00F3n"),
  z.literal("Bloqueada"),
  z.literal("Completada"),
]);

const taskPrioritySchema = z.union([
  z.literal("Baja"),
  z.literal("Media"),
  z.literal("Alta"),
  z.literal("Urgente"),
]);

const linkedEntitySchema = z.object({
  entityType: z.any(),
  entityId: z.number(),
  entityName: z.string(),
});

const taskRecurrenceFrequencySchema = z.union([
  z.literal("daily"),
  z.literal("weekly"),
  z.literal("monthly"),
  z.literal("yearly"),
]);

const taskRecurrenceSchema = z.object({
  frequency: taskRecurrenceFrequencySchema,
  interval: z.number(),
});

export const TaskSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  description: z.string(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assigneeId: z.number(),
  creatorId: z.number(),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  linkedEntity: linkedEntitySchema,
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().optional(),
  loggedHours: z.number().optional(),
  blocks: z.array(z.number()).optional(),
  isBlockedBy: z.array(z.number()).optional(),
  recurrence: taskRecurrenceSchema.optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskCommentSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  taskId: z.number(),
  authorId: z.number(),
  text: z.string(),
  createdAt: z.string(),
});

export type TaskComment = z.infer<typeof TaskCommentSchema>;

const templateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  defaultAssigneeId: z.number(),
  dueDaysOffset: z.number(),
  templateSubtasks: z.array(z.string()).optional(),
});

const taskSchemaTriggerTypeSchema = z.union([
  z.literal("manual"),
  z.literal("entity_creation"),
  z.literal("entity_status_change"),
]);

const taskSchemaTriggerSchema = z.object({
  type: taskSchemaTriggerTypeSchema,
  entityType: z.union([
    z.literal("products"),
    z.literal("etiquetas"),
    z.literal("batches"),
  ]).optional(),
  targetStatus: z.string().optional(),
});

export const TaskSchemaSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  description: z.string(),
  trigger: taskSchemaTriggerSchema,
  templateTasks: z.array(templateTaskSchema),
});

export type TaskSchema = z.infer<typeof TaskSchemaSchema>;

export const SubtaskSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  taskId: z.number(),
  name: z.string(),
  isCompleted: z.boolean(),
  assigneeId: z.number().optional(),
  dueDate: z.string().optional(),
});

export type Subtask = z.infer<typeof SubtaskSchema>;

export const ProyectoSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  taskSchemaId: z.number(),
  status: z.union([
    z.literal("Activo"),
    z.literal("Completado"),
    z.literal("Pausado"),
  ]),
  createdAt: z.string(),
  ownerId: z.number(),
});

export type Proyecto = z.infer<typeof ProyectoSchema>;

const knowledgeBaseEntryTypeSchema = z.union([
  z.literal("Texto"),
  z.literal("Archivo"),
  z.literal("Enlace"),
]);

const knowledgeBaseCategorySchema = z.union([
  z.literal("Textos Legales"),
  z.literal("Gu\u00EDas de Marca"),
  z.literal("Marketing"),
  z.literal("Certificados"),
  z.literal("General"),
  z.literal("Buenas Pr\u00E1cticas"),
  z.literal("Gu\u00EDas de Uso"),
]);

const knowledgeBaseEntryStatusSchema = z.union([
  z.literal("Borrador"),
  z.literal("En Revisi\u00F3n"),
  z.literal("Aprobado"),
  z.literal("Archivado"),
]);

export const KnowledgeBaseEntrySchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  title: z.string(),
  description: z.string(),
  entryType: knowledgeBaseEntryTypeSchema,
  category: knowledgeBaseCategorySchema,
  tags: z.array(z.string()),
  content: z.object({
    text: z.string().optional(),
    files: z.array(documentAttachmentSchema).optional(),
    url: z.string().optional(),
  }),
  status: knowledgeBaseEntryStatusSchema,
  version: z.number(),
  parentId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type KnowledgeBaseEntry = z.infer<typeof KnowledgeBaseEntrySchema>;

export const KnowledgeBaseUsageSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  entryId: z.number(),
  entryVersion: z.number(),
  entityType: z.any(),
  entityId: z.number(),
  usedAt: z.string(),
  userId: z.number(),
});

export type KnowledgeBaseUsage = z.infer<typeof KnowledgeBaseUsageSchema>;

const sequenceTemplateCategorySchema = z.union([
  z.literal("Introducciones"),
  z.literal("Demostraciones"),
  z.literal("Cierres"),
  z.literal("Gen\u00E9rico"),
]);

export const SequenceTemplateSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  category: sequenceTemplateCategorySchema,
  description: z.string(),
  defaultDuration: z.number(),
});

export type SequenceTemplate = z.infer<typeof SequenceTemplateSchema>;

const videoProjectStatusSchema = z.union([
  z.literal("Planificaci\u00F3n"),
  z.literal("Storyboard"),
  z.literal("Revisi\u00F3n"),
  z.literal("Acabado"),
  z.literal("Publicado"),
]);

const videoTransitionSchema = z.union([
  z.literal("Corte"),
  z.literal("Fundido"),
]);

const projectSequenceSchema = z.object({
  id: z.string(),
  order: z.number(),
  sequenceTemplateId: z.number().optional(),
  mediaAssetId: z.number().optional(),
  duration: z.number(),
  voiceoverScript: z.string(),
  image: z.object({
    userDescription: z.string(),
    finalPrompt: z.string(),
    sourceUrl: z.string(),
    generatedUrl: z.string().optional(),
  }),
  video: z.object({
    userDescription: z.string(),
    finalPrompt: z.string(),
    sourceUrl: z.string(),
    generatedUrl: z.string().optional(),
  }),
  transitionToNext: videoTransitionSchema,
});

export const VideoProjectSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  plannedCreationDate: z.string().optional(),
  plannedPublicationDate: z.string().optional(),
  productId: z.number().optional(),
  countryId: z.number().optional(),
  languageCode: languageCodeSchema.optional(),
  compositionTemplateId: z.number().optional(),
  status: videoProjectStatusSchema,
  sequences: z.array(projectSequenceSchema),
  globalSettings: z.object({
    musicPrompt: z.string().optional(),
    useSubtitles: z.boolean().optional(),
    finalVoiceoverUrl: z.string().optional(),
    finalVideoUrl: z.string().optional(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VideoProject = z.infer<typeof VideoProjectSchema>;

export const MediaAssetSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  duration: z.number(),
  imageUrl: z.string(),
  videoUrl: z.string(),
  voiceoverScript: z.string().optional(),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const VideoCompositionTemplateSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  name: z.string(),
  description: z.string(),
  sequenceTemplateIds: z.array(z.union([z.number(), z.string()])),
});

export type VideoCompositionTemplate = z.infer<typeof VideoCompositionTemplateSchema>;

export const PurchaseOrderSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  orderNumber: z.string(),
  manufacturerName: z.string(),
  status: z.union([
    z.literal("Borrador"),
    z.literal("Enviado a Fabricante"),
    z.literal("Parcialmente Recibido"),
    z.literal("Completado"),
    z.literal("Cancelado"),
  ]),
  orderDate: z.string(),
  expectedDeliveryDate: z.string(),
  productId: z.number(),
  unitsRequested: z.number(),
  costPerUnit: z.number(),
  totalCost: z.number(),
});

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

const batchDocumentSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const BatchSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  purchaseOrderId: z.number(),
  productId: z.number(),
  labelId: z.number().optional(),
  batchNumber: z.string(),
  status: z.union([
    z.literal("En producci\u00F3n"),
    z.literal("En tr\u00E1nsito"),
    z.literal("Disponible"),
    z.literal("Agotado"),
  ]),
  manufacturingDate: z.string(),
  expiryDate: z.string().optional(),
  unitsManufactured: z.number(),
  unitsAvailable: z.number(),
  technicalDataSheet: batchDocumentSchema.optional(),
  manufacturingCertificate: batchDocumentSchema.optional(),
});

export type Batch = z.infer<typeof BatchSchema>;

export const DeliveryNoteSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  purchaseOrderId: z.number(),
  deliveryNoteNumber: z.string(),
  unitsReceived: z.number(),
  receivedDate: z.string(),
  documentUrl: z.string().optional(),
});

export type DeliveryNote = z.infer<typeof DeliveryNoteSchema>;

export const InvoiceSchema = z.object({
  id: z.union([z.number(), z.literal("new")]),
  purchaseOrderId: z.number(),
  invoiceNumber: z.string(),
  amount: z.number(),
  currency: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  status: z.union([
    z.literal("Pendiente de Pago"),
    z.literal("Pagada"),
    z.literal("Vencida"),
  ]),
  documentUrl: z.string().optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

export const ProductPlatformStatusSchema = z.object({
  id: z.string(),
  productId: z.number(),
  platformId: z.number(),
  status: z.union([
    z.literal("Publicado"),
    z.literal("Planificado"),
    z.literal("Pendiente decision"),
    z.literal("Retirado"),
    z.literal("N/A"),
  ]),
  lastChecked: z.string(),
});

export type ProductPlatformStatus = z.infer<typeof ProductPlatformStatusSchema>;

export const AISettingsSchema = z.object({
  globalTranslationRules: z.string(),
});

export type AISettings = z.infer<typeof AISettingsSchema>;
