



import type { AppData, LanguageCode, AmazonInfographic, Note, AmazonBulletPoint, ImportExportTemplate, PromptTemplate, Pvpr, PricingRule, User, Task, TaskComment, TaskSchema, Subtask, Proyecto, KnowledgeBaseEntry, KnowledgeBaseUsage, SequenceTemplate, VideoProject, Product, Country, Platform, Envase, Video, Ingredient, MediaAsset, VideoCompositionTemplate, Etiqueta, TranslationTerm, AmazonFlashDeal } from '../types/index';

export const DEMO_LANGUAGES: { name: string; code: LanguageCode }[] = [
    { name: 'Español', code: 'ES' },
    { name: 'Italiano', code: 'IT' },
    { name: 'Francés', code: 'FR' },
    { name: 'Alemán', code: 'DE' },
    { name: 'Portugués', code: 'PT' },
    { name: 'Sueco', code: 'SV' },
    { name: 'Holandés', code: 'NL' },
    { name: 'Polaco', code: 'PL' },
    { name: 'Inglés', code: 'EN' },
    { name: 'Turco', code: 'TR' },
];

export const PUBLICATION_PRESETS: ImportExportTemplate[] = [
    {
        id: -1,
        name: 'Amazon Seller Central (ES)',
        entity: 'products',
        templateType: 'publication',
        isPreset: true,
        platformId: 1,
        fields: [
            { id: 'preset-1-1', columnHeader: 'item_sku', mappingType: 'mapped', value: '{product.sku}', validation: { required: true } },
            { id: 'preset-1-2', columnHeader: 'brand_name', mappingType: 'static', value: 'WellnessPro', validation: { required: true } },
            { id: 'preset-1-3', columnHeader: 'item_name', mappingType: 'mapped', value: '{product.amazonContents.ES.title}', validation: { required: true, maxLength: 200, mobileMaxLength: 80 } },
            { id: 'preset-1-4', columnHeader: 'product_description', mappingType: 'mapped', value: '{product.amazonContents.ES.description}', validation: { maxLength: 2000 } },
            { id: 'preset-1-5', columnHeader: 'standard_price', mappingType: 'mapped', value: '{price.finalAmount}', validation: { required: true } },
            { id: 'preset-1-6', columnHeader: 'quantity', mappingType: 'static', value: '100', validation: { required: true } },
            { id: 'preset-1-7', columnHeader: 'main_image_url', mappingType: 'mapped', value: '{product.mainImageUrl}', validation: { required: true } },
            { id: 'preset-1-8', columnHeader: 'bullet_point1', mappingType: 'mapped', value: '{product.amazonContents.ES.bulletPoints.0.text}', validation: { maxLength: 500 } },
            { id: 'preset-1-9', columnHeader: 'bullet_point2', mappingType: 'mapped', value: '{product.amazonContents.ES.bulletPoints.1.text}', validation: { maxLength: 500 } },
            { id: 'preset-1-10', columnHeader: 'bullet_point3', mappingType: 'mapped', value: '{product.amazonContents.ES.bulletPoints.2.text}', validation: { maxLength: 500 } },
            { id: 'preset-1-11', columnHeader: 'bullet_point4', mappingType: 'mapped', value: '{product.amazonContents.ES.bulletPoints.3.text}', validation: { maxLength: 500 } },
            { id: 'preset-1-12', columnHeader: 'bullet_point5', mappingType: 'mapped', value: '{product.amazonContents.ES.bulletPoints.4.text}', validation: { maxLength: 500 } },
            { id: 'preset-1-13', columnHeader: 'generic_keywords1', mappingType: 'mapped', value: '{product.amazonContents.ES.searchTerms}', validation: { maxLength: 250 } },
            { id: 'preset-1-14', columnHeader: 'number_of_items', mappingType: 'mapped', value: '{product.units}' },
            { id: 'preset-1-15', columnHeader: 'item_form', mappingType: 'mapped', value: '{product.format}' },
            { id: 'preset-1-16', columnHeader: 'manufacturer', mappingType: 'static', value: 'Laboratorios PIM' },
        ]
    }
];

const DEMO_PROMPT_TEMPLATES: PromptTemplate[] = [
    {
        id: 1,
        name: 'Revisión Estándar (Comercial)',
        category: 'Revisión',
        entityType: 'general',
        description: 'Reescribe un texto para hacerlo más fluido, atractivo y comercial, ideal para descripciones de producto.',
        template: 'Eres un copywriter experto en e-commerce. Reescribe el siguiente texto para que sea más fluido, atractivo y comercial, pero conservando toda la información clave. Devuelve solo el texto revisado, sin introducciones. Texto a reescribir: "{texto_bruto}"',
    },
    {
        id: 2,
        name: 'Traducción Profesional V2',
        category: 'Traducción',
        entityType: 'general',
        description: 'Traduce un texto usando el glosario y las reglas de marca globales.',
        template: `Eres un traductor profesional experto en suplementos nutricionales para el mercado europeo, trabajando para la marca 'WellnessPro'.

**REGLAS GLOBALES (OBLIGATORIAS):**
Debes seguir estas reglas sin excepción:
{global_rules}

**GLOSARIO (OBLIGATORIO):**
Para los siguientes términos, DEBES usar la traducción exacta proporcionada. Aquí está el glosario en formato "término_original:traducción_requerida":
{glossary}

**CONTEXTO ADICIONAL:**
- Nombre del producto (no traducir): {product.name}

Ahora, traduce el siguiente texto de Español a {idioma_destino}. El tono debe ser persuasivo y adaptado al público objetivo.

**TEXTO A TRADUCIR:**
"{texto_bruto}"`,
    },
    {
        id: 3,
        name: 'Generar 5 Bullet Points para Amazon',
        category: 'Generación',
        entityType: 'products',
        description: 'Crea 5 bullet points optimizados para Amazon basados en los datos del producto.',
        template: `Actúa como un experto en SEO para Amazon. Genera 5 bullet points atractivos y persuasivos para el producto llamado "{product.name}". Cada bullet point debe empezar con una mayúscula y ser menor de 200 caracteres.
        
Estos son los datos clave del producto:
- Público Objetivo: {product.publicoObjetivo}
- Puntos Fuertes: {product.puntosFuertes}
- Beneficios Clave: {product.beneficiosGenericos}
- Composición: {product.composition}

Usa esta información para crear 5 bullet points únicos. Devuelve únicamente los 5 bullet points, cada uno en una nueva línea, sin numeración ni guiones al principio.`,
    },
    {
        id: 4,
        name: 'Analizar Debilidades de Competidor',
        category: 'Análisis',
        entityType: 'competitorProducts',
        description: 'Analiza el último snapshot de un competidor y sugiere 3 puntos de ataque para nuestro producto.',
        template: `Eres un estratega de marketing. Analiza la información del producto de nuestro competidor y las reseñas de sus clientes. Nuestro producto se llama "{our_product.name}".

**Datos del Competidor "{competitor.name}":**
- Título: {competitor.snapshots.0.amazonTitle}
- Bullet Points: {competitor.snapshots.0.amazonBulletPoints}
- Resumen de Reseñas (identificado por nuestra IA): {competitor.snapshots.0.reviewsAnalysis}

**Nuestros Puntos Fuertes:**
- {our_product.puntosFuertes}

Basado en esta información, identifica las 3 mayores debilidades o quejas sobre el producto de la competencia que podemos explotar. Para cada debilidad, sugiere cómo podemos destacar nuestra fortaleza correspondiente en nuestro propio marketing. Responde de forma concisa y en formato de lista.`,
    },
    {
        id: 5,
        name: 'Optimizar Título para Móvil (80 car.)',
        category: 'Optimización',
        entityType: 'products',
        description: 'Acorta un título de Amazon a 80 caracteres para la vista móvil, conservando las keywords más importantes.',
        template: `Eres un experto en SEO para Amazon. El siguiente título tiene una longitud de {titulo_completo_length} caracteres: "{titulo_completo}". 

Tu tarea es acortarlo a un máximo de 80 caracteres para optimizarlo para la vista móvil. Es CRÍTICO que conserves las siguientes keywords principales: {keywords_principales}. 

El resultado debe ser atractivo, claro y mantener el sentido original del producto. Devuelve únicamente el título optimizado, sin ninguna explicación adicional.`,
    },
    {
        id: 6,
        name: 'Generar Prompt de Imagen Detallado',
        category: 'Generación de Prompt de Imagen',
        entityType: 'general',
        description: 'Convierte una descripción simple de una imagen en un prompt técnico y evocador para IA.',
        template: `Eres un director de arte y fotógrafo experto. Convierte la siguiente descripción simple en un prompt detallado, cinematográfico y evocador, ideal para un generador de imágenes de IA como Midjourney o DALL-E. El resultado debe ser un único párrafo.
        
        Descripción del usuario: "{user_description}"`
    },
    {
        id: 7,
        name: 'Generar Prompt de Animación de Vídeo',
        category: 'Generación de Prompt de Vídeo',
        entityType: 'general',
        description: 'Convierte una descripción simple de una animación en un prompt técnico para IA de vídeo.',
        template: `Eres un experto en animación y efectos visuales. Convierte la siguiente descripción simple de una animación en un prompt claro y técnico para un generador de vídeo por IA como VEO o SORA. El resultado debe ser una única frase concisa.
        
        Descripción del usuario: "{user_description}"`
    }
];

