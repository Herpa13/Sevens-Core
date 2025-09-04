# Inventario del PIM

## Frontend detectado
- **Ubicación**: la aplicación PIM actual vive en la raíz del repositorio y está construida con React + TypeScript.
- **Arquitectura**: se apoya en componentes (`components`), vistas (`views`), datos mock (`data`) y servicios (`services`).

## Entidades principales
Lista derivada de `types/index.ts` (estructura `AppData`):
- products
- countries
- platforms
- tickets
- envases
- etiquetas
- videos
- ingredients
- notes
- translationTerms
- productNotifications
- productPlatformStatuses
- competitorBrands
- competitorProducts
- contentRecipes
- promptTemplates
- logs
- importExportTemplates
- importJobs
- exportJobs
- importJobChangeLogs
- aiSettings
- pvprs
- prices
- pricingRules
- priceHistoryLogs
- amazonFlashDeals
- users
- tasks
- taskComments
- taskSchemas
- subtasks
- proyectos
- knowledgeBaseEntries
- knowledgeBaseUsages
- sequenceTemplates
- videoCompositionTemplates
- videoProjects
- mediaAssets
- purchaseOrders
- batches
- deliveryNotes
- invoices

## Mocks disponibles
El fichero `data/mockData.ts` proporciona datos simulados para la mayoría de las entidades anteriores. Ejemplos destacados:
- Productos, países, plataformas y envases.
- Etiquetas, ingredientes y términos de traducción.
- Recetas de contenido, plantillas de prompts y reglas de precios.
- Usuarios, tareas, subtareas y comentarios.
- Proyectos, entradas de base de conocimiento y plantillas de secuencia.
- Entidades de fabricación (`purchaseOrders`, `batches`, `deliveryNotes`, `invoices`) inicializadas como listas vacías.

## Operaciones clave
Implementadas principalmente en `services` y `utils`:
- `resolveFormula` y `resolveCellValue` para cálculos de campos dinámicos (`services/formulaService.ts`).
- `generateContentFromTemplate` para generar texto con Gemini (`services/geminiService.ts`).
- `resolvePrompt` para sustituir placeholders en plantillas (`services/placeholderService.ts`).
- `calculatePrice` y `calculateFinalCustomerPrice` para lógica de precios (`services/pricingService.ts`).
- Utilidades de soporte: autenticación, seguimiento de cambios, manejo de ficheros, utilidades de tareas y registro de vistas (`utils/*`).

