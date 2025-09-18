import { z } from "zod";
export declare const CustomerSupportTicketSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    customerName: z.ZodString;
    channel: z.ZodUnion<[z.ZodLiteral<"Email">, z.ZodLiteral<"Amazon">, z.ZodLiteral<"Web">, z.ZodLiteral<"Redes Sociales">]>;
    status: z.ZodUnion<[z.ZodLiteral<"Abierto">, z.ZodLiteral<"Respondido">, z.ZodLiteral<"Cerrado">]>;
    entryDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "Abierto" | "Respondido" | "Cerrado";
    id: number | "new";
    customerName: string;
    channel: "Amazon" | "Email" | "Web" | "Redes Sociales";
    entryDate: string;
}, {
    status: "Abierto" | "Respondido" | "Cerrado";
    id: number | "new";
    customerName: string;
    channel: "Amazon" | "Email" | "Web" | "Redes Sociales";
    entryDate: string;
}>;
export type CustomerSupportTicket = z.infer<typeof CustomerSupportTicketSchema>;
export declare const EtiquetaSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    identifier: z.ZodString;
    productId: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Pendiente enviar a imprenta">, z.ZodLiteral<"Enviado a imprenta">, z.ZodLiteral<"Aprobado en imprenta">, z.ZodLiteral<"En el mercado">, z.ZodLiteral<"Obsoleto">]>;
    creationType: z.ZodUnion<[z.ZodLiteral<"Etiqueta 0">, z.ZodLiteral<"Remplazo">]>;
    batchNumber: z.ZodOptional<z.ZodString>;
    mainAttachment: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
    }, {
        name: string;
        url: string;
    }>>;
    additionalAttachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        name: z.ZodString;
        url: z.ZodString;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }, {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }>, "many">>;
    contentByLanguage: z.ZodArray<z.ZodObject<{
        lang: z.ZodUnion<[z.ZodLiteral<"ES">, z.ZodLiteral<"IT">, z.ZodLiteral<"FR">, z.ZodLiteral<"DE">, z.ZodLiteral<"PT">, z.ZodLiteral<"SV">, z.ZodLiteral<"NL">, z.ZodLiteral<"PL">, z.ZodLiteral<"EN">, z.ZodLiteral<"TR">]>;
        productName: z.ZodString;
        contenido: z.ZodOptional<z.ZodString>;
        alergenos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
        productName: string;
        contenido?: string | undefined;
        alergenos?: string[] | undefined;
    }, {
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
        productName: string;
        contenido?: string | undefined;
        alergenos?: string[] | undefined;
    }>, "many">;
    ingredientSnapshot: z.ZodArray<z.ZodObject<{
        ingredientId: z.ZodNumber;
        quantity: z.ZodNumber;
        measureUnit: z.ZodUnion<[z.ZodLiteral<"mg">, z.ZodLiteral<"g">, z.ZodLiteral<"µg">, z.ZodLiteral<"UI">]>;
        translations: z.ZodArray<z.ZodObject<{
            lang: z.ZodUnion<[z.ZodLiteral<"ES">, z.ZodLiteral<"IT">, z.ZodLiteral<"FR">, z.ZodLiteral<"DE">, z.ZodLiteral<"PT">, z.ZodLiteral<"SV">, z.ZodLiteral<"NL">, z.ZodLiteral<"PL">, z.ZodLiteral<"EN">, z.ZodLiteral<"TR">]>;
            name: z.ZodString;
            vrn: z.ZodString;
            permittedClaims: z.ZodArray<z.ZodString, "many">;
            labelDisclaimers: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }, {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        measureUnit: "mg" | "g" | "µg" | "UI";
        quantity: number;
        ingredientId: number;
        translations: {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }[];
    }, {
        measureUnit: "mg" | "g" | "µg" | "UI";
        quantity: number;
        ingredientId: number;
        translations: {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "Pendiente enviar a imprenta" | "Enviado a imprenta" | "Aprobado en imprenta" | "En el mercado" | "Obsoleto";
    identifier: string;
    id: number | "new";
    createdAt: string;
    creationType: "Etiqueta 0" | "Remplazo";
    contentByLanguage: {
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
        productName: string;
        contenido?: string | undefined;
        alergenos?: string[] | undefined;
    }[];
    ingredientSnapshot: {
        measureUnit: "mg" | "g" | "µg" | "UI";
        quantity: number;
        ingredientId: number;
        translations: {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }[];
    }[];
    productId?: number | undefined;
    batchNumber?: string | undefined;
    mainAttachment?: {
        name: string;
        url: string;
    } | undefined;
    additionalAttachments?: {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }[] | undefined;
}, {
    status: "Pendiente enviar a imprenta" | "Enviado a imprenta" | "Aprobado en imprenta" | "En el mercado" | "Obsoleto";
    identifier: string;
    id: number | "new";
    createdAt: string;
    creationType: "Etiqueta 0" | "Remplazo";
    contentByLanguage: {
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
        productName: string;
        contenido?: string | undefined;
        alergenos?: string[] | undefined;
    }[];
    ingredientSnapshot: {
        measureUnit: "mg" | "g" | "µg" | "UI";
        quantity: number;
        ingredientId: number;
        translations: {
            name: string;
            lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
            vrn: string;
            permittedClaims: string[];
            labelDisclaimers: string[];
        }[];
    }[];
    productId?: number | undefined;
    batchNumber?: string | undefined;
    mainAttachment?: {
        name: string;
        url: string;
    } | undefined;
    additionalAttachments?: {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }[] | undefined;
}>;
export type Etiqueta = z.infer<typeof EtiquetaSchema>;
export declare const IngredientSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    latinName: z.ZodString;
    type: z.ZodUnion<[z.ZodLiteral<"Componente Activo">, z.ZodLiteral<"Excipiente">, z.ZodLiteral<"">]>;
    measureUnit: z.ZodUnion<[z.ZodLiteral<"mg">, z.ZodLiteral<"g">, z.ZodLiteral<"µg">, z.ZodLiteral<"UI">]>;
    countryDetails: z.ZodArray<z.ZodObject<{
        countryId: z.ZodNumber;
        name: z.ZodString;
        status: z.ZodUnion<[z.ZodLiteral<"Permitido">, z.ZodLiteral<"Prohibido">, z.ZodLiteral<"Con restricciones">, z.ZodLiteral<"En estudio">]>;
        permittedClaims: z.ZodArray<z.ZodString, "many">;
        labelDisclaimers: z.ZodArray<z.ZodString, "many">;
        vrn: z.ZodOptional<z.ZodObject<{
            baseQuantity: z.ZodNumber;
            baseUnit: z.ZodUnion<[z.ZodLiteral<"mg">, z.ZodLiteral<"g">, z.ZodLiteral<"µg">, z.ZodLiteral<"UI">]>;
            percentage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        }, {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        }>>;
        sourceInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "Permitido" | "Prohibido" | "Con restricciones" | "En estudio";
        countryId: number;
        permittedClaims: string[];
        labelDisclaimers: string[];
        vrn?: {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        } | undefined;
        sourceInfo?: string | undefined;
    }, {
        name: string;
        status: "Permitido" | "Prohibido" | "Con restricciones" | "En estudio";
        countryId: number;
        permittedClaims: string[];
        labelDisclaimers: string[];
        vrn?: {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        } | undefined;
        sourceInfo?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    latinName: string;
    type: "" | "Componente Activo" | "Excipiente";
    measureUnit: "mg" | "g" | "µg" | "UI";
    id: number | "new";
    countryDetails: {
        name: string;
        status: "Permitido" | "Prohibido" | "Con restricciones" | "En estudio";
        countryId: number;
        permittedClaims: string[];
        labelDisclaimers: string[];
        vrn?: {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        } | undefined;
        sourceInfo?: string | undefined;
    }[];
}, {
    latinName: string;
    type: "" | "Componente Activo" | "Excipiente";
    measureUnit: "mg" | "g" | "µg" | "UI";
    id: number | "new";
    countryDetails: {
        name: string;
        status: "Permitido" | "Prohibido" | "Con restricciones" | "En estudio";
        countryId: number;
        permittedClaims: string[];
        labelDisclaimers: string[];
        vrn?: {
            baseQuantity: number;
            baseUnit: "mg" | "g" | "µg" | "UI";
            percentage: number;
        } | undefined;
        sourceInfo?: string | undefined;
    }[];
}>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export declare const NoteSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    entityType: z.ZodUnion<[z.ZodLiteral<"products">, z.ZodLiteral<"platforms">, z.ZodLiteral<"competitorBrands">, z.ZodLiteral<"etiquetas">, z.ZodLiteral<"ingredients">, z.ZodLiteral<"countries">, z.ZodLiteral<"envases">, z.ZodLiteral<"competitorProducts">, z.ZodLiteral<"tasks">, z.ZodLiteral<"videoProjects">, z.ZodLiteral<"knowledgeBaseEntries">, z.ZodLiteral<"batches">, z.ZodLiteral<"purchaseOrders">]>;
    entityId: z.ZodNumber;
    authorName: z.ZodString;
    text: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string | number;
        url: string;
    }, {
        name: string;
        id: string | number;
        url: string;
    }>, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Activa">, z.ZodLiteral<"Archivada">]>;
    archiveReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Activa" | "Archivada";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    text: string;
    authorName: string;
    entityType: "products" | "platforms" | "competitorBrands" | "etiquetas" | "ingredients" | "countries" | "envases" | "competitorProducts" | "tasks" | "videoProjects" | "knowledgeBaseEntries" | "batches" | "purchaseOrders";
    entityId: number;
    attachments?: {
        name: string;
        id: string | number;
        url: string;
    }[] | undefined;
    archiveReason?: string | undefined;
}, {
    status: "Activa" | "Archivada";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    text: string;
    authorName: string;
    entityType: "products" | "platforms" | "competitorBrands" | "etiquetas" | "ingredients" | "countries" | "envases" | "competitorProducts" | "tasks" | "videoProjects" | "knowledgeBaseEntries" | "batches" | "purchaseOrders";
    entityId: number;
    attachments?: {
        name: string;
        id: string | number;
        url: string;
    }[] | undefined;
    archiveReason?: string | undefined;
}>;
export type Note = z.infer<typeof NoteSchema>;
export declare const TranslationTermSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    spanish: z.ZodString;
    translations: z.ZodArray<z.ZodObject<{
        lang: z.ZodUnion<[z.ZodLiteral<"ES">, z.ZodLiteral<"IT">, z.ZodLiteral<"FR">, z.ZodLiteral<"DE">, z.ZodLiteral<"PT">, z.ZodLiteral<"SV">, z.ZodLiteral<"NL">, z.ZodLiteral<"PL">, z.ZodLiteral<"EN">, z.ZodLiteral<"TR">]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
    }, {
        value: string;
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    translations: {
        value: string;
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
    }[];
    spanish: string;
}, {
    id: number | "new";
    translations: {
        value: string;
        lang: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR";
    }[];
    spanish: string;
}>;
export type TranslationTerm = z.infer<typeof TranslationTermSchema>;
export declare const ProductNotificationSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    productId: z.ZodNumber;
    countryId: z.ZodNumber;
    status: z.ZodUnion<[z.ZodLiteral<"Pendiente">, z.ZodLiteral<"En proceso">, z.ZodLiteral<"Notificado">, z.ZodLiteral<"No necesario">, z.ZodLiteral<"Espera de decision">, z.ZodLiteral<"No Notificable">, z.ZodLiteral<"Pendiente nueva notificación">]>;
    notifiedBy: z.ZodUnion<[z.ZodLiteral<"Interno">, z.ZodLiteral<"Agencia Externa">, z.ZodLiteral<"">]>;
    agencyName: z.ZodOptional<z.ZodString>;
    notificationDate: z.ZodOptional<z.ZodString>;
    costGovernmentFee: z.ZodOptional<z.ZodNumber>;
    costAgencyFee: z.ZodOptional<z.ZodNumber>;
    checklist: z.ZodOptional<z.ZodString>;
    attachedFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        name: z.ZodString;
        url: z.ZodString;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }, {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "Pendiente" | "En proceso" | "Notificado" | "No necesario" | "Espera de decision" | "No Notificable" | "Pendiente nueva notificación";
    productId: number;
    notifiedBy: "" | "Interno" | "Agencia Externa";
    id: number | "new";
    countryId: number;
    agencyName?: string | undefined;
    notificationDate?: string | undefined;
    costGovernmentFee?: number | undefined;
    costAgencyFee?: number | undefined;
    checklist?: string | undefined;
    attachedFiles?: {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }[] | undefined;
}, {
    status: "Pendiente" | "En proceso" | "Notificado" | "No necesario" | "Espera de decision" | "No Notificable" | "Pendiente nueva notificación";
    productId: number;
    notifiedBy: "" | "Interno" | "Agencia Externa";
    id: number | "new";
    countryId: number;
    agencyName?: string | undefined;
    notificationDate?: string | undefined;
    costGovernmentFee?: number | undefined;
    costAgencyFee?: number | undefined;
    checklist?: string | undefined;
    attachedFiles?: {
        name: string;
        id: string | number;
        url: string;
        comment?: string | undefined;
    }[] | undefined;
}>;
export type ProductNotification = z.infer<typeof ProductNotificationSchema>;
export declare const CompetitorBrandSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    logoUrl: z.ZodOptional<z.ZodString>;
    productTypology: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    logoUrl?: string | undefined;
    productTypology?: string | undefined;
}, {
    name: string;
    id: number | "new";
    logoUrl?: string | undefined;
    productTypology?: string | undefined;
}>;
export type CompetitorBrand = z.infer<typeof CompetitorBrandSchema>;
export declare const CompetitorProductSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    competitorBrandId: z.ZodNullable<z.ZodNumber>;
    countryId: z.ZodNumber;
    asin: z.ZodString;
    name: z.ZodString;
    typology: z.ZodOptional<z.ZodString>;
    competesWith: z.ZodOptional<z.ZodString>;
    snapshots: z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
        competitorProductId: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodString;
        amazonTitle: z.ZodString;
        amazonDescription: z.ZodString;
        amazonBulletPoints: z.ZodArray<z.ZodString, "many">;
        amazonPhotos: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
        }, {
            url: string;
        }>, "many">;
        titleAnalysis: z.ZodString;
        descriptionAnalysis: z.ZodString;
        aPlusAnalysis: z.ZodString;
        infographicsAnalysis: z.ZodString;
        reviewsAnalysis: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number | "new";
        createdAt: string;
        amazonTitle: string;
        amazonDescription: string;
        amazonBulletPoints: string[];
        amazonPhotos: {
            url: string;
        }[];
        titleAnalysis: string;
        descriptionAnalysis: string;
        aPlusAnalysis: string;
        infographicsAnalysis: string;
        reviewsAnalysis: string;
        competitorProductId?: number | undefined;
    }, {
        id: number | "new";
        createdAt: string;
        amazonTitle: string;
        amazonDescription: string;
        amazonBulletPoints: string[];
        amazonPhotos: {
            url: string;
        }[];
        titleAnalysis: string;
        descriptionAnalysis: string;
        aPlusAnalysis: string;
        infographicsAnalysis: string;
        reviewsAnalysis: string;
        competitorProductId?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    asin: string;
    countryId: number;
    competitorBrandId: number | null;
    snapshots: {
        id: number | "new";
        createdAt: string;
        amazonTitle: string;
        amazonDescription: string;
        amazonBulletPoints: string[];
        amazonPhotos: {
            url: string;
        }[];
        titleAnalysis: string;
        descriptionAnalysis: string;
        aPlusAnalysis: string;
        infographicsAnalysis: string;
        reviewsAnalysis: string;
        competitorProductId?: number | undefined;
    }[];
    typology?: string | undefined;
    competesWith?: string | undefined;
}, {
    name: string;
    id: number | "new";
    asin: string;
    countryId: number;
    competitorBrandId: number | null;
    snapshots: {
        id: number | "new";
        createdAt: string;
        amazonTitle: string;
        amazonDescription: string;
        amazonBulletPoints: string[];
        amazonPhotos: {
            url: string;
        }[];
        titleAnalysis: string;
        descriptionAnalysis: string;
        aPlusAnalysis: string;
        infographicsAnalysis: string;
        reviewsAnalysis: string;
        competitorProductId?: number | undefined;
    }[];
    typology?: string | undefined;
    competesWith?: string | undefined;
}>;
export type CompetitorProduct = z.infer<typeof CompetitorProductSchema>;
export declare const ContentRecipeSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    target: z.ZodUnion<[z.ZodLiteral<"title">, z.ZodLiteral<"description">]>;
    parts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodUnion<[z.ZodLiteral<"field">, z.ZodLiteral<"static">]>;
        sourceType: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"General">, z.ZodLiteral<"Marketing">, z.ZodLiteral<"Amazon">, z.ZodLiteral<"Composición">]>>;
        sourceKey: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "field" | "static";
        id: string;
        value?: string | undefined;
        sourceType?: "Marketing" | "General" | "Amazon" | "Composición" | undefined;
        sourceKey?: string | undefined;
    }, {
        type: "field" | "static";
        id: string;
        value?: string | undefined;
        sourceType?: "Marketing" | "General" | "Amazon" | "Composición" | undefined;
        sourceKey?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    target: "title" | "description";
    parts: {
        type: "field" | "static";
        id: string;
        value?: string | undefined;
        sourceType?: "Marketing" | "General" | "Amazon" | "Composición" | undefined;
        sourceKey?: string | undefined;
    }[];
}, {
    name: string;
    id: number | "new";
    target: "title" | "description";
    parts: {
        type: "field" | "static";
        id: string;
        value?: string | undefined;
        sourceType?: "Marketing" | "General" | "Amazon" | "Composición" | undefined;
        sourceKey?: string | undefined;
    }[];
}>;
export type ContentRecipe = z.infer<typeof ContentRecipeSchema>;
export declare const LogEntrySchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    timestamp: z.ZodString;
    userId: z.ZodNumber;
    userName: z.ZodString;
    actionType: z.ZodUnion<[z.ZodLiteral<"Creación">, z.ZodLiteral<"Actualización">, z.ZodLiteral<"Eliminación">]>;
    entityType: z.ZodUnion<[z.ZodLiteral<"products">, z.ZodLiteral<"etiquetas">, z.ZodLiteral<"ingredients">, z.ZodLiteral<"productNotifications">, z.ZodLiteral<"knowledgeBaseEntries">, z.ZodLiteral<"videos">, z.ZodLiteral<"batches">]>;
    entityId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    entityName: z.ZodString;
    changes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        fieldName: z.ZodString;
        oldValue: z.ZodAny;
        newValue: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        field: string;
        fieldName: string;
        oldValue?: any;
        newValue?: any;
    }, {
        field: string;
        fieldName: string;
        oldValue?: any;
        newValue?: any;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    entityType: "products" | "etiquetas" | "ingredients" | "knowledgeBaseEntries" | "batches" | "videos" | "productNotifications";
    entityId: string | number;
    userId: number;
    actionType: "Creación" | "Actualización" | "Eliminación";
    timestamp: string;
    userName: string;
    entityName: string;
    changes?: {
        field: string;
        fieldName: string;
        oldValue?: any;
        newValue?: any;
    }[] | undefined;
}, {
    id: number | "new";
    entityType: "products" | "etiquetas" | "ingredients" | "knowledgeBaseEntries" | "batches" | "videos" | "productNotifications";
    entityId: string | number;
    userId: number;
    actionType: "Creación" | "Actualización" | "Eliminación";
    timestamp: string;
    userName: string;
    entityName: string;
    changes?: {
        field: string;
        fieldName: string;
        oldValue?: any;
        newValue?: any;
    }[] | undefined;
}>;
export type LogEntry = z.infer<typeof LogEntrySchema>;
export declare const PromptTemplateSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    category: z.ZodUnion<[z.ZodLiteral<"Revisión">, z.ZodLiteral<"Traducción">, z.ZodLiteral<"Generación">, z.ZodLiteral<"Análisis">, z.ZodLiteral<"Optimización">, z.ZodLiteral<"Generación de Prompt de Imagen">, z.ZodLiteral<"Generación de Prompt de Vídeo">]>;
    entityType: z.ZodUnion<[z.ZodLiteral<"general">, z.ZodLiteral<"products">, z.ZodLiteral<"etiquetas">, z.ZodLiteral<"ingredients">, z.ZodLiteral<"productNotifications">, z.ZodLiteral<"competitorProducts">, z.ZodLiteral<"knowledgeBaseEntries">]>;
    description: z.ZodString;
    template: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    id: number | "new";
    entityType: "products" | "etiquetas" | "ingredients" | "competitorProducts" | "knowledgeBaseEntries" | "productNotifications" | "general";
    category: "Revisión" | "Traducción" | "Generación" | "Análisis" | "Optimización" | "Generación de Prompt de Imagen" | "Generación de Prompt de Vídeo";
    template: string;
}, {
    description: string;
    name: string;
    id: number | "new";
    entityType: "products" | "etiquetas" | "ingredients" | "competitorProducts" | "knowledgeBaseEntries" | "productNotifications" | "general";
    category: "Revisión" | "Traducción" | "Generación" | "Análisis" | "Optimización" | "Generación de Prompt de Imagen" | "Generación de Prompt de Vídeo";
    template: string;
}>;
export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;
export declare const ImportExportTemplateSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    entity: z.ZodLiteral<"products">;
    templateType: z.ZodUnion<[z.ZodLiteral<"publication">, z.ZodLiteral<"import">, z.ZodLiteral<"amazonContent">]>;
    isPreset: z.ZodOptional<z.ZodBoolean>;
    platformId: z.ZodOptional<z.ZodNumber>;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        columnHeader: z.ZodString;
        mappingType: z.ZodUnion<[z.ZodLiteral<"static">, z.ZodLiteral<"mapped">, z.ZodLiteral<"formula">]>;
        value: z.ZodString;
        validation: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            maxLength: z.ZodOptional<z.ZodNumber>;
            mobileMaxLength: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        }, {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        value: string;
        columnHeader: string;
        mappingType: "static" | "mapped" | "formula";
        validation?: {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        } | undefined;
    }, {
        id: string;
        value: string;
        columnHeader: string;
        mappingType: "static" | "mapped" | "formula";
        validation?: {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    entity: "products";
    fields: {
        id: string;
        value: string;
        columnHeader: string;
        mappingType: "static" | "mapped" | "formula";
        validation?: {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        } | undefined;
    }[];
    templateType: "publication" | "import" | "amazonContent";
    platformId?: number | undefined;
    isPreset?: boolean | undefined;
}, {
    name: string;
    id: number | "new";
    entity: "products";
    fields: {
        id: string;
        value: string;
        columnHeader: string;
        mappingType: "static" | "mapped" | "formula";
        validation?: {
            required?: boolean | undefined;
            maxLength?: number | undefined;
            mobileMaxLength?: number | undefined;
        } | undefined;
    }[];
    templateType: "publication" | "import" | "amazonContent";
    platformId?: number | undefined;
    isPreset?: boolean | undefined;
}>;
export type ImportExportTemplate = z.infer<typeof ImportExportTemplateSchema>;
export declare const ExportJobSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    timestamp: z.ZodString;
    userId: z.ZodNumber;
    userName: z.ZodString;
    templateId: z.ZodNumber;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    userId: number;
    timestamp: string;
    userName: string;
    templateId: number;
    summary: string;
}, {
    id: number | "new";
    userId: number;
    timestamp: string;
    userName: string;
    templateId: number;
    summary: string;
}>;
export type ExportJob = z.infer<typeof ExportJobSchema>;
export declare const ImportJobSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    timestamp: z.ZodString;
    userId: z.ZodNumber;
    userName: z.ZodString;
    templateId: z.ZodNumber;
    status: z.ZodUnion<[z.ZodLiteral<"Completado">, z.ZodLiteral<"Fallido">, z.ZodLiteral<"Deshecho">]>;
    summary: z.ZodString;
    changeLogId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "Completado" | "Fallido" | "Deshecho";
    id: number | "new";
    userId: number;
    timestamp: string;
    userName: string;
    templateId: number;
    summary: string;
    changeLogId?: number | undefined;
}, {
    status: "Completado" | "Fallido" | "Deshecho";
    id: number | "new";
    userId: number;
    timestamp: string;
    userName: string;
    templateId: number;
    summary: string;
    changeLogId?: number | undefined;
}>;
export type ImportJob = z.infer<typeof ImportJobSchema>;
export declare const ImportJobChangeLogSchema: z.ZodObject<{
    id: z.ZodNumber;
    jobId: z.ZodNumber;
    changes: z.ZodArray<z.ZodObject<{
        action: z.ZodUnion<[z.ZodLiteral<"Creación">, z.ZodLiteral<"Actualización">]>;
        entityType: z.ZodLiteral<"products">;
        entityId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        beforeState: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        entityType: "products";
        entityId: string | number;
        action: "Creación" | "Actualización";
        beforeState?: any;
    }, {
        entityType: "products";
        entityId: string | number;
        action: "Creación" | "Actualización";
        beforeState?: any;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: number;
    changes: {
        entityType: "products";
        entityId: string | number;
        action: "Creación" | "Actualización";
        beforeState?: any;
    }[];
    jobId: number;
}, {
    id: number;
    changes: {
        entityType: "products";
        entityId: string | number;
        action: "Creación" | "Actualización";
        beforeState?: any;
    }[];
    jobId: number;
}>;
export type ImportJobChangeLog = z.infer<typeof ImportJobChangeLogSchema>;
export declare const PvprSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    productId: z.ZodNumber;
    countryId: z.ZodNumber;
    amount: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: number;
    id: number | "new";
    countryId: number;
    currency: string;
    amount: number;
}, {
    productId: number;
    id: number | "new";
    countryId: number;
    currency: string;
    amount: number;
}>;
export type Pvpr = z.infer<typeof PvprSchema>;
export declare const PriceSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    productId: z.ZodNumber;
    platformId: z.ZodNumber;
    countryId: z.ZodNumber;
    amount: z.ZodNumber;
    currency: z.ZodString;
    discountInfo: z.ZodOptional<z.ZodString>;
    lastUpdatedBy: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"manual">, z.ZodLiteral<"rule">, z.ZodLiteral<"flash_deal">]>>;
    discountPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    couponPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    productId: number;
    id: number | "new";
    platformId: number;
    countryId: number;
    currency: string;
    amount: number;
    discountInfo?: string | undefined;
    lastUpdatedBy?: "manual" | "rule" | "flash_deal" | undefined;
    discountPercentage?: number | null | undefined;
    couponPercentage?: number | null | undefined;
}, {
    productId: number;
    id: number | "new";
    platformId: number;
    countryId: number;
    currency: string;
    amount: number;
    discountInfo?: string | undefined;
    lastUpdatedBy?: "manual" | "rule" | "flash_deal" | undefined;
    discountPercentage?: number | null | undefined;
    couponPercentage?: number | null | undefined;
}>;
export type Price = z.infer<typeof PriceSchema>;
export declare const PricingRuleSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    isActive: z.ZodBoolean;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    scope: z.ZodObject<{
        productIds: z.ZodNullable<z.ZodArray<z.ZodNumber, "many">>;
        platformIds: z.ZodNullable<z.ZodArray<z.ZodNumber, "many">>;
        countryIds: z.ZodNullable<z.ZodArray<z.ZodNumber, "many">>;
    }, "strip", z.ZodTypeAny, {
        productIds: number[] | null;
        platformIds: number[] | null;
        countryIds: number[] | null;
    }, {
        productIds: number[] | null;
        platformIds: number[] | null;
        countryIds: number[] | null;
    }>;
    calculation: z.ZodObject<{
        method: z.ZodUnion<[z.ZodLiteral<"USE_PVPR">, z.ZodLiteral<"FIXED_PRICE">, z.ZodLiteral<"DISCOUNT_FROM_PVPR_PERCENTAGE">, z.ZodLiteral<"DISCOUNT_FROM_PVPR_AMOUNT">, z.ZodLiteral<"MARKUP_FROM_COST">]>;
        value: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        method: "USE_PVPR" | "FIXED_PRICE" | "DISCOUNT_FROM_PVPR_PERCENTAGE" | "DISCOUNT_FROM_PVPR_AMOUNT" | "MARKUP_FROM_COST";
        value?: number | undefined;
    }, {
        method: "USE_PVPR" | "FIXED_PRICE" | "DISCOUNT_FROM_PVPR_PERCENTAGE" | "DISCOUNT_FROM_PVPR_AMOUNT" | "MARKUP_FROM_COST";
        value?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    isActive: boolean;
    scope: {
        productIds: number[] | null;
        platformIds: number[] | null;
        countryIds: number[] | null;
    };
    calculation: {
        method: "USE_PVPR" | "FIXED_PRICE" | "DISCOUNT_FROM_PVPR_PERCENTAGE" | "DISCOUNT_FROM_PVPR_AMOUNT" | "MARKUP_FROM_COST";
        value?: number | undefined;
    };
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    name: string;
    id: number | "new";
    isActive: boolean;
    scope: {
        productIds: number[] | null;
        platformIds: number[] | null;
        countryIds: number[] | null;
    };
    calculation: {
        method: "USE_PVPR" | "FIXED_PRICE" | "DISCOUNT_FROM_PVPR_PERCENTAGE" | "DISCOUNT_FROM_PVPR_AMOUNT" | "MARKUP_FROM_COST";
        value?: number | undefined;
    };
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export type PricingRule = z.infer<typeof PricingRuleSchema>;
export declare const PriceHistoryLogSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    timestamp: z.ZodString;
    userId: z.ZodNumber;
    userName: z.ZodString;
    productId: z.ZodNumber;
    platformId: z.ZodNumber;
    countryId: z.ZodNumber;
    oldAmount: z.ZodNullable<z.ZodNumber>;
    newAmount: z.ZodNumber;
    oldDiscountPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    newDiscountPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    oldCouponPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    newCouponPercentage: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    currency: z.ZodString;
    source: z.ZodObject<{
        type: z.ZodUnion<[z.ZodLiteral<"rule">, z.ZodLiteral<"manual">, z.ZodLiteral<"pvpr">, z.ZodLiteral<"flash_deal">]>;
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "manual" | "rule" | "flash_deal" | "pvpr";
        id: number;
    }, {
        name: string;
        type: "manual" | "rule" | "flash_deal" | "pvpr";
        id: number;
    }>;
    trigger: z.ZodUnion<[z.ZodLiteral<"manual_rule_execution">, z.ZodLiteral<"manual_override">, z.ZodLiteral<"flash_deal_start">, z.ZodLiteral<"flash_deal_end">]>;
}, "strip", z.ZodTypeAny, {
    productId: number;
    id: number | "new";
    platformId: number;
    userId: number;
    source: {
        name: string;
        type: "manual" | "rule" | "flash_deal" | "pvpr";
        id: number;
    };
    countryId: number;
    currency: string;
    timestamp: string;
    userName: string;
    oldAmount: number | null;
    newAmount: number;
    trigger: "manual_rule_execution" | "manual_override" | "flash_deal_start" | "flash_deal_end";
    oldDiscountPercentage?: number | null | undefined;
    newDiscountPercentage?: number | null | undefined;
    oldCouponPercentage?: number | null | undefined;
    newCouponPercentage?: number | null | undefined;
}, {
    productId: number;
    id: number | "new";
    platformId: number;
    userId: number;
    source: {
        name: string;
        type: "manual" | "rule" | "flash_deal" | "pvpr";
        id: number;
    };
    countryId: number;
    currency: string;
    timestamp: string;
    userName: string;
    oldAmount: number | null;
    newAmount: number;
    trigger: "manual_rule_execution" | "manual_override" | "flash_deal_start" | "flash_deal_end";
    oldDiscountPercentage?: number | null | undefined;
    newDiscountPercentage?: number | null | undefined;
    oldCouponPercentage?: number | null | undefined;
    newCouponPercentage?: number | null | undefined;
}>;
export type PriceHistoryLog = z.infer<typeof PriceHistoryLogSchema>;
export declare const AmazonFlashDealSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    productId: z.ZodNumber;
    platformId: z.ZodNumber;
    asin: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    dealPrice: z.ZodNumber;
    currency: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Borrador">, z.ZodLiteral<"Programada">, z.ZodLiteral<"Activa">, z.ZodLiteral<"Finalizada">, z.ZodLiteral<"Cancelada">]>;
    stockLimit: z.ZodOptional<z.ZodNumber>;
    unitsSold: z.ZodOptional<z.ZodNumber>;
    totalRevenue: z.ZodOptional<z.ZodNumber>;
    reusedFromDealId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "Activa" | "Borrador" | "Programada" | "Finalizada" | "Cancelada";
    productId: number;
    id: number | "new";
    platformId: number;
    asin: string;
    currency: string;
    startDate: string;
    endDate: string;
    dealPrice: number;
    stockLimit?: number | undefined;
    unitsSold?: number | undefined;
    totalRevenue?: number | undefined;
    reusedFromDealId?: number | undefined;
}, {
    name: string;
    status: "Activa" | "Borrador" | "Programada" | "Finalizada" | "Cancelada";
    productId: number;
    id: number | "new";
    platformId: number;
    asin: string;
    currency: string;
    startDate: string;
    endDate: string;
    dealPrice: number;
    stockLimit?: number | undefined;
    unitsSold?: number | undefined;
    totalRevenue?: number | undefined;
    reusedFromDealId?: number | undefined;
}>;
export type AmazonFlashDeal = z.infer<typeof AmazonFlashDealSchema>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodUnion<[z.ZodLiteral<"Administrador">, z.ZodLiteral<"Nivel 2">, z.ZodLiteral<"Nivel 3">]>;
    allowedViews: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    role: "Administrador" | "Nivel 2" | "Nivel 3";
    email: string;
    password?: string | undefined;
    allowedViews?: string[] | undefined;
}, {
    name: string;
    id: number | "new";
    role: "Administrador" | "Nivel 2" | "Nivel 3";
    email: string;
    password?: string | undefined;
    allowedViews?: string[] | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    description: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Pendiente">, z.ZodLiteral<"En Proceso">, z.ZodLiteral<"En Revisión">, z.ZodLiteral<"Bloqueada">, z.ZodLiteral<"Completada">]>;
    priority: z.ZodUnion<[z.ZodLiteral<"Baja">, z.ZodLiteral<"Media">, z.ZodLiteral<"Alta">, z.ZodLiteral<"Urgente">]>;
    assigneeId: z.ZodNumber;
    creatorId: z.ZodNumber;
    dueDate: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    linkedEntity: z.ZodObject<{
        entityType: z.ZodAny;
        entityId: z.ZodNumber;
        entityName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        entityId: number;
        entityName: string;
        entityType?: any;
    }, {
        entityId: number;
        entityName: string;
        entityType?: any;
    }>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    estimatedHours: z.ZodOptional<z.ZodNumber>;
    loggedHours: z.ZodOptional<z.ZodNumber>;
    blocks: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    isBlockedBy: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    recurrence: z.ZodOptional<z.ZodObject<{
        frequency: z.ZodUnion<[z.ZodLiteral<"daily">, z.ZodLiteral<"weekly">, z.ZodLiteral<"monthly">, z.ZodLiteral<"yearly">]>;
        interval: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
    }, {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    status: "En Revisión" | "Pendiente" | "En Proceso" | "Bloqueada" | "Completada";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    priority: "Baja" | "Media" | "Alta" | "Urgente";
    assigneeId: number;
    creatorId: number;
    linkedEntity: {
        entityId: number;
        entityName: string;
        entityType?: any;
    };
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    estimatedHours?: number | undefined;
    loggedHours?: number | undefined;
    blocks?: number[] | undefined;
    isBlockedBy?: number[] | undefined;
    recurrence?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
    } | undefined;
}, {
    description: string;
    name: string;
    status: "En Revisión" | "Pendiente" | "En Proceso" | "Bloqueada" | "Completada";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    priority: "Baja" | "Media" | "Alta" | "Urgente";
    assigneeId: number;
    creatorId: number;
    linkedEntity: {
        entityId: number;
        entityName: string;
        entityType?: any;
    };
    dueDate?: string | undefined;
    tags?: string[] | undefined;
    estimatedHours?: number | undefined;
    loggedHours?: number | undefined;
    blocks?: number[] | undefined;
    isBlockedBy?: number[] | undefined;
    recurrence?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
    } | undefined;
}>;
export type Task = z.infer<typeof TaskSchema>;
export declare const TaskCommentSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    taskId: z.ZodNumber;
    authorId: z.ZodNumber;
    text: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    createdAt: string;
    text: string;
    taskId: number;
    authorId: number;
}, {
    id: number | "new";
    createdAt: string;
    text: string;
    taskId: number;
    authorId: number;
}>;
export type TaskComment = z.infer<typeof TaskCommentSchema>;
export declare const TaskSchemaSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    description: z.ZodString;
    trigger: z.ZodObject<{
        type: z.ZodUnion<[z.ZodLiteral<"manual">, z.ZodLiteral<"entity_creation">, z.ZodLiteral<"entity_status_change">]>;
        entityType: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"products">, z.ZodLiteral<"etiquetas">, z.ZodLiteral<"batches">]>>;
        targetStatus: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "manual" | "entity_creation" | "entity_status_change";
        entityType?: "products" | "etiquetas" | "batches" | undefined;
        targetStatus?: string | undefined;
    }, {
        type: "manual" | "entity_creation" | "entity_status_change";
        entityType?: "products" | "etiquetas" | "batches" | undefined;
        targetStatus?: string | undefined;
    }>;
    templateTasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        defaultAssigneeId: z.ZodNumber;
        dueDaysOffset: z.ZodNumber;
        templateSubtasks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        defaultAssigneeId: number;
        dueDaysOffset: number;
        templateSubtasks?: string[] | undefined;
    }, {
        title: string;
        description: string;
        defaultAssigneeId: number;
        dueDaysOffset: number;
        templateSubtasks?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    id: number | "new";
    trigger: {
        type: "manual" | "entity_creation" | "entity_status_change";
        entityType?: "products" | "etiquetas" | "batches" | undefined;
        targetStatus?: string | undefined;
    };
    templateTasks: {
        title: string;
        description: string;
        defaultAssigneeId: number;
        dueDaysOffset: number;
        templateSubtasks?: string[] | undefined;
    }[];
}, {
    description: string;
    name: string;
    id: number | "new";
    trigger: {
        type: "manual" | "entity_creation" | "entity_status_change";
        entityType?: "products" | "etiquetas" | "batches" | undefined;
        targetStatus?: string | undefined;
    };
    templateTasks: {
        title: string;
        description: string;
        defaultAssigneeId: number;
        dueDaysOffset: number;
        templateSubtasks?: string[] | undefined;
    }[];
}>;
export type TaskSchema = z.infer<typeof TaskSchemaSchema>;
export declare const SubtaskSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    taskId: z.ZodNumber;
    name: z.ZodString;
    isCompleted: z.ZodBoolean;
    assigneeId: z.ZodOptional<z.ZodNumber>;
    dueDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    taskId: number;
    isCompleted: boolean;
    assigneeId?: number | undefined;
    dueDate?: string | undefined;
}, {
    name: string;
    id: number | "new";
    taskId: number;
    isCompleted: boolean;
    assigneeId?: number | undefined;
    dueDate?: string | undefined;
}>;
export type Subtask = z.infer<typeof SubtaskSchema>;
export declare const ProyectoSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    taskSchemaId: z.ZodNumber;
    status: z.ZodUnion<[z.ZodLiteral<"Activo">, z.ZodLiteral<"Completado">, z.ZodLiteral<"Pausado">]>;
    createdAt: z.ZodString;
    ownerId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "Activo" | "Completado" | "Pausado";
    id: number | "new";
    createdAt: string;
    taskSchemaId: number;
    ownerId: number;
}, {
    name: string;
    status: "Activo" | "Completado" | "Pausado";
    id: number | "new";
    createdAt: string;
    taskSchemaId: number;
    ownerId: number;
}>;
export type Proyecto = z.infer<typeof ProyectoSchema>;
export declare const KnowledgeBaseEntrySchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    title: z.ZodString;
    description: z.ZodString;
    entryType: z.ZodUnion<[z.ZodLiteral<"Texto">, z.ZodLiteral<"Archivo">, z.ZodLiteral<"Enlace">]>;
    category: z.ZodUnion<[z.ZodLiteral<"Textos Legales">, z.ZodLiteral<"Guías de Marca">, z.ZodLiteral<"Marketing">, z.ZodLiteral<"Certificados">, z.ZodLiteral<"General">, z.ZodLiteral<"Buenas Prácticas">, z.ZodLiteral<"Guías de Uso">]>;
    tags: z.ZodArray<z.ZodString, "many">;
    content: z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
            name: z.ZodString;
            url: z.ZodString;
            comment: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }, {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }>, "many">>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text?: string | undefined;
        url?: string | undefined;
        files?: {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }[] | undefined;
    }, {
        text?: string | undefined;
        url?: string | undefined;
        files?: {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }[] | undefined;
    }>;
    status: z.ZodUnion<[z.ZodLiteral<"Borrador">, z.ZodLiteral<"En Revisión">, z.ZodLiteral<"Aprobado">, z.ZodLiteral<"Archivado">]>;
    version: z.ZodNumber;
    parentId: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    status: "Borrador" | "En Revisión" | "Aprobado" | "Archivado";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    tags: string[];
    category: "Textos Legales" | "Guías de Marca" | "Marketing" | "Certificados" | "General" | "Buenas Prácticas" | "Guías de Uso";
    entryType: "Texto" | "Archivo" | "Enlace";
    content: {
        text?: string | undefined;
        url?: string | undefined;
        files?: {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }[] | undefined;
    };
    version: number;
    parentId: number | null;
}, {
    title: string;
    description: string;
    status: "Borrador" | "En Revisión" | "Aprobado" | "Archivado";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    tags: string[];
    category: "Textos Legales" | "Guías de Marca" | "Marketing" | "Certificados" | "General" | "Buenas Prácticas" | "Guías de Uso";
    entryType: "Texto" | "Archivo" | "Enlace";
    content: {
        text?: string | undefined;
        url?: string | undefined;
        files?: {
            name: string;
            id: string | number;
            url: string;
            comment?: string | undefined;
        }[] | undefined;
    };
    version: number;
    parentId: number | null;
}>;
export type KnowledgeBaseEntry = z.infer<typeof KnowledgeBaseEntrySchema>;
export declare const KnowledgeBaseUsageSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    entryId: z.ZodNumber;
    entryVersion: z.ZodNumber;
    entityType: z.ZodAny;
    entityId: z.ZodNumber;
    usedAt: z.ZodString;
    userId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    entityId: number;
    entryId: number;
    entryVersion: number;
    usedAt: string;
    userId: number;
    entityType?: any;
}, {
    id: number | "new";
    entityId: number;
    entryId: number;
    entryVersion: number;
    usedAt: string;
    userId: number;
    entityType?: any;
}>;
export type KnowledgeBaseUsage = z.infer<typeof KnowledgeBaseUsageSchema>;
export declare const SequenceTemplateSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    category: z.ZodUnion<[z.ZodLiteral<"Introducciones">, z.ZodLiteral<"Demostraciones">, z.ZodLiteral<"Cierres">, z.ZodLiteral<"Genérico">]>;
    description: z.ZodString;
    defaultDuration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    id: number | "new";
    category: "Introducciones" | "Demostraciones" | "Cierres" | "Genérico";
    defaultDuration: number;
}, {
    description: string;
    name: string;
    id: number | "new";
    category: "Introducciones" | "Demostraciones" | "Cierres" | "Genérico";
    defaultDuration: number;
}>;
export type SequenceTemplate = z.infer<typeof SequenceTemplateSchema>;
export declare const VideoProjectSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    plannedCreationDate: z.ZodOptional<z.ZodString>;
    plannedPublicationDate: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodNumber>;
    countryId: z.ZodOptional<z.ZodNumber>;
    languageCode: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"ES">, z.ZodLiteral<"IT">, z.ZodLiteral<"FR">, z.ZodLiteral<"DE">, z.ZodLiteral<"PT">, z.ZodLiteral<"SV">, z.ZodLiteral<"NL">, z.ZodLiteral<"PL">, z.ZodLiteral<"EN">, z.ZodLiteral<"TR">]>>;
    compositionTemplateId: z.ZodOptional<z.ZodNumber>;
    status: z.ZodUnion<[z.ZodLiteral<"Planificación">, z.ZodLiteral<"Storyboard">, z.ZodLiteral<"Revisión">, z.ZodLiteral<"Acabado">, z.ZodLiteral<"Publicado">]>;
    sequences: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        order: z.ZodNumber;
        sequenceTemplateId: z.ZodOptional<z.ZodNumber>;
        mediaAssetId: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodNumber;
        voiceoverScript: z.ZodString;
        image: z.ZodObject<{
            userDescription: z.ZodString;
            finalPrompt: z.ZodString;
            sourceUrl: z.ZodString;
            generatedUrl: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        }, {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        }>;
        video: z.ZodObject<{
            userDescription: z.ZodString;
            finalPrompt: z.ZodString;
            sourceUrl: z.ZodString;
            generatedUrl: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        }, {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        }>;
        transitionToNext: z.ZodUnion<[z.ZodLiteral<"Corte">, z.ZodLiteral<"Fundido">]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        duration: number;
        order: number;
        voiceoverScript: string;
        image: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        video: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        transitionToNext: "Corte" | "Fundido";
        sequenceTemplateId?: number | undefined;
        mediaAssetId?: number | undefined;
    }, {
        id: string;
        duration: number;
        order: number;
        voiceoverScript: string;
        image: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        video: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        transitionToNext: "Corte" | "Fundido";
        sequenceTemplateId?: number | undefined;
        mediaAssetId?: number | undefined;
    }>, "many">;
    globalSettings: z.ZodObject<{
        musicPrompt: z.ZodOptional<z.ZodString>;
        useSubtitles: z.ZodOptional<z.ZodBoolean>;
        finalVoiceoverUrl: z.ZodOptional<z.ZodString>;
        finalVideoUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        musicPrompt?: string | undefined;
        useSubtitles?: boolean | undefined;
        finalVoiceoverUrl?: string | undefined;
        finalVideoUrl?: string | undefined;
    }, {
        musicPrompt?: string | undefined;
        useSubtitles?: boolean | undefined;
        finalVoiceoverUrl?: string | undefined;
        finalVideoUrl?: string | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "Publicado" | "Revisión" | "Planificación" | "Storyboard" | "Acabado";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    sequences: {
        id: string;
        duration: number;
        order: number;
        voiceoverScript: string;
        image: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        video: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        transitionToNext: "Corte" | "Fundido";
        sequenceTemplateId?: number | undefined;
        mediaAssetId?: number | undefined;
    }[];
    globalSettings: {
        musicPrompt?: string | undefined;
        useSubtitles?: boolean | undefined;
        finalVoiceoverUrl?: string | undefined;
        finalVideoUrl?: string | undefined;
    };
    description?: string | undefined;
    productId?: number | undefined;
    tags?: string[] | undefined;
    countryId?: number | undefined;
    plannedCreationDate?: string | undefined;
    plannedPublicationDate?: string | undefined;
    languageCode?: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR" | undefined;
    compositionTemplateId?: number | undefined;
}, {
    name: string;
    status: "Publicado" | "Revisión" | "Planificación" | "Storyboard" | "Acabado";
    id: number | "new";
    updatedAt: string;
    createdAt: string;
    sequences: {
        id: string;
        duration: number;
        order: number;
        voiceoverScript: string;
        image: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        video: {
            userDescription: string;
            finalPrompt: string;
            sourceUrl: string;
            generatedUrl?: string | undefined;
        };
        transitionToNext: "Corte" | "Fundido";
        sequenceTemplateId?: number | undefined;
        mediaAssetId?: number | undefined;
    }[];
    globalSettings: {
        musicPrompt?: string | undefined;
        useSubtitles?: boolean | undefined;
        finalVoiceoverUrl?: string | undefined;
        finalVideoUrl?: string | undefined;
    };
    description?: string | undefined;
    productId?: number | undefined;
    tags?: string[] | undefined;
    countryId?: number | undefined;
    plannedCreationDate?: string | undefined;
    plannedPublicationDate?: string | undefined;
    languageCode?: "ES" | "IT" | "FR" | "DE" | "PT" | "SV" | "NL" | "PL" | "EN" | "TR" | undefined;
    compositionTemplateId?: number | undefined;
}>;
export type VideoProject = z.infer<typeof VideoProjectSchema>;
export declare const MediaAssetSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodArray<z.ZodString, "many">;
    duration: z.ZodNumber;
    imageUrl: z.ZodString;
    videoUrl: z.ZodString;
    voiceoverScript: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    tags: string[];
    duration: number;
    imageUrl: string;
    videoUrl: string;
    description?: string | undefined;
    voiceoverScript?: string | undefined;
}, {
    name: string;
    id: number | "new";
    tags: string[];
    duration: number;
    imageUrl: string;
    videoUrl: string;
    description?: string | undefined;
    voiceoverScript?: string | undefined;
}>;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
export declare const VideoCompositionTemplateSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    description: z.ZodString;
    sequenceTemplateIds: z.ZodArray<z.ZodUnion<[z.ZodNumber, z.ZodString]>, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    id: number | "new";
    sequenceTemplateIds: (string | number)[];
}, {
    description: string;
    name: string;
    id: number | "new";
    sequenceTemplateIds: (string | number)[];
}>;
export type VideoCompositionTemplate = z.infer<typeof VideoCompositionTemplateSchema>;
export declare const PurchaseOrderSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    orderNumber: z.ZodString;
    manufacturerName: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Borrador">, z.ZodLiteral<"Enviado a Fabricante">, z.ZodLiteral<"Parcialmente Recibido">, z.ZodLiteral<"Completado">, z.ZodLiteral<"Cancelado">]>;
    orderDate: z.ZodString;
    expectedDeliveryDate: z.ZodString;
    productId: z.ZodNumber;
    unitsRequested: z.ZodNumber;
    costPerUnit: z.ZodNumber;
    totalCost: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "Borrador" | "Completado" | "Enviado a Fabricante" | "Parcialmente Recibido" | "Cancelado";
    productId: number;
    id: number | "new";
    orderNumber: string;
    manufacturerName: string;
    orderDate: string;
    expectedDeliveryDate: string;
    unitsRequested: number;
    costPerUnit: number;
    totalCost: number;
}, {
    status: "Borrador" | "Completado" | "Enviado a Fabricante" | "Parcialmente Recibido" | "Cancelado";
    productId: number;
    id: number | "new";
    orderNumber: string;
    manufacturerName: string;
    orderDate: string;
    expectedDeliveryDate: string;
    unitsRequested: number;
    costPerUnit: number;
    totalCost: number;
}>;
export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;
export declare const BatchSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    purchaseOrderId: z.ZodNumber;
    productId: z.ZodNumber;
    labelId: z.ZodOptional<z.ZodNumber>;
    batchNumber: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"En producción">, z.ZodLiteral<"En tránsito">, z.ZodLiteral<"Disponible">, z.ZodLiteral<"Agotado">]>;
    manufacturingDate: z.ZodString;
    expiryDate: z.ZodOptional<z.ZodString>;
    unitsManufactured: z.ZodNumber;
    unitsAvailable: z.ZodNumber;
    technicalDataSheet: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
    }, {
        name: string;
        url: string;
    }>>;
    manufacturingCertificate: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
    }, {
        name: string;
        url: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "En producción" | "En tránsito" | "Disponible" | "Agotado";
    productId: number;
    id: number | "new";
    batchNumber: string;
    purchaseOrderId: number;
    manufacturingDate: string;
    unitsManufactured: number;
    unitsAvailable: number;
    labelId?: number | undefined;
    expiryDate?: string | undefined;
    technicalDataSheet?: {
        name: string;
        url: string;
    } | undefined;
    manufacturingCertificate?: {
        name: string;
        url: string;
    } | undefined;
}, {
    status: "En producción" | "En tránsito" | "Disponible" | "Agotado";
    productId: number;
    id: number | "new";
    batchNumber: string;
    purchaseOrderId: number;
    manufacturingDate: string;
    unitsManufactured: number;
    unitsAvailable: number;
    labelId?: number | undefined;
    expiryDate?: string | undefined;
    technicalDataSheet?: {
        name: string;
        url: string;
    } | undefined;
    manufacturingCertificate?: {
        name: string;
        url: string;
    } | undefined;
}>;
export type Batch = z.infer<typeof BatchSchema>;
export declare const DeliveryNoteSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    purchaseOrderId: z.ZodNumber;
    deliveryNoteNumber: z.ZodString;
    unitsReceived: z.ZodNumber;
    receivedDate: z.ZodString;
    documentUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number | "new";
    purchaseOrderId: number;
    deliveryNoteNumber: string;
    unitsReceived: number;
    receivedDate: string;
    documentUrl?: string | undefined;
}, {
    id: number | "new";
    purchaseOrderId: number;
    deliveryNoteNumber: string;
    unitsReceived: number;
    receivedDate: string;
    documentUrl?: string | undefined;
}>;
export type DeliveryNote = z.infer<typeof DeliveryNoteSchema>;
export declare const InvoiceSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    purchaseOrderId: z.ZodNumber;
    invoiceNumber: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    issueDate: z.ZodString;
    dueDate: z.ZodString;
    status: z.ZodUnion<[z.ZodLiteral<"Pendiente de Pago">, z.ZodLiteral<"Pagada">, z.ZodLiteral<"Vencida">]>;
    documentUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Pendiente de Pago" | "Pagada" | "Vencida";
    id: number | "new";
    dueDate: string;
    currency: string;
    amount: number;
    purchaseOrderId: number;
    invoiceNumber: string;
    issueDate: string;
    documentUrl?: string | undefined;
}, {
    status: "Pendiente de Pago" | "Pagada" | "Vencida";
    id: number | "new";
    dueDate: string;
    currency: string;
    amount: number;
    purchaseOrderId: number;
    invoiceNumber: string;
    issueDate: string;
    documentUrl?: string | undefined;
}>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export declare const ProductPlatformStatusSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodNumber;
    platformId: z.ZodNumber;
    status: z.ZodUnion<[z.ZodLiteral<"Publicado">, z.ZodLiteral<"Planificado">, z.ZodLiteral<"Pendiente decision">, z.ZodLiteral<"Retirado">, z.ZodLiteral<"N/A">]>;
    lastChecked: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "Publicado" | "Planificado" | "Pendiente decision" | "Retirado" | "N/A";
    productId: number;
    id: string;
    platformId: number;
    lastChecked: string;
}, {
    status: "Publicado" | "Planificado" | "Pendiente decision" | "Retirado" | "N/A";
    productId: number;
    id: string;
    platformId: number;
    lastChecked: string;
}>;
export type ProductPlatformStatus = z.infer<typeof ProductPlatformStatusSchema>;
export declare const AISettingsSchema: z.ZodObject<{
    globalTranslationRules: z.ZodString;
}, "strip", z.ZodTypeAny, {
    globalTranslationRules: string;
}, {
    globalTranslationRules: string;
}>;
export type AISettings = z.infer<typeof AISettingsSchema>;