const DEMO_PVPRS: Pvpr[] = [
    { id: 1, productId: 1, countryId: 1, amount: 19.99, currency: 'EUR' },
    { id: 2, productId: 1, countryId: 2, amount: 20.99, currency: 'EUR' },
    { id: 3, productId: 1, countryId: 3, amount: 21.50, currency: 'EUR' },
    { id: 4, productId: 2, countryId: 1, amount: 24.99, currency: 'EUR' },
    { id: 5, productId: 2, countryId: 3, amount: 25.99, currency: 'EUR' },
    { id: 6, productId: 4, countryId: 1, amount: 29.99, currency: 'EUR' },
];

const DEMO_PRICING_RULES: PricingRule[] = [
    {
        id: 1,
        name: 'Precio Estándar - Usar PVPR',
        isActive: true,
        scope: { productIds: null, platformIds: null, countryIds: null },
        calculation: { method: 'USE_PVPR' }
    },
    {
        id: 2,
        name: 'Campaña Verano 2024 - 15% DTO',
        isActive: true,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        scope: { productIds: [1, 4], platformIds: null, countryIds: [1, 2] },
        calculation: { method: 'DISCOUNT_FROM_PVPR_PERCENTAGE', value: 15 }
    }
];

const DEMO_AMAZON_FLASH_DEALS: AmazonFlashDeal[] = [
    {
        id: 1,
        name: 'Oferta Flash Vitamina C - Prime Day',
        productId: 1,
        platformId: 1,
        asin: 'B08XJ9J8XF',
        startDate: '2024-07-16T08:00:00Z',
        endDate: '2024-07-16T20:00:00Z',
        dealPrice: 15.99,
        currency: 'EUR',
        status: 'Finalizada',
        unitsSold: 120,
        totalRevenue: 1918.80,
    },
    {
        id: 2,
        name: 'Oferta de la Semana - Colágeno',
        productId: 4,
        platformId: 1,
        asin: 'B09ABCDEF1',
        startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        dealPrice: 22.49,
        currency: 'EUR',
        status: 'Activa',
    },
];

const DEMO_USERS: User[] = [
    { id: 1, name: 'Admin Sistema', email: 'admin@example.com', password: 'password', role: 'Administrador' },
    { id: 2, name: 'Sara', email: 'sara@example.com', password: 'password', role: 'Nivel 2' },
    { id: 3, name: 'Sonia', email: 'sonia@example.com', password: 'password', role: 'Nivel 3', allowedViews: ['products', 'tasks', 'etiquetas', 'productNotifications', 'notifications'] },
];

const DEMO_TASKS: Task[] = [
    {
        id: 1,
        name: 'Revisar y optimizar contenido Amazon ES para Vitamina C',
        description: 'El contenido actual necesita una revisión de keywords y mejorar los bullet points para aumentar la conversión.',
        status: 'Completada',
        priority: 'Alta',
        assigneeId: 2,
        creatorId: 1,
        dueDate: '2024-07-30',
        createdAt: '2024-07-20T10:00:00Z',
        updatedAt: '2024-07-22T11:00:00Z',
        linkedEntity: {
            entityType: 'products',
            entityId: 1,
            entityName: 'Vitamina C 1000mg',
        },
        tags: ['Contenido', 'Amazon', 'SEO'],
        estimatedHours: 8,
        loggedHours: 3.5,
    },
    {
        id: 3,
        name: 'Investigar estado regulatorio de Colágeno en Francia',
        description: 'Necesitamos saber si el Colágeno Marino está permitido en Francia y qué claims podemos usar.',
        status: 'Completada',
        priority: 'Media',
        assigneeId: 2,
        creatorId: 1,
        dueDate: '2024-07-25',
        createdAt: '2024-07-18T09:00:00Z',
        updatedAt: '2024-07-24T16:00:00Z',
        linkedEntity: {
            entityType: 'products',
            entityId: 4,
            entityName: 'Colágeno Marino',
        },
        tags: ['Regulatorio', 'Investigación'],
        estimatedHours: 6,
        loggedHours: 6,
    },
    {
        id: 4,
        name: 'Generar informe semanal de ventas',
        description: 'Recopilar datos de ventas de todas las plataformas y generar el informe consolidado para la reunión del lunes.',
        status: 'Pendiente',
        priority: 'Media',
        assigneeId: 2,
        creatorId: 1,
        dueDate: new Date(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7)).toISOString().split('T')[0], // Next Monday
        createdAt: '2024-07-28T09:00:00Z',
        updatedAt: '2024-07-28T09:00:00Z',
        linkedEntity: {
            entityType: 'proyectos',
            entityId: 1,
            entityName: "Proyecto Interno Q3",
        },
        tags: ['Reporting', 'Ventas'],
        recurrence: {
            frequency: 'weekly',
            interval: 1,
        },
    }
];

const DEMO_TASK_COMMENTS: TaskComment[] = [
    { id: 1, taskId: 1, authorId: 1, text: 'He asignado esto a @Sara. Prioridad alta, por favor, centrarse en los bullet points.', createdAt: '2024-07-20T10:05:00Z' },
    { id: 2, taskId: 1, authorId: 2, text: 'Recibido. Empezaré con el análisis de keywords de la competencia hoy mismo.', createdAt: '2024-07-20T11:30:00Z' },
];

const DEMO_SUBTASKS: Subtask[] = [
    { id: 1, taskId: 2, name: 'Revisar composición anterior vs nueva', isCompleted: true, assigneeId: 3 },
    { id: 2, taskId: 2, name: 'Actualizar tabla nutricional en todos los idiomas', isCompleted: true, assigneeId: 3, dueDate: '2024-08-05' },
    { id: 3, taskId: 2, name: 'Crear briefing para equipo de diseño', isCompleted: false, assigneeId: 2 },
    { id: 4, taskId: 2, name: 'Enviar arte final a imprenta', isCompleted: false, assigneeId: 1, dueDate: '2024-08-10' },
];

