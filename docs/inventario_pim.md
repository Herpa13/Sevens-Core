# Inventario del PIM

## Frontend detectado
- **Ubicación**: la aplicación PIM actual vive en la raíz del repositorio y está construida con React + TypeScript.
- **Arquitectura**: se apoya en componentes (`components`), vistas (`views`), datos iniciales (`data`) y servicios (`services`).

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

## Datos iniciales
El fichero `data/initialAppData.ts` define la estructura base con listas vacías para todas las entidades del PIM. Los datos reales se cargan desde el CORE mediante el cliente HTTP.

## Operaciones clave
Implementadas principalmente en `services` y `utils`:
- `resolveFormula` y `resolveCellValue` para cálculos de campos dinámicos (`services/formulaService.ts`).
- `generateContentFromTemplate` para generar texto con Gemini (`services/geminiService.ts`).
- `resolvePrompt` para sustituir placeholders en plantillas (`services/placeholderService.ts`).
- `calculatePrice` y `calculateFinalCustomerPrice` para lógica de precios (`services/pricingService.ts`).
- Utilidades de soporte: autenticación, seguimiento de cambios, manejo de ficheros, utilidades de tareas y registro de vistas (`utils/*`).

