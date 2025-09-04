# OPERATING_PLAN_CORE_DESDE_PIM_AWS

> **Alcance**: Partimos del **PIM (frontend mockeado)** que ya existe en el repo y, **sin tocarlo**, levantamos un **CORE** (BD + API) en AWS reutilizando **la misma filosofía e infraestructura** ya creada para SP‑API (API Gateway + Lambda, Secrets, SQS/S3, CI/CD), **pero sin incluir la app SP‑API** en este plan. Dejamos un **playbook repetible** para añadir **nuevos frontends mockeados** en un directorio del repositorio, que vayan ampliando contratos, BD y endpoints de forma incremental.

---

## 0) Guardarraíl (idéntico estilo a tus planes)
- **Node 18**, **Yarn Classic 1.22.22**, **CommonJS**.
- **Monorepo** con workspaces: reutilizar el **frontend existente**; **NO** generar otro.
- **Contratos Zod** en `packages/shared` = **fuente de verdad**.
- **Prisma** + **PostgreSQL** (dev y RDS en cloud).
- **NestJS + Fastify** (API) con `ZodValidationPipe` global; validación **in/out**.
- **Gates** CI: `check:entities`, `check:nomocks`, `parity`, `test`, `build`.
- **Política logs**: sin PII; entornos separados; flags `WRITE_ENABLED`, `DRY_RUN`, `SAFE_MODE`.

**Variables de entorno mínimas**
- Backend: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `WRITE_ENABLED`, `DRY_RUN`, `SAFE_MODE`.
- Frontend(s): `VITE_API_BASE`.

---

## 1) Estructura de repositorio (propuesta)
```
/platform
  /apps
    core-gateway            # API CORE (Nest + Fastify)
  /frontends
    pim-frontend            # (YA EXISTE) PIM mockeado
    <nuevo-frontend>/       # cada mock futuro aquí
  /packages
    shared/                 # contratos Zod + DTOs
    db/                     # Prisma schema + client
    core-observ/            # logger/metrics/tracing
    core-auth/              # auth mínima (JWT/API key por tenant)
    core-http/              # http client común (si aplica)
  /infra
    cdk-core/               # RDS + API GW + Lambda + SQS + S3 + Secrets (reutiliza filosofía SP-API)
  /docs
    OPERATING_PLAN_CORE_DESDE_PIM_AWS.md
```

> **Nota**: los **nuevos frontends** vivirán en `/frontends/<nombre>`.

---

## 2) Modelo de datos CORE (mínimo v1)
- **Tenancy**: `Company` → `Brand` → `Product/Variant` **(en PIM)**. En CORE **solo** referenciamos `productId/variantId` (no duplicar fichas).
- **Inventario**: `Warehouse`, `Lot`, `StockItem`, `InventoryMovement` (ADJUSTMENT, PO_RECEIPT, SALE, RETURN, TRANSFER_*).
- **Compras** (si hace falta en v1): `Supplier`, `PurchaseOrder(+Line)`, `GoodsReceipt(+Line)`, `SupplierInvoice`.
- **Ventas** (ingesta desde conectores en el futuro): `SalesOrder(+Line)`, `Shipment`.
- **Publicación** (capas estables por canal, sin dependencias aquí): `Listing` (mapea `variantId` ↔ seller/site).

**Únicos recomendados**: `Brand(companyId, slug|name)`, `SellerAccount(companyId, channelSiteId)`, `Listing(sellerAccountId, variantId)`, `Warehouse(companyId, code)`, `StockItem(warehouseId, variantId, lotId)`.

---

## 3) Endpoints CORE (v1)
- **Tenancy**: `GET/POST /companies`, `GET/POST /brands`.
- **Bridge PIM**: `POST /sync/pim/product`, `POST /sync/pim/variant` (valida cadena product→brand→company; no duplica PIM).
- **Inventario**: `GET /stock`, `POST /stock/adjust`, `GET /inventory/movements`.
- (Opcional v1) **Compras**: `GET/POST /suppliers`, `POST /purchase-orders`, `POST /goods-receipts`.

> En próximos frontends mock: ampliar módulos/DTOs y migraciones sin romper contratos.

---

## 4) Tareas paso a paso (para usar con Codex)

### TAREA A — Inventario del PIM (solo lectura)
**Objetivo**: detectar el **frontend PIM** y el **inventario de entidades** (tipos/mocks/operaciones).
**Entrega**: informe en `/docs` y **PR** sin cambios de código.

### TAREA B — Monorepo y workspaces (sin tocar la UI)
**Objetivo**: activar workspaces e incorporar `packages/shared`, `packages/db`, `apps/core-gateway`.
**Entrega**: scripts root (`bootstrap`, `lint`, `typecheck`, `test`, `build:all`, `dev`), UI intacta.