const DEMO_TASK_SCHEMAS: TaskSchema[] = [
    {
        id: 2,
        name: 'Lanzamiento de Nuevo Producto',
        description: 'Flujo de trabajo estándar para el lanzamiento de un nuevo producto, desde la creación del contenido hasta la publicación.',
        trigger: {
            type: 'manual'
        },
        templateTasks: [
            {
                title: 'Crear ficha de producto inicial para {nombre_del_proyecto}',
                description: 'Crear la ficha del nuevo producto en el PIM con la información básica: nombre, SKU, EAN, etc.',
                defaultAssigneeId: 2,
                dueDaysOffset: 1,
            },
            {
                title: 'Generar contenido de Marketing para {nombre_del_proyecto}',
                description: 'Rellenar todos los campos de la pestaña de Marketing: puntos fuertes, narrativa, público objetivo...',
                defaultAssigneeId: 2,
                dueDaysOffset: 3,
            },
            {
                title: 'Redactar y optimizar contenido para Amazon ES - {nombre_del_proyecto}',
                description: 'Crear el título, descripción, bullet points y keywords para el mercado español.',
                defaultAssigneeId: 3,
                dueDaysOffset: 5,
            },
        ]
    },
    {
        id: 3,
        name: 'Planificar Comunicación Post-Imprenta',
        description: 'Se activa cuando una etiqueta es aprobada por la imprenta, para planificar las comunicaciones de marketing y redes sociales.',
        trigger: {
            type: 'entity_status_change',
            entityType: 'etiquetas',
            targetStatus: 'Aprobado en imprenta',
        },
        templateTasks: [
            {
                title: 'Planificar post de lanzamiento para Instagram para {product.name}',
                description: 'Crear el borrador del post, incluyendo copy e idea de imagen/vídeo para anunciar el relanzamiento o actualización del producto con la nueva etiqueta.',
                defaultAssigneeId: 2, // Sara (Marketing)
                dueDaysOffset: 2,
            },
            {
                title: 'Agendar email a subscriptores sobre {product.name}',
                description: 'Preparar y agendar la campaña de email marketing informando a los clientes de la novedad.',
                defaultAssigneeId: 3, // Sonia (Nivel 3)
                dueDaysOffset: 3,
            }
        ]
    }
];

const DEMO_PROYECTOS: Proyecto[] = [
    {
        id: 1,
        name: 'Proyecto Interno Q3',
        taskSchemaId: 2,
        status: 'Activo',
        createdAt: '2024-07-01T09:00:00Z',
        ownerId: 1,
    }
];

