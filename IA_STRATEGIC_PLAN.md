# Plan Estratégico de IA 2.0: El Copiloto de Contenido Inteligente y Controlado

## Visión General

Evolucionamos de un simple generador de texto a un **Copiloto de Contenido Inteligente**. La IA no solo creará y traducirá, sino que lo hará siguiendo directrices de marca, terminología específica y reglas de negocio, garantizando coherencia y calidad profesional en todos los canales y mercados. La base es un motor de placeholders dinámicos, enriquecido con una capa de **control y contexto**.

---

## Fase 1: El Motor de Placeholders Dinámicos y Contexto (Fundación)

Este pilar permite inyectar *cualquier* dato del PIM en un prompt de IA, haciendo que las peticiones a la IA sean ricas en contexto.

*   **Objetivo:** Reemplazar el sistema de reemplazo de texto simple por un motor de resolución de placeholders robusto y escalable.
*   **Componentes Clave:**
    1.  **Servicio de Resolución (`placeholderService.ts`):** Una utilidad central `resolvePrompt(template, context)` que toma una plantilla de texto y un objeto de datos (el contexto) y devuelve el prompt final.
    2.  **Sintaxis Estandarizada:** Se utiliza una sintaxis de **dot-notation** (ej. `{product.name}`, `{product.composition[0].quantity}`) para acceder a cualquier campo, anidado o en arrays.
    3.  **Asistente de Placeholders en la UI:** En el editor de plantillas, se añade un panel interactivo con una **vista de árbol** del modelo de datos. El usuario puede hacer clic en un campo para insertar automáticamente el placeholder correcto, eliminando errores y la necesidad de memorización.

---

## Fase 2: Módulo de Traducción Profesional (Control y Coherencia)

Integramos los requisitos para elevar las traducciones a un nivel profesional y controlado por la marca.

1.  **Modelo de Datos para Reglas y Glosario:**
    *   Se crea una entidad de configuración (`AISettings`) para almacenar **Reglas Globales de Traducción** (ej. "Nunca traduzcas el nombre de la marca 'Sevens Nutrition'").
    *   El sistema de **Términos de Traducción (`TranslationTerm`)** actúa como un glosario dinámico que la IA debe seguir.

2.  **Servicio de Construcción de Prompts Inteligentes:**
    *   El servicio de IA (`geminiService`) ahora realiza un **"enriquecimiento de prompt"** antes de cada llamada de traducción.
    *   **Flujo de trabajo:**
        1.  Cargar la plantilla de traducción seleccionada.
        2.  Cargar los datos base (producto, texto a traducir, idioma destino).
        3.  **Cargar y formatear** las reglas globales y el glosario completo.
        4.  Construir un **contexto enriquecido** que incluye el producto, las reglas y el glosario.
        5.  Resolver el prompt final usando el `placeholderService`.
        6.  Enviar el prompt completo y contextualizado a la API de Gemini.

3.  **Plantillas de Traducción Evolucionadas:**
    *   Las plantillas de traducción se actualizan para incluir placeholders específicos para las reglas y el glosario:
        ```
        Eres un traductor profesional para la marca 'WellnessPro'.

        REGLAS OBLIGATORIAS:
        {global_rules}

        GLOSARIO OBLIGATORIO:
        {glossary}

        Traduce el siguiente texto a {idioma_destino}:
        "{texto_bruto}"
        ```

4.  **UI para la Gestión de Reglas:**
    *   Se crea una nueva vista en "Ajustes de IA" para que los administradores puedan editar fácilmente las reglas globales de traducción.

---

## Fase 3: Flujos de Trabajo Avanzados (Potenciados por la nueva inteligencia)

Con la nueva arquitectura, las funcionalidades se vuelven más robustas y fiables.

1.  **Asistente de IA Reutilizable (`AIAssistantButton`):**
    *   Se crea un componente de botón único (con un icono de "varita mágica") que se puede colocar junto a cualquier campo de texto.
    *   Al hacer clic, muestra un menú de acciones de IA relevantes (Revisar, Traducir, Generar) basadas en plantillas filtradas por categoría y tipo de entidad.
    *   Encapsula toda la lógica de construcción de contexto y llamada a la IA, simplificando enormemente la integración en nuevas vistas.

2.  **Generación de Contenido Multi-Canal con un Clic:**
    *   Un botón "Generar y traducir para todos los mercados" no solo traduce, sino que lo hace **aplicando el glosario y las reglas de marca**. Esto garantiza que el contenido para Amazon FR, DE, IT, etc., sea consistente y profesional desde el primer momento.

3.  **Auditoría de Calidad de Contenido Asistida por IA:**
    *   Se pueden crear plantillas de "Análisis" para que la IA supervise la calidad del contenido.
    *   **Ejemplo de Prompt de Análisis:** `"Revisa esta descripción para el mercado italiano: '{product.amazonContents.IT.description}'. Verifica dos cosas: 1) ¿Se han usado correctamente las traducciones del glosario {glossary}? 2) ¿Se han respetado las reglas globales {global_rules}? Lista cualquier inconsistencia."`

### Resumen de la Arquitectura de IA

El sistema crea una estructura de tres capas:
1.  **Capa de Datos (PIM):** Toda la información de productos, países, etc.
2.  **Capa de Inteligencia (El Motor):**
    *   **Motor de Placeholders:** Accede a la capa de datos.
    *   **Motor de Reglas y Glosario:** Proporciona las directrices de control.
    *   **Constructor de Prompts:** Une los datos, las reglas y las plantillas para crear una instrucción perfecta para la IA.
3.  **Capa de Ejecución (Gemini API):** Ejecuta la instrucción.

Este enfoque transforma a la IA de una simple herramienta a un miembro del equipo informado y obediente, capaz de ejecutar tareas complejas con un alto grado de precisión y coherencia de marca.