### TAREA C — Contratos Zod en `shared` + Matriz de Paridad
**Objetivo**: contratos por **todas** las entidades usadas por el PIM y **matriz** `frontend ↔ shared`.
**Entrega**: `yarn check:entities` y reporte de paridad.

### TAREA D — DB CORE v1 (Prisma + seeds)
**Objetivo**: `schema.prisma` con Tenancy + Inventario (mínimo), referenciando IDs de PIM.
**Entrega**: migración `core_init_v1`, `db:seed` (1 company, 1 brand, channels/sites ES/IT, 1 warehouse).

### TAREA E — API CORE v1 (Nest + Zod pipes)
**Objetivo**: exponer Tenancy + Bridge PIM + Inventario. Tests e2e básicos.
**Entrega**: health/ready 200; contratos **in/out** Zod.

### TAREA F — Infra AWS mínima (reutiliza filosofía existente)
**Objetivo**: CDK para **API GW + Lambda** (core-gateway), **RDS Postgres**, **Secrets**, **SQS**/**S3** (si aplica).
**Entrega**: `cdk synth` y outputs con endpoints/ARNs.

### TAREA G — Conectar el PIM (sustituir mocks gradualmente)
**Objetivo**: cliente HTTP en el PIM usando `VITE_API_BASE`; activar `check:nomocks` en **warn** hasta completar sustitución.
**Entrega**: PIM operativo contra CORE; paridad 100% `frontend↔shared`.

---

## 5) Playbook para **añadir un nuevo frontend mock**
> Directorio: `/frontends/<nombre>`

1) **Contratos**: añade/ajusta Zod en `packages/shared` para las nuevas entidades.
2) **BD**: extiende `schema.prisma` y crea migración segura (campos opcionales primero si hay datos; luego endurecer).
3) **API**: crea módulo(s) Nest por entidad (service/controller, DTOs Zod, tests e2e).
4) **Frontend**: cliente HTTP y sustitución de mocks por llamadas reales a CORE.
5) **Paridad/CI**: asegura `check:entities`, `check:nomocks`, `parity` y tests.

**Scaffolding (opcional)**
- `yarn scaff:entity <Name>` → genera stubs coordinados (shared/prisma/nest/tests).
- `yarn scaff:frontend <name>` → crea esqueleto de `/frontends/<name>` con cliente preconfigurado.

**Criterios de aceptación (por frontend)**
- UI compilando y funcionando contra CORE.
- Paridad 100% (matriz y script `parity`).
- Tests unit/e2e mínimos por entidad.

---

## 6) Despliegue y entornos **100% en AWS**
- **Nada en local**: desarrollo, pruebas y staging en **AWS**.
- **Repos**: GitHub (o CodeCommit). CI/CD despliega a AWS.
- **Entornos**: `dev` (cuenta A) → `sbx` (cuenta B) → `prod` (cuenta C) con **AWS Organizations** y **IAM Identity Center**.

### 6.1 Có mputo/API
- **API Gateway (HTTP)** + **Lambda (Node 18)** para `apps/core-gateway`.
- **S3 + CloudFront** para servir el **PIM-frontend** y los futuros frontends mock.

### 6.2 Datos y secretos
- **RDS for PostgreSQL** (gp3): `dev` single‑AZ; `sbx/prod` Multi‑AZ.
- **Secrets Manager**: `DATABASE_URL` (RDS), `JWT_SECRET`, API Keys por tenant.
- **S3** (`core-artifacts-<stage>`): exports/imports; versioning ON.

### 6.3 Red y seguridad
- **VPC** con subredes privadas para RDS y Lambdas; **VPC Endpoints** a S3/Secrets/Logs.
- **Security Groups**: sólo Lambdas del CORE acceden a RDS.
- **KMS** para cifrado en RDS/S3/Secrets.
- **WAF** opcional delante de API Gateway (prod).

### 6.4 Observabilidad y costes
- **CloudWatch Logs/Metrics** + alarmas 5xx/latencia y RDS (CPU, conexiones, disco).
- **X‑Ray** opcional.
- **AWS Budgets** con alertas por entorno.

### 6.5 CDK (infra/cdk-core)
- Stacks por entorno: `Core-VPC`, `Core-DB`, `Core-API`, `Core-Buckets`, `Core-Secrets`, `Core-Frontends`.
- Parámetros por `-c stage=dev|sbx|prod`.

### 6.6 Seeder y migraciones **en AWS**
- **Prisma Migrate** ejecutado desde **CodeBuild** (o Action) apuntando a RDS.
- Job **CodeBuild “db-migrate”** que corre en cada despliegue (idempotente).

---

## 7) CI/CD y gates **en AWS**
- **CI** (GitHub Actions *o* CodeBuild/CodePipeline):
  1. `yarn install`
  2. `check:entities`, `check:nomocks`, `parity`, `test`, `build:all`
  3. `cdk synth` y **deploy** a `dev` (auto), `sbx/prod` (con aprobación manual)
- **Artefactos**: empaquetado de `core-gateway` (Lambda), `frontends/*` (S3/CloudFront invalidation).
- **Variables/Secrets**: GitHub → OIDC hacia AWS (sin claves largas) o usar CodePipeline con Secrets.

---

- **CI**: `yarn install`, `check:entities`, `check:nomocks`, `parity`, `test`, `build:all`.
- **Bloqueo de PR** si falla cualquier gate.
- **Plantilla de PR**: DoD, riesgos, pasos de prueba, checklist, verificación del guardarraíl.

---

## 8) Seguridad y observabilidad
- **CORS** acotado; **Helmet**; **logger** estructurado con `request-id`.
- **Métricas** (p50/95/99, 2xx/4xx/5xx, latencia por operación) y trazas (X‑Ray/OpenTelemetry opcional).
- **Auditoría mínima** de operaciones mutadoras y de acceso a datos sensibles.

---

## 9) Roadmap sugerido (a ritmo pausado)
1. **PIM→CORE**: Tareas A→G.
2. **Frontend “Fábrica”** (pedidos a fábrica + recepciones): playbook, activa Compras/Recepciones en CORE.
3. **Frontend “Pedidos Cliente”**: playbook, activa Ventas/Shipments en CORE.
4. **Conectores externos** (fuera de este plan): integrar con APIs de terceros **como apps separadas** que leen/escriben del CORE.

---

## 10) Frases cortas para aprobar/denegar PRs
- “Aprobado. Ejecuta **TAREA B — Monorepo y workspaces**.”
- “No aprobado. Corrige `yarn check:entities` y re‑lanza el PR.”
- “Aprobado. Ejecuta **TAREA F — Infra AWS mínima**.”
- “Aprobado. Conecta PIM a CORE (TAREA G) y deja `check:nomocks` en modo estricto.”



---

## Anexo A — Playbook para unir un nuevo frontend mock (100% AWS)

> Usa este anexo cada vez que quieras añadir un **nuevo frontend mockeado** al CORE, **sin tocar lo existente** y **todo en AWS** (RDS/Prisma vía CodeBuild, API Gateway + Lambda, S3/CloudFront, CDK, CI/CD).

### Opción 1 — Prompt maestro (flujo completo con placeholders)

> **Pega tal cual** en Codex y reemplaza `<NombreFrontend>`, `<Entidades>` y `<ResumenFuncional>`.

```text
Contexto:
- Monorepo con CORE en AWS (API Gateway + Lambda Node 18 + RDS Postgres + Secrets + S3/CloudFront + CDK).
- No tocar el PIM ya existente.
- 100% AWS (nada local). Migraciones Prisma vía CodeBuild. Deploy via CI/CD.

Objetivo:
Crear y unir un nuevo frontend mockeado llamado <NombreFrontend>, que cubre <ResumenFuncional>, y que:
1) Define/ajusta contratos Zod en packages/shared para <Entidades>.
2) Extiende la BD (Prisma) y crea migración + seed idempotente.
3) Expone endpoints Nest en apps/core-gateway con DTOs Zod + tests e2e.
4) Crea el frontend en /frontends/<NombreFrontend> con mock → cliente HTTP real al CORE.
5) Añade infra (S3 + CloudFront) en infra/cdk-core, pipeline de deploy a dev/sbx/prod.
6) Entrega PRs pequeños por fase con DoD y gates (check:entities, parity, test, build, cdk synth).

Restricciones/guardarraíl:
- Node 18 CJS, Yarn 1.22.22, Zod, Prisma, Nest Fastify, logs sin PII.
- 100% AWS: migraciones Prisma en CodeBuild; no ejecutar nada local.
- Mantener matriz de paridad frontend↔shared.
- Flags prod: WRITE_ENABLED=false, DRY_RUN=true, SAFE_MODE=true.

Tareas y PRs (por fases):
Fase 1 — Contratos
- Añadir/ajustar Zod en packages/shared para <Entidades>.
- Generar/actualizar matriz de paridad y script check:entities.
- PR: "FE-<NombreFrontend> · contratos Zod + paridad".
Criterios de aceptación: check:entities y parity = OK en CI.

Fase 2 — BD (Prisma)
- Extender schema.prisma con tablas/cambios derivados de los contratos.
- Crear migración "add_<NombreFrontend>_v1" y seed complementario.
- Pipeline CodeBuild "db-migrate" que aplica migraciones en RDS dev.
- PR: "FE-<NombreFrontend> · Prisma + migración + seed + job CodeBuild".
Criterios: CodeBuild db-migrate dev = OK. RDS dev actualizado.

Fase 3 — API (Nest)
- Módulos y endpoints para <Entidades>, validación in/out con Zod.
- Tests e2e (Supertest) + OpenAPI actualizado.
- PR: "FE-<NombreFrontend> · API + e2e + OpenAPI".
Criterios: /health y /ready 200; e2e verdes; OpenAPI publicado.

Fase 4 — Frontend
- Crear /frontends/<NombreFrontend> con mock mínimo.
- Cliente HTTP leyendo VITE_API_BASE; sustituir mocks por llamadas reales al CORE.
- Añadir check:nomocks (warning → luego blocking).
- PR: "FE-<NombreFrontend> · UI + cliente real + nomocks".
Criterios: UI dev en S3+CloudFront; rutas críticas sin mocks.

Fase 5 — Infra AWS
- CDK: S3 bucket fe-<NombreFrontend>-<stage> + CloudFront + invalidations en deploy.
- CI/CodeBuild: build del frontend con VITE_API_BASE=<API_GW_CORE_DEV_URL>, subir a S3, invalidar CloudFront.
- PR: "FE-<NombreFrontend> · CDK (S3/CloudFront) + CI/CD".
Criterios: `cdk synth` OK; deploy dev entrega URL de CloudFront y funciona end-to-end.

Entregables por fase:
- PR pequeño con DoD, manual de prueba, y enlace a entorno dev (API GW / CloudFront).
- En cada PR, mantener changelog e impact matrix (contratos → prisma → API → UI).

Comienza ejecutando la Fase 1.
```

### Opción 2 — Prompts cortos, fase a fase

**Fase 1 — Contratos Zod**
```text
Crea/ajusta contratos Zod en packages/shared para: <Entidades>.
Actualiza matriz de paridad frontend↔shared y el script `yarn check:entities`.
Abre PR “FE-<NombreFrontend> · contratos Zod + paridad” con DoD.
```

**Fase 2 — BD (Prisma + migración en AWS)**
```text
Extiende packages/db/prisma/schema.prisma según los contratos.
Genera migración “add_<NombreFrontend>_v1” y seed idempotente.
Configura job CodeBuild “db-migrate” para aplicar migraciones en RDS dev (100% AWS).
Abre PR “FE-<NombreFrontend> · Prisma + migración + seed + CodeBuild”.
```

**Fase 3 — API (Nest + e2e)**
```text
En apps/core-gateway, crea módulo(s) para <Entidades> con DTOs Zod, servicios y controladores.
Añade tests e2e (Supertest) y actualiza OpenAPI.
Abre PR “FE-<NombreFrontend> · API + e2e + OpenAPI”.
```

**Fase 4 — Frontend nuevo**
```text
Crea /frontends/<NombreFrontend> con mock mínimo y cliente HTTP al CORE leyendo VITE_API_BASE.
Sustituye mocks por llamadas reales, añade check:nomocks (warning al principio).
Abre PR “FE-<NombreFrontend> · UI + cliente real + nomocks”.
```

**Fase 5 — Infra (S3/CloudFront + CI)**
```text
En infra/cdk-core añade stack S3+CloudFront para /frontends/<NombreFrontend>.
CI/CodeBuild: build frontend con VITE_API_BASE=<API_GW_CORE_DEV_URL>, subir artefactos a S3, invalidar CloudFront.
Abre PR “FE-<NombreFrontend> · CDK (S3/CloudFront) + CI/CD”.
```

**Fase 6 — End-to-end DEV → SBX → PROD**
```text
Despliega a dev (auto). Pide aprobación para sbx/prod.
Entrega enlaces: CloudFront dev y API GW dev; checklist de pruebas funcionales.
```

### Ejemplo — `factory-ops`
- `<NombreFrontend>` = `factory-ops`
- `<Entidades>` = `Supplier`, `PurchaseOrder`, `GoodsReceipt`, `Lot`, `InventoryMovement`
- `<ResumenFuncional>` = “crear POs a fábrica y recepcionar lotes con control de stock”

**Primer prompt (Fase 1)**
```text
Crea contratos Zod en packages/shared para Supplier, PurchaseOrder(+Line), GoodsReceipt(+Line), Lot, InventoryMovement.
Genera/actualiza matriz de paridad y script check:entities.
PR “FE-factory-ops · contratos Zod + paridad”.
```

### Checklist de verificación por PR
- `check:entities`, `parity`, `test`, `build:all`, `cdk synth` = OK.
- Migraciones Prisma aplicadas por **CodeBuild** (logs OK).
- OpenAPI actualizado; enlace a **API Gateway (dev)**.
- **CloudFront (dev)** sirve el nuevo frontend; `VITE_API_BASE` apunta al API GW dev.
- Logs sin PII y flags correctos por entorno.

### Frase de arranque
> “**Aprobado. Ejecuta Playbook Frontend — Fase 1 (Contratos) para `<NombreFrontend>`.**”