const DEMO_KNOWLEDGE_BASE_ENTRIES: KnowledgeBaseEntry[] = [
    {
        id: 1,
        title: 'Advertencia General Suplementos Alimenticios ES',
        description: 'Texto legal estándar para la advertencia principal en todas las etiquetas del mercado español.',
        entryType: 'Texto',
        category: 'Textos Legales',
        tags: ['españa', 'advertencia', 'legal', 'etiqueta'],
        content: {
            text: 'No superar la dosis diaria expresamente recomendada. Los complementos alimenticios no deben utilizarse como sustitutos de una dieta variada y equilibrada y un modo de vida sano. Mantener fuera del alcance de los niños más pequeños.'
        },
        status: 'Aprobado',
        version: 2,
        parentId: 1,
        createdAt: '2024-07-10T11:00:00Z',
        updatedAt: '2024-07-10T11:00:00Z',
    },
    {
        id: 2,
        title: 'Guía de Estilo de Marca v2.1',
        description: 'Documento PDF con la guía de estilo actualizada, incluyendo logos, paleta de colores y tipografías.',
        entryType: 'Archivo',
        category: 'Guías de Marca',
        tags: ['branding', 'guia', 'diseño', 'logo'],
        content: {
            files: [{ id: 1, name: 'WellnessPro_Brand_Guide_v2.1.pdf', url: '#', comment: 'Versión final aprobada por Marketing' }]
        },
        status: 'Aprobado',
        version: 1,
        parentId: null,
        createdAt: '2024-06-15T14:00:00Z',
        updatedAt: '2024-06-15T14:00:00Z',
    },
    {
        id: 3,
        title: 'Enlace a Normativa AESAN',
        description: 'Link directo a la página de la Agencia Española de Seguridad Alimentaria y Nutrición sobre complementos alimenticios.',
        entryType: 'Enlace',
        category: 'Textos Legales',
        tags: ['aesan', 'españa', 'normativa', 'regulatorio'],
        content: {
            url: 'https://www.aesan.gob.es/AECOSAN/web/seguridad_alimentaria/subseccion/complementos_alimenticios.htm'
        },
        status: 'Aprobado',
        version: 1,
        parentId: null,
        createdAt: '2024-05-20T09:00:00Z',
        updatedAt: '2024-05-20T09:00:00Z',
    },
     {
        id: 4,
        title: 'Advertencia Alérgenos Soja ES',
        description: 'Texto legal para productos que contienen soja como alérgeno.',
        entryType: 'Texto',
        category: 'Textos Legales',
        tags: ['alérgenos', 'soja', 'españa'],
        content: {
            text: 'Contiene soja. Puede contener trazas de gluten, leche y huevo.'
        },
        status: 'Borrador',
        version: 1,
        parentId: null,
        createdAt: '2024-07-02T11:00:00Z',
        updatedAt: '2024-07-02T11:00:00Z',
    },
    {
        id: 5, // This is the old version of ID 1
        title: 'Advertencia General Suplementos Alimenticios ES',
        description: 'Texto legal estándar para la advertencia principal en todas las etiquetas del mercado español.',
        entryType: 'Texto',
        category: 'Textos Legales',
        tags: ['españa', 'advertencia', 'legal', 'etiqueta'],
        content: {
            text: 'No superar la dosis diaria recomendada. Los complementos alimenticios no deben utilizarse como sustituto de una dieta variada y equilibrada. Mantener fuera del alcance de los niños.'
        },
        status: 'Archivado',
        version: 1,
        parentId: 1,
        createdAt: '2024-07-01T10:00:00Z',
        updatedAt: '2024-07-10T11:00:00Z',
    },
    {
        id: 6,
        title: 'Buenas Prácticas para Vídeos de TikTok',
        description: 'Compendio de las mejores prácticas para crear vídeos de alto rendimiento en TikTok.',
        entryType: 'Texto',
        category: 'Buenas Prácticas',
        tags: ['tiktok', 'video', 'marketing', 'redes sociales'],
        content: {
            text: `
- **Gancho Fuerte:** Captura la atención en los primeros 3 segundos. Usa un gancho visual, una pregunta intrigante o humor.
- **Autenticidad:** Muestra el producto en uso real y cotidiano. Evita contenido demasiado pulido o corporativo.
- **Brevedad:** Mantén los vídeos cortos y directos, idealmente entre 20-40 segundos.
- **Tendencias:** Utiliza sonidos, música y hashtags en tendencia para aumentar la visibilidad.
- **SEO en TikTok:** Incluye palabras clave relevantes en los textos superpuestos, la descripción y la voz en off.
- **CTA Claro:** Termina siempre con una llamada a la acción clara (ej. "Compra ahora", "Link en bio").
- **Estilo Genuino:** El contenido que parece "casero" o generado por usuarios (UGC) funciona mejor.
`
        },
        status: 'Aprobado',
        version: 1,
        parentId: null,
        createdAt: '2024-07-28T10:00:00Z',
        updatedAt: '2024-07-28T10:00:00Z',
    },
    {
        id: 7,
        title: "Guía de Inicio Rápido para el Responsable de Contenidos",
        description: "Una guía estratégica y práctica sobre la visión, los módulos y los flujos de trabajo clave de la plataforma PIM.",
        entryType: 'Texto',
        category: 'Guías de Uso',
        tags: ['guía', 'onboarding', 'estrategia', 'documentación'],
        content: {
            text: `# Guía de Inicio Rápido: Tu Copiloto de Contenido Inteligente

## 1. Resumen Ejecutivo: Tu Centro de Mando 360°

Piensa en esta plataforma como tu **Copiloto de Contenido Inteligente**. Es el centro de operaciones unificado para toda la información y estrategia de producto. No es solo un almacén de datos, sino un **ecosistema conectado** diseñado para:

- **Centralizar:** Actuar como la única fuente de verdad para todos los datos.
- **Enriquecer:** Crear contenido de marketing potente y localizado.
- **Planificar:** Organizar y visualizar la estrategia de contenidos a corto, medio y largo plazo.
- **Automatizar:** Agilizar la producción de contenido, como vídeos, y la publicación en canales.
- **Garantizar la Calidad:** Mantener el cumplimiento normativo y la coherencia de la marca en todos los mercados.
- **Organizar el Trabajo:** Gestionar tareas y proyectos de forma contextualizada.

En resumen, es la herramienta que te permite pasar de la estrategia a la ejecución de forma rápida, coherente y controlada.

---

## 2. Desglose Exhaustivo de Módulos y Entidades

La plataforma se organiza en los siguientes módulos, que trabajan en conjunto.

### A. Módulo de Producto (El Núcleo)
Este es el corazón del sistema. Todo gira en torno al producto.
- **\`Producto\`**: Ficha maestra y fuente de verdad para un producto.
- **\`AmazonContent\` y \`ShopifyContent\`**: Contenido específico para cada canal, embebido en el \`Producto\`.
- **\`Layer2Content\`**: Motor de contenido avanzado para plataformas que lo requieren, permitiendo construir títulos y descripciones a partir de **Recetas de Contenido**.
- **\`Envase\`**: Define las características físicas de los envases.
- **\`Vídeo\`**: Catálogo final de vídeos completos y archivados. Se crea automáticamente cuando un \`VideoProject\` se marca como "Acabado".

### B. Módulo de Fabricación y Logística (Cadena de Suministro)
Gestiona el ciclo de vida de la producción.
- **\`Pedido de Fabricación (PurchaseOrder)\`**: Orden de compra a un fabricante.
- **\`Albarán (DeliveryNote)\` y \`Factura (Invoice)\`**: Documentan la recepción y los pagos.
- **\`Lote (Batch)\`**: Representa un lote de producción específico.

### C. Módulo Regulatorio y de Calidad
Asegura que nuestros productos y comunicación cumplen con la normativa.
- **\`Ingrediente\`**: Ficha maestra de cada ingrediente, con detalles legales por país.
- **\`País (Country)\`**: Define los mercados en los que operamos.
- **\`Plataforma (Platform)\`**: Define los canales de venta en los que operamos (ej. "Amazon ES").
- **\`Etiqueta\`**: Representa el diseño y contenido de una etiqueta de producto.
- **\`Notificación de Producto\`**: Herramienta para seguir el proceso de notificación sanitaria.

### D. Estudio de Vídeo (Motor Creativo y de Planificación)
Tu centro de producción de vídeo, desde la idea hasta el archivo final.
- **\`Plantilla de Secuencia (SequenceTemplate)\`**: "Ladrillos" de un vídeo; definen una escena.
- **\`Plantilla de Vídeo (VideoCompositionTemplate)\`**: "Planos" de un vídeo completo; se construyen ordenando \`Plantillas de Secuencia\`.
- **\`Proyecto de Vídeo (VideoProject)\`**: El **storyboard** y ficha de producción. Contiene toda la planificación: guion, prompts, fechas, etc.
- **\`Activo de Medios (MediaAsset)\`**: Un **clip de vídeo ya finalizado y reutilizable** (un "B-roll"). Se guarda en una biblioteca central ("Media Bin").

### E. Módulo de Mercado y Competencia (Market Tracker)
Vigila el mercado para tomar decisiones estratégicas.
- **\`Marca Competidora\` y \`Producto Competidor\`**: Permiten rastrear a nuestros competidores.
- **\`Snapshot de Producto Competidor\`**: Una "foto" del contenido de un competidor en Amazon. La IA la analiza para extraer insights.

### F. Módulo de Precios
Define y gestiona la estrategia de precios.
- **\`PVPR (Precio de Venta al Público Recomendado)\`**: Precio base de referencia por producto y país.
- **\`Regla de Precios (PricingRule)\`**: Define la lógica de precios dinámica (ej. "15% de descuento en verano").
- **\`Precio (Price)\`**: El **resultado final calculado** del precio de un producto en una plataforma.
- **\`Historial de Precios (PriceHistoryLog)\`**: Audita cada cambio de precio.

### G. Módulo de IA y Automatización
El cerebro que potencia la calidad y eficiencia del contenido.
- **\`Base de Conocimiento (KnowledgeBaseEntry)\`**: Tu biblioteca para conocimiento estratégico. No es solo un repositorio pasivo; es una **herramienta activa**. Los textos aprobados (ej. advertencias legales) pueden ser **insertados directamente** en otros módulos (como \`Etiquetas\`) mediante el Asistente de Contenido, garantizando coherencia y evitando errores.
- **\`Plantilla de IA (PromptTemplate)\`**: Instrucciones reutilizables para la IA.
- **\`Receta de Contenido (ContentRecipe)\`**: Plantillas para construir textos concatenando campos de un producto.
- **\`Término de Traducción\`**: El glosario de la empresa para asegurar coherencia en las traducciones.

### H. Publication Composer 2.0 (Centro de Publicación)
Esta es tu herramienta visual para construir ficheros de publicación complejos (ej. CSV para Amazon) sin errores.
- **\`Plantilla de Publicación\`**: No es una simple plantilla, es un **lienzo interactivo**.
    - **Paleta de Datos**: Una vista de árbol de todos los datos de tu producto que puedes arrastrar y soltar en el lienzo.
    - **Lienzo de Publicación**: Cada fila representa una columna en tu fichero final. Puedes reordenarlas, editarlas y mapear datos.
    - **Mapeo Inteligente**: Las columnas pueden ser de tipo **Estático** (texto fijo), **Mapeado** (un campo directo del PIM como \`{product.name}\`) o **Fórmula**.
    - **Motor de Fórmulas**: Transforma tus datos sobre la marcha con funciones como \`TRUNCATE\`, \`REPLACE\` o \`IF\` para adaptar el contenido a los requisitos de cada plataforma.
- **\`Trabajo de Import/Export\`**: Registra cada operación, permitiendo **deshacer importaciones** si algo sale mal.

### I. Módulo de Tareas y Gestión Operativa
Organiza el trabajo del día a día.
- **\`Tarea (Task)\`**: Una tarea individual con responsable, fecha, prioridad, etc. Puede estar vinculada a cualquier otra entidad.
- **\`Esquema de Trabajo (TaskSchema)\`**: Flujos de tareas predefinidos (plantillas) para estandarizar procesos.
- **\`Proyecto (Proyecto)\`**: Una iniciativa de alto nivel que agrupa un conjunto de tareas.

### J. Módulo de Sistema y Administración
Gestiona el funcionamiento interno.
- **\`Usuario (User)\`**: Define quién puede acceder y qué puede hacer (roles y permisos).
- **\`Registro (LogEntry)\`**: Audita cada creación, actualización o eliminación.
- **\`Nota (Note)\`**: Permite dejar comentarios y adjuntar archivos en casi cualquier entidad.
- **\`Ticket de Soporte\`**: Sistema simple para registrar incidencias de atención al cliente.

---

## 3. Flujos de Trabajo Clave para el Responsable de Contenidos

Para entender cómo se conectan los módulos, aquí tienes tres flujos de trabajo comunes:

### A. Creación de un Nuevo Producto de Principio a Fin

1.  **Producto**: Se crea la ficha de producto con los datos básicos (SKU, nombre, EAN).
2.  **Composición**: Se añaden los ingredientes desde el **Módulo Regulatorio**. El sistema calcula los %VRN automáticamente.
3.  **Marketing**: Se rellena la pestaña de Marketing con la narrativa, puntos fuertes y público objetivo.
4.  **Contenido de Canal**: Usando la IA y las **Recetas de Contenido**, se generan los títulos, descripciones y bullet points para Amazon y Shopify.
5.  **Tareas**: Se crea un **Proyecto** de "Lanzamiento de Nuevo Producto" usando un **Esquema de Trabajo**, que automáticamente genera y asigna todas las tareas necesarias (crear contenido, revisar, traducir, etc.).

### B. Lanzamiento de un Producto Existente en un Nuevo Mercado (ej. Italia)

1.  **País y Plataforma**: Se verifica que tanto Italia como la plataforma (ej. "Amazon IT") estén configurados.
2.  **Regulatorio**: Se revisa la ficha de los **Ingredientes** para asegurar que todos son permitidos en Italia y se conocen los claims autorizados.
3.  **Traducción Profesional**: Desde la ficha de **Producto**, se usa el **Asistente de IA** para traducir el contenido de Amazon. La IA utiliza automáticamente las **Reglas Globales** y el **Glosario de Traducción** para garantizar una traducción precisa y alineada con la marca.
4.  **Precios**: Se establece el **PVPR** para Italia y se verifica que las **Reglas de Precios** se apliquen correctamente para generar el precio final en "Amazon IT".
5.  **Publicación**: Se utiliza el **Publication Composer** para generar el fichero CSV de alta para "Amazon IT" con todos los datos correctos.

### C. Creación de un Vídeo de Marketing para TikTok

1.  **Estrategia**: Se consulta la **Base de Conocimiento** para leer la guía de "Buenas Prácticas para Vídeos de TikTok".
2.  **Proyecto de Vídeo**: En el **Estudio de Vídeo**, se crea un nuevo proyecto, seleccionando una **Plantilla de Vídeo** (ej. "Plantilla Rápida para TikTok").
3.  **Storyboard**: El sistema crea el storyboard inicial. Escribes los guiones de voz en off y las descripciones de las escenas.
4.  **Generación con IA**: Usas el **Asistente de IA** para convertir tus descripciones simples en prompts técnicos y detallados para la generación de imágenes y vídeo.
5.  **Composición**: Una vez generados los clips, se ensambla el vídeo, se añade música y se exporta.
6.  **Archivo**: Al marcar el proyecto como "Acabado", el sistema crea automáticamente una ficha de **Vídeo** en el catálogo principal y el clip podría guardarse como un **Activo de Medios** reutilizable.`
        },
        status: 'Aprobado',
        version: 2,
        parentId: 7,
        createdAt: '2024-08-01T10:00:00Z',
        updatedAt: '2024-08-02T12:00:00Z',
    }
];

const DEMO_KNOWLEDGE_BASE_USAGES: KnowledgeBaseUsage[] = [
    {
        id: 1,
        entryId: 1,
        entryVersion: 1, // Old version
        entityType: 'etiquetas',
        entityId: 1,
        usedAt: '2024-07-05T15:00:00Z',
        userId: 2,
    }
];

const DEMO_SEQUENCE_TEMPLATES: SequenceTemplate[] = [
    {
        id: 1,
        name: 'Intro - Revelación con Desenfoque',
        category: 'Introducciones',
        description: 'Una secuencia de apertura que empieza desenfocada y revela el producto.',
        defaultDuration: 4,
    },
    {
        id: 2,
        name: 'Demo - Rotación 360 del Producto',
        category: 'Demostraciones',
        description: 'Muestra el producto rotando lentamente para ver todos sus ángulos.',
        defaultDuration: 6,
    },
    {
        id: 3,
        name: 'Cierre - CTA Final',
        category: 'Cierres',
        description: 'Escena final con el producto, el logo de la marca y una llamada a la acción.',
        defaultDuration: 4,
    },
];

const DEMO_VIDEO_COMPOSITION_TEMPLATES: VideoCompositionTemplate[] = [
    {
        id: 1,
        name: 'Plantilla Rápida para TikTok',
        description: 'Una plantilla simple de 2 escenas: una introducción y un cierre. Ideal para vídeos cortos y directos.',
        sequenceTemplateIds: [1, 3], // Usa 'Intro - Revelación' y 'Cierre - CTA'
    },
    {
        id: 2,
        name: 'Sin Plantilla (Vídeo Genérico)',
        description: 'Inicia un proyecto de vídeo con un storyboard vacío para una máxima flexibilidad creativa.',
        sequenceTemplateIds: [],
    }
];

const DEMO_MEDIA_ASSETS: MediaAsset[] = [
    {
        id: 1,
        name: 'CTA Final con Logo Animado',
        description: 'Clip de cierre estándar con el logo de WellnessPro y un espacio para el CTA de voz en off.',
        tags: ['cierre', 'logo', 'cta'],
        duration: 4,
        imageUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=200',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        voiceoverScript: 'Encuentra el tuyo en nuestra web. ¡Link en la bio!',
    },
    {
        id: 2,
        name: 'Vitamina C - Naranjas cayendo (slow-mo)',
        description: 'Clip de recurso de naranjas frescas cayendo a cámara lenta sobre una superficie de madera.',
        tags: ['slow motion', 'recurso', 'vitamina c', 'fruta'],
        duration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1607620849332-4e4d5d4da2de?q=80&w=200',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    }
];

const DEMO_VIDEO_PROJECTS: VideoProject[] = [
    {
        id: 1,
        name: 'Lanzamiento Vitamina C en TikTok',
        description: 'Vídeo corto para la campaña de lanzamiento del Q3 en TikTok.',
        tags: ['tiktok', 'lanzamiento', 'q3'],
        plannedCreationDate: '2024-08-05',
        plannedPublicationDate: '2024-08-15',
        productId: 1,
        countryId: 1,
        languageCode: 'ES',
        compositionTemplateId: 1,
        status: 'Planificación',
        sequences: [
            {
                id: 'seq1',
                order: 0,
                sequenceTemplateId: 1,
                duration: 4,
                voiceoverScript: '¿Cansado de resfriados? Dale a tu cuerpo el escudo que necesita.',
                image: {
                    userDescription: 'El bote de Vitamina C en una mesa con naranjas.',
                    finalPrompt: 'Foto de producto cinematográfica y premium de Vitamina C 1000mg sobre una mesa de mármol, con iluminación suave y naranjas frescas alrededor.',
                    sourceUrl: 'https://images.unsplash.com/photo-1607620849332-4e4d5d4da2de?q=80&w=2592&auto=format&fit=crop'
                },
                video: {
                    userDescription: 'Empezar borroso y enfocar el bote.',
                    finalPrompt: 'Empezar completamente desenfocado y enfocar lentamente para revelar el sujeto principal de forma nítida.',
                    sourceUrl: '',
                },
                transitionToNext: 'Corte',
            },
            {
                id: 'seq2',
                order: 1,
                sequenceTemplateId: 3,
                duration: 4,
                voiceoverScript: '¡Consíguelo ya en nuestra web! Link en la bio.',
                image: {
                    userDescription: 'El bote junto al logo.',
                    finalPrompt: 'Foto de producto de Vitamina C 1000mg junto al logo de la marca "WellnessPro" claramente visible.',
                    sourceUrl: '',
                },
                video: {
                    userDescription: 'Alejar la cámara para mostrar el logo.',
                    finalPrompt: 'Hacer un zoom out muy suave desde el producto para mostrar el logo y el texto de la llamada a la acción "Link en Bio".',
                    sourceUrl: '',
                },
                transitionToNext: 'Corte',
            }
        ],
        globalSettings: {
            musicPrompt: 'Música lofi, chill y optimista.',
            useSubtitles: true,
            finalVoiceoverUrl: 'https://example.com/voiceover.mp3'
        },
        createdAt: '2024-07-25T10:00:00Z',
        updatedAt: '2024-07-25T11:30:00Z',
    },
    {
        id: 2,
        name: 'Vídeo Conciencia de Marca',
        description: 'Vídeo institucional para RRSS',
        tags: ['rrss', 'marca'],
        plannedCreationDate: '2024-08-10',
        plannedPublicationDate: '2024-08-20',
        productId: undefined,
        countryId: 1,
        languageCode: 'ES',
        status: 'Planificación',
        sequences: [],
        globalSettings: {
             finalVoiceoverUrl: ''
        },
        createdAt: '2024-07-26T14:00:00Z',
        updatedAt: '2024-07-26T14:00:00Z',
    }
];

const DEMO_PRODUCTS: Product[] = [
    {
        id: 1, name: 'Vitamina C 1000mg', sku: 'VTC-1000-01', marca: 'WellnessPro', status: 'Activo', format: 'Cápsula(s)', asin: 'B08XJ9J8XF', ean: '843658992011', units: 90,
        mainImageUrl: 'https://images.unsplash.com/photo-1607620849332-4e4d5d4da2de?q=80&w=2592&auto=format&fit=crop',
        publicationPlanning: [{
            countryId: 1, // Spain
            planningStatus: {
                textContent: { status: 'Publicado' },
                aPlusContent: { status: 'Pendiente Modificacion', observaciones: 'Falta la infografía de beneficios.' },
                publishedInStore: { status: 'Publicado' },
                videos: { status: 'Pendiente Modificacion', observaciones: 'Pendiente de subir el vídeo de lanzamiento.' }
            }
        }],
        amazonContents: [{
            countryId: 1, // Spain
            currentVersionId: 1690891200000, // Points to the latest version
            versions: [
                {
                    versionId: 1690890000000, // An older version
                    createdAt: '2023-08-01T11:00:00Z',
                    authorName: 'Admin Sistema',
                    changeReason: 'Creación inicial del producto.',
                    content: {
                        title: 'Vitamina C 1000mg con Bioflavonoides - 90 Cápsulas Veganas',
                        description: 'Nuestra Vitamina C 1000mg es tu dosis diaria de fortaleza y vitalidad. Con bioflavonoides para una absorción mejorada.',
                        bulletPoints: [
                            { text: 'POTENTE DOSIS DE 1000MG: Cada cápsula vegana aporta 1000mg de Vitamina C pura.', associatedBenefits: [] },
                            { text: 'ABSORCIÓN MEJORADA: Enriquecido con Bioflavonoides Cítricos.', associatedBenefits: [] },
                            { text: 'ENERGÍA Y VITALIDAD: Ayuda a reducir el cansancio y la fatiga.', associatedBenefits: [] },
                            { text: 'SISTEMA INMUNE REFORZADO: Refuerza tu sistema inmune.', associatedBenefits: [] },
                            { text: 'CALIDAD Y CONFIANZA: Fabricado en España. 100% vegano, sin gluten, sin lactosa.', associatedBenefits: [] }
                        ],
                        searchTerms: ['vitamina c', 'defensas', 'antioxidante', 'vegano'],
                        backendKeywords: ['sistema inmune', 'resfriado', 'energia'],
                        infographics: [],
                    }
                },
                {
                    versionId: 1690891200000, // The current, active version
                    createdAt: '2023-08-01T12:00:00Z',
                    authorName: 'Sara',
                    changeReason: 'Optimización SEO de título y BPs para campaña de invierno.',
                    content: {
                        title: 'Vitamina C 1000mg con Bioflavonoides - 90 Cápsulas Veganas - Refuerza Sistema Inmunitario - Antioxidante',
                        description: 'En un mundo que no para, tu sistema inmunitario necesita un aliado. Nuestra Vitamina C 1000mg no es solo un suplemento, es tu dosis diaria de fortaleza y vitalidad, diseñada para que sigas conquistando tus metas sin pausas. Con 1000mg por cápsula y bioflavonoides para una absorción mejorada.',
                        bulletPoints: [
                            { text: 'POTENTE DOSIS DE 1000MG: Cada cápsula vegana aporta 1000mg de Vitamina C pura, cubriendo sobradamente tus necesidades diarias para un sistema inmunitario fuerte y resistente.', associatedBenefits: [] },
                            { text: 'ABSORCIÓN MEJORADA: Enriquecido con Bioflavonoides Cítricos, nuestra fórmula garantiza una máxima absorción y eficacia, para que tu cuerpo aproveche cada miligrama.', associatedBenefits: [] },
                            { text: 'ENERGÍA Y VITALIDAD: La Vitamina C contribuye a reducir el cansancio y la fatiga, ayudándote a mantener tu nivel de energía durante todo el día.', associatedBenefits: [] },
                            { text: 'SISTEMA INMUNE REFORZADO: Refuerza tu sistema inmune justo cuando bajás el ritmo y estás más expuesta sin darte cuenta.', associatedBenefits: [] },
                            { text: 'CALIDAD Y CONFIANZA: Fabricado en España bajo los más altos estándares de calidad. Producto 100% vegano, sin gluten, sin lactosa y sin alérgenos. Suministro para 3 meses.', associatedBenefits: [] }
                        ],
                        searchTerms: ['vitamina c', 'acido ascorbico', 'defensas', 'antioxidante', 'vegano'],
                        backendKeywords: ['sistema inmune', 'resfriado', 'energia', 'colageno', 'piel'],
                        infographics: [
                            { imageUrl: 'https://images.unsplash.com/photo-1575464383418-c33116c0b398?q=80&w=200', comment: 'Infografía principal sobre beneficios de la Vitamina C', cosmoAnalysis: '', referenceImageUrl: '' }
                        ],
                    }
                }
            ],
            unversionedContent: {
                amazonVideos: [],
                amazonBenefits: [],
            }
        }],
        competitorProductIds: [1],
        composition: [
            {
                ingredientId: 1,
                quantity: 1000,
                form: 'Ácido Ascórbico',
                vrnPercentages: [
                    { countryId: 1, value: 1250 }, // ES
                    { countryId: 2, value: 1250 }, // IT
                    { countryId: 3, value: null }, // FR
                    { countryId: 4, value: null }, // DE
                    { countryId: 5, value: null }, // PT
                    { countryId: 6, value: null }, // SV
                    { countryId: 7, value: null }, // NL
                    { countryId: 8, value: null }, // PL
                    { countryId: 9, value: null }, // EN
                    { countryId: 10, value: null } // TR
                ]
            },
            {
                ingredientId: 3,
                quantity: 25,
                form: 'Extracto de Naranja Amarga',
                vrnPercentages: [
                    { countryId: 1, value: null }, // ES (no tiene VRN definido)
                    { countryId: 2, value: null },
                    { countryId: 3, value: null },
                    { countryId: 4, value: null },
                    { countryId: 5, value: null },
                    { countryId: 6, value: null },
                    { countryId: 7, value: null },
                    { countryId: 8, value: null },
                    { countryId: 9, value: null },
                    { countryId: 10, value: null }
                ]
            }
        ],
        videoIds: [1, 2],
        allowedCountryIds: [1, 2, 3, 5],
        envaseId: 1,
        puntosFuertes: 'Alta concentración de Vitamina C. Fórmula vegana y sin alérgenos. Fabricado en España.',
        puntosDebiles: 'Algunos usuarios pueden preferir comprimidos masticables. El bote es grande.',
        analisisCompetencia: 'Marcas como Solgar y Now Foods ofrecen productos similares. Nuestra ventaja es la producción local y el enfoque en bioflavonoides para la absorción.',
        resenasIaAmazon: 'Análisis pendiente de ejecutar. Se centrará en identificar quejas comunes sobre productos de la competencia (sabor, tamaño, efectos secundarios) y destacar nuestras fortalezas en contraposición.',
        publicoObjetivo: 'Personas con estilo de vida activo, preocupadas por su salud inmunológica, veganos y aquellos que buscan suplementos de alta calidad fabricados localmente.',
        keySellingPoints: '1000mg de Vitamina C por cápsula. Absorción mejorada con bioflavonoides. Suministro para 3 meses.',
        miniNarrativa: 'En un mundo que no para, tu sistema inmunitario necesita un aliado. Nuestra Vitamina C 1000mg no es solo un suplemento, es tu dosis diaria de fortaleza y vitalidad, diseñada para que sigas conquistando tus metas sin pausas.',
        sugerenciasUso: 'Tomar una cápsula por las mañanas con el desayuno para empezar el día con energía y las defensas activas. Ideal para combinar con un zumo de naranja.',
        ideasContenidoRedes: 'Post sobre "5 Mitos sobre la Vitamina C". Reel mostrando cómo incorporarla en la rutina matutina. Storie con encuesta: "¿Cuándo prefieres tomar tus vitaminas?".',
        ejemplosTestimonios: '"Desde que la tomo, siento que paso los inviernos mucho mejor". "¡Me encanta que sea vegana y fabricada aquí!". "La energía que me da por las mañanas es increíble."',
        pesoNetoEtiqueta: '120g',
        pesoNeto: 120,
        pesoEnvio: 150,
        modoUso: 'Tomar 1 cápsula al día con abundante agua, preferiblemente con una comida principal para mejorar su absorción.',
        unidadToma: 'Capsula',
        unidadesPorToma: 1,
        beneficiosGenericos: [
            'Refuerza el sistema inmunitario',
            'Potente efecto antioxidante',
            'Reduce el cansancio y la fatiga',
            'Contribuye a la formación de colágeno',
            'Mejora la salud de la piel',
            '100% Vegano y sin alérgenos'
        ],
        otrosNombres: ['Vitamina C con Bioflavonoides', 'Acido Ascorbico 1000mg'],
        informacionNutricional: 'Vitamina C (como Ácido Ascórbico): 1000mg (1250% VRN), Bioflavonoides Cítricos: 25mg. VRN = Valor de Referencia de Nutrientes.',
        alergenos: ['Sin gluten', 'Sin lactosa', 'Sin soja'],
        expiryInMonths: 36,
        unitWeight: 1.3,
        recommendedDailyDose: "1 cápsula al día",
        netQuantityLabel: "90 cápsulas",
        netQuantityNutritionalInfo: "Peso Neto: 117g",
        envaseColor: "Ambar translúcido",
        tapaColor: "Blanca",
        hasRepercap: true,
        isRepercapScreenPrinted: false,
        barcodeImageUrl: "https://barcode.tec-it.com/barcode.ashx?data=843658992011&code=EAN13&imagetype=Jpg",
        layer2Content: {
            title: {
                recipeId: 1,
                spanishContent: {
                    rawConcatenated: "Vitamina C 1000mg | Capsula | 90",
                    aiRevised: "Vitamina C 1000mg en 90 Cápsulas",
                    finalVersion: "Vitamina C 1000mg en 90 Cápsulas Fáciles de Tragar"
                },
                translations: [
                    { lang: 'IT', finalVersion: "Vitamina C 1000mg in 90 Capsule Facili da Deglutire" }
                ]
            },
            description: {
                recipeId: 2,
                spanishContent: {
                    rawConcatenated: 'Refuerza el sistema inmunitario. Potente efecto antioxidante. Reduce el cansancio y la fatiga.',
                    finalVersion: 'Fortalece tu sistema inmunitario con nuestro potente antioxidante. Ideal para combatir el cansancio y la fatiga diarios, ayudándote a mantener tu energía.'
                },
                translations: []
            }
        }
    },
    { id: 2, name: 'Omega 3', sku: 'OMG-3-01', marca: 'WellnessPro', status: 'Activo', amazonContents: [], videoIds: [] },
    { id: 4, name: 'Colágeno Marino', sku: 'COL-M-01', marca: 'WellnessPro', status: 'Activo', amazonContents: [], videoIds: [] }
];
const DEMO_COUNTRIES: Country[] = [
    { id: 1, name: 'España', iso: 'ES' },
    { id: 2, name: 'Italia', iso: 'IT' },
    { id: 3, name: 'Francia', iso: 'FR' },
    { id: 4, name: 'Alemania', iso: 'DE' },
    { id: 5, name: 'Portugal', iso: 'PT' },
    { id: 6, name: 'Suecia', iso: 'SV' },
    { id: 7, name: 'Holanda', iso: 'NL' },
    { id: 8, name: 'Polonia', iso: 'PL' },
    { id: 9, name: 'Reino Unido', iso: 'EN' },
    { id: 10, name: 'Turquía', iso: 'TR' },
];
const DEMO_PLATFORMS: Platform[] = [
    { id: 1, name: 'Amazon ES', countryId: 1, type: 'Marketplace', status: 'Activa', shipsBy: 'Platform' },
    { id: 2, name: 'Amazon IT', countryId: 2, type: 'Marketplace', status: 'Activa', shipsBy: 'Platform' },
];
const DEMO_ENVASES: Envase[] = [
    { id: 1, name: 'Bote Estándar 120cc', tipo: 'Bote', fotoUrl: 'https://images.unsplash.com/photo-1607620849332-4e4d5d4da2de?q=80&w=200', height: 110, width: 60, peso: 25, capacidad: '120cc / 90 cápsulas' },
];
const DEMO_VIDEOS: Video[] = [
    { id: 1, name: 'Video Vitamina C', url: '#', platform: 'TikTok', type: 'Producto', duration: 60, status: 'Publicado', countryId: 1 },
    { id: 2, name: 'Video Marca', url: '#', platform: 'YouTube', type: 'Marca', duration: 120, status: 'Publicado', countryId: 1 },
];
const DEMO_INGREDIENTS: Ingredient[] = [
    { 
        id: 1, 
        latinName: 'Vitamina C', 
        type: 'Componente Activo', 
        measureUnit: 'mg', 
        countryDetails: [
            { countryId: 1, name: 'Vitamina C', status: 'Permitido', permittedClaims: ["Contribuye al funcionamiento normal del sistema inmunitario"], labelDisclaimers: [] },
            { countryId: 2, name: 'Vitamina C', status: 'Permitido', permittedClaims: ["Contribuisce alla normale funzione del sistema immunitario"], labelDisclaimers: [] }
        ] 
    },
    { 
        id: 3, 
        latinName: 'Bioflavonoides Cítricos', 
        type: 'Componente Activo', 
        measureUnit: 'mg', 
        countryDetails: [
             { countryId: 1, name: 'Bioflavonoides Cítricos', status: 'Permitido', permittedClaims: ["Fuente de antioxidantes"], labelDisclaimers: ["No apto para menores de 18 años."] }
        ] 
    },
];
const DEMO_ETIQUETAS: Etiqueta[] = [
    {
        id: 1,
        identifier: 'VTC-1000-01-v01',
        productId: 1,
        createdAt: '2024-07-15T10:00:00Z',
        status: 'En el mercado',
        creationType: 'Etiqueta 0',
        contentByLanguage: [
            {
                lang: 'ES',
                productName: 'Vitamina C 1000mg con Bioflavonoides',
                contenido: 'Tomar 1 cápsula al día con abundante agua, preferiblemente con una comida principal para mejorar su absorción.',
                alergenos: ['Sin gluten', 'Sin lactosa']
            }
        ],
        ingredientSnapshot: [
            {
                ingredientId: 1,
                quantity: 1000,
                measureUnit: 'mg',
                translations: [
                    { lang: 'ES', name: 'Vitamina C', vrn: '1250%', permittedClaims: ["Contribuye al funcionamiento normal del sistema inmunitario"], labelDisclaimers: [] },
                    { lang: 'IT', name: 'Vitamina C', vrn: '1250%', permittedClaims: ["Contribuisce alla normale funzione del sistema immunitario"], labelDisclaimers: [] },
                ]
            },
            {
                ingredientId: 3,
                quantity: 25,
                measureUnit: 'mg',
                translations: [
                     { lang: 'ES', name: 'Bioflavonoides Cítricos', vrn: '-', permittedClaims: ["Fuente de antioxidantes"], labelDisclaimers: ["No apto para menores de 18 años."] },
                     { lang: 'IT', name: 'Bioflavonoidi di Agrumi', vrn: '-', permittedClaims: [], labelDisclaimers: [] },
                ]
            }
        ]
    },
    {
        id: 2,
        identifier: 'OMG-3-01-v01',
        productId: 2,
        createdAt: '2024-08-01T10:00:00Z',
        status: 'Pendiente enviar a imprenta',
        creationType: 'Etiqueta 0',
        contentByLanguage: [],
        ingredientSnapshot: []
    }
];
const DEMO_TRANSLATION_TERMS: TranslationTerm[] = [
    {
        id: 1,
        spanish: 'Ingredientes',
        translations: [
            { lang: 'IT', value: 'Ingredienti' },
            { lang: 'FR', value: 'Ingrédients' },
            { lang: 'DE', value: 'Zutaten' },
            { lang: 'EN', value: 'Ingredients' },
            { lang: 'PT', value: 'Ingredientes'},
            { lang: 'NL', value: 'Ingrediënten'},
            { lang: 'PL', value: 'Składniki'},
            { lang: 'SV', value: 'Ingredienser'},
            { lang: 'TR', value: 'İçindekiler'}
        ]
    },
    {
        id: 2,
        spanish: 'Información Nutricional',
        translations: [
            { lang: 'IT', value: 'Informazioni Nutrizionali' },
            { lang: 'FR', value: 'Informations Nutritionnelles' },
            { lang: 'DE', value: 'Nährwertinformationen' },
            { lang: 'EN', value: 'Nutritional Information' },
            { lang: 'PT', value: 'Informação Nutricional'},
            { lang: 'NL', value: 'Voedingswaarde-informatie'},
            { lang: 'PL', value: 'Informacje o wartościach odżywczych'},
            { lang: 'SV', value: 'Näringsinformation'},
            { lang: 'TR', value: 'Beslenme Bilgileri'}
        ]
    },
    {
        id: 3,
        spanish: 'Modo de empleo',
        translations: [
            { lang: 'IT', value: 'Modalità d\'uso' },
            { lang: 'FR', value: 'Conseils d\'utilisation' },
            { lang: 'DE', value: 'Anwendung' },
            { lang: 'EN', value: 'How to use' },
            { lang: 'PT', value: 'Modo de utilização'},
            { lang: 'NL', value: 'Gebruiksaanwijzing'},
            { lang: 'PL', value: 'Sposób użycia'},
            { lang: 'SV', value: 'Hur man använder'},
            { lang: 'TR', value: 'Nasıl kullanılır'}
        ]
    },
    {
        id: 4,
        spanish: 'Información sobre alérgenos',
        translations: [
            { lang: 'IT', value: 'Informazioni sugli allergeni' },
            { lang: 'FR', value: 'Informations sur les allergènes' },
            { lang: 'DE', value: 'Allergeninformationen' },
            { lang: 'EN', value: 'Allergen Information' },
            { lang: 'PT', value: 'Informações sobre alergénios'},
            { lang: 'NL', value: 'Allergeneninformatie'},
            { lang: 'PL', value: 'Informacje o alergenach'},
            { lang: 'SV', value: 'Allergeninformation'},
            { lang: 'TR', value: 'Alerjen Bilgileri'}
        ]
    },
    {
        id: 5,
        spanish: 'Advertencias',
        translations: [
            { lang: 'IT', value: 'Avvertenze' },
            { lang: 'FR', value: 'Avertissements' },
            { lang: 'DE', value: 'Warnhinweise' },
            { lang: 'EN', value: 'Warnings' },
            { lang: 'PT', value: 'Avisos'},
            { lang: 'NL', value: 'Waarschuwingen'},
            { lang: 'PL', value: 'Ostrzeżenia'},
            { lang: 'SV', value: 'Varningar'},
            { lang: 'TR', value: 'Uyarılar'}
        ]
    }
];

export const DEMO_DATA: AppData = {
    products: DEMO_PRODUCTS,
    countries: DEMO_COUNTRIES,
    platforms: DEMO_PLATFORMS,
    tickets: [],
    envases: DEMO_ENVASES,
    etiquetas: DEMO_ETIQUETAS,
    videos: DEMO_VIDEOS,
    ingredients: DEMO_INGREDIENTS,
    notes: [],
    translationTerms: DEMO_TRANSLATION_TERMS,
    productNotifications: [],
    productPlatformStatuses: [],
    competitorBrands: [],
    competitorProducts: [
        { id: 1, competitorBrandId: 1, countryId: 1, asin: 'B012345678', name: 'Competitor Vit C', snapshots: [] },
    ],
    contentRecipes: [
        { id: 1, name: 'Título Estándar', target: 'title', parts: [] },
        { id: 2, name: 'Descripción Estándar', target: 'description', parts: [] },
    ],
    promptTemplates: DEMO_PROMPT_TEMPLATES,
    logs: [],
    importExportTemplates: PUBLICATION_PRESETS,
    importJobs: [],
    exportJobs: [],
    importJobChangeLogs: [],
    aiSettings: { globalTranslationRules: 'No traducir la marca "WellnessPro".' },
    pvprs: DEMO_PVPRS,
    prices: [],
    pricingRules: DEMO_PRICING_RULES,
    priceHistoryLogs: [],
    amazonFlashDeals: DEMO_AMAZON_FLASH_DEALS,
    users: DEMO_USERS,
    tasks: DEMO_TASKS,
    taskComments: DEMO_TASK_COMMENTS,
    taskSchemas: DEMO_TASK_SCHEMAS,
    subtasks: DEMO_SUBTASKS,
    proyectos: DEMO_PROYECTOS,
    knowledgeBaseEntries: DEMO_KNOWLEDGE_BASE_ENTRIES,
    knowledgeBaseUsages: DEMO_KNOWLEDGE_BASE_USAGES,
    sequenceTemplates: DEMO_SEQUENCE_TEMPLATES,
    videoCompositionTemplates: DEMO_VIDEO_COMPOSITION_TEMPLATES,
    videoProjects: DEMO_VIDEO_PROJECTS,
    mediaAssets: DEMO_MEDIA_ASSETS,
// FIX: Added empty arrays for new manufacturing entities to satisfy the AppData type.
    purchaseOrders: [],
    batches: [],
    deliveryNotes: [],
    invoices: [],
};