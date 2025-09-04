# OPERATING_PLAN_CORE_DESDE_PIM_AWS (con nivel **Empresa → Marca → Producto**)

> **Contexto**: El PIM actual está **centrado en Marca → Producto**. Este plan **añade el nivel Empresa** (tenant) que **contiene N marcas**, manteniendo el PIM sin cambios de UI por ahora. Se crean/migran **modelo de datos**, **seeds**, **CI/CD** y **infra AWS** para operar 100% en cloud.

> **Meta**: Codex debe **generar el nuevo nivel Empresa**, **migrar** datos/relaciones Brand‑centric → Company‑Brand‑Product, y dejar listo el **CORE** (BD + API mínimas de health/ready y auth) para que el PIM y futuros frontends lo consuman. Los **endpoints de negocio** (CRUD completos) pueden definirse en un fichero aparte si se desea.

---

## 0) Guardarraíl
- **Node 18 CJS**, **Yarn 1.22.22**, **Nest + Fastify**, **Zod** (validación in/out), **Prisma**.
- **100% AWS**: API Gateway (HTTP) + Lambda (core‑gateway), RDS Postgres (CORE), Secrets, S3, SQS, VPC privada, KMS, CloudWatch.
- **Sin local**: migraciones Prisma vía **CodeBuild/CI**.
- **Logs sin PII**; flags: `WRITE_ENABLED`, `DRY_RUN`, `SAFE_MODE`.

### Variables de entorno
- Backend: `DATABASE_URL_CORE`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `WRITE_ENABLED`, `DRY_RUN`, `SAFE_MODE`.
- Frontends: `VITE_API_BASE` (URL de API GW CORE).

---

## 1) Estructura de monorepo
```
/platform
  /apps
    core-gateway/                 # API CORE (Nest + Fastify)
  /frontends
    pim-frontend/                 # PIM mock existente (no tocar UI)
  /packages
    shared/                       # Contratos Zod (fuente de verdad)
    db-core/                      # Prisma CORE (migrate + client)
    core-auth/ core-observ/ core-http/
  /infra
    cdk-core/                     # RDS CORE + API GW + Lambda + S3 + SQS + Secrets
  /docs
    OPERATING_PLAN_CORE_DESDE_PIM_AWS_EMPRESA.md
```

---

## 2) Modelo de datos CORE (con **Empresa**)

### 2.1 Jerarquía e invariantes
- `Company (Empresa)` **1:N** `Brand (Marca)` **1:N** `Product` (vive en PIM) **1:N** `Variant` (vive en PIM).
- Un `Brand` pertenece a **una sola** `Company`.
- Un `Product` pertenece a **una sola** `Brand` (y por transitividad a una `Company`).
- CORE **no duplica** fichas del PIM: sólo referencia `productId`/`variantId`.

### 2.2 Entidades CORE afectadas (claves y FKs)
- **Company** `{ id, name, slug, taxId?, country, currency }`  
  `@@unique(slug)`
- **Brand** `{ id, companyId, name, slug }`  
  `@@unique([companyId, name])`, `@@unique([companyId, slug])`, FK → `Company(id)`
- **Warehouse** `{ id, companyId, code, ... }`  
  `@@unique([companyId, code])`, FK → `Company(id)`
- **Listing** `{ id, companyId, brandId, channelSiteId, sellerAccountId, variantId, ... }`  
  FK compuesta `Brand(id, companyId)` para garantizar pertenencia
- **SalesOrder** `{ id, companyId, brandId, ... }`  
  FK compuesta `Brand(id, companyId)`
- **Lot** `{ id, companyId, brandId, productId, code, ... }`  
  FK compuesta `Brand(id, companyId)`
- **StockItem / InventoryMovement / Supplier / PO / GR / SupplierInvoice / Shipment**: incluyen `companyId` de forma directa o vía sus FKs (p.ej., `warehouse.companyId`).

> Reglas de integridad de aplicación: al crear líneas/ajustes, validar que **`variantId` pertenece al `brandId`** (consulta al PIM) y que **`brand.companyId === companyId`**.

---

## 3) Migración **Brand‑centric → Company‑Brand‑Product** (online, sin romper el PIM)

### 3.1 Estrategia
1) **Fase A (ampliar)**: añadir `Company` y **columna `companyId` nullable** en tablas dependientes (`Brand`, `Listing`, `SalesOrder`, `Lot`, etc.).
2) **Fase B (backfill)**: poblar `companyId` para cada `Brand` mediante un **mapa Marca→Empresa** (CSV/seed/tabla temporal) y propagar a tablas hijas.
3) **Fase C (endurecer)**: `companyId` **NOT NULL** + **FKs compuestas** (`Brand(id, companyId)`) + **índices/únicos** por empresa.
4) **Fase D (aplicación)**: exigir `X‑Tenant‑Id` (Company) en API; mientras tanto, Puente de compatibilidad: si llega sólo `brandId`, el CORE resuelve su `companyId` y **avisa** (deprecation log/metric).

### 3.2 Artefactos de migración
- `docs/brand_company_map.csv` → columnas: `brand_id,company_slug`.
- Script de seed en `packages/db-core/prisma/seed.ts` que:
  - Crea empresas (si no existen) a partir de `company_slug`.
  - Asigna `brand.companyId` y **propaga** a entidades hijas.

### 3.3 Tareas de migración (CI/CodeBuild, 100% AWS)
- **Job** `core-db-migrate` (CodeBuild): aplica migraciones Prisma a RDS CORE.
- **Job** `core-db-backfill` (CodeBuild): ejecuta backfill leyendo el CSV desde S3 (o embebido en repo) y realiza updates transaccionales.
- **Alarmas**: errores en migración/backfill → rollback automático de transacción.

---

## 4) Prisma CORE (dif)

### 4.1 Nuevos modelos y claves (fragmento orientativo)
```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  taxId     String?
  country   String
  currency  String
  brands    Brand[]
  warehouses Warehouse[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Brand {
  id        String  @id @default(cuid())
  companyId String
  company   Company @relation(fields: [companyId], references: [id])
  name      String
  slug      String
  listings  Listing[]
  sales     SalesOrder[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([companyId, name])
  @@unique([companyId, slug])
  @@unique([id, companyId])
}

model Listing {
  id              String      @id @default(cuid())
  companyId       String
  brandId         String
  brand           Brand       @relation(fields: [brandId, companyId], references: [id, companyId])
  channelSiteId   String
  sellerAccountId String
  variantId       String
  price           Decimal?    @db.Decimal(18, 4)
  currency        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([brandId, companyId])
  @@unique([sellerAccountId, variantId])
}
```

> El resto de modelos (`Warehouse`, `SalesOrder`, `Lot`, etc.) siguen la misma pauta: **incluir `companyId`** y, donde refieran a `Brand`, usar **FK compuesta**.

### 4.2 Seeds mínimos
- Crear **al menos una `Company`** (ej.: `company_slug = "default"`) y **re‑asignar** todas las `Brand` existentes.
- `Channel/ChannelSite`, `Warehouse MAD‑01` y demás seeds se asocian a la `Company`.

---

## 5) Autenticación y multi‑tenant
- **Requerir `X‑Tenant‑Id` = `companyId`** en todas las rutas de CORE (guard global).  
- **Compat** temporal: si sólo llega `brandId`, el guard resuelve `companyId` por DB y **emite warning** (contador/metric) hasta retirar el modo compat.
- **API Keys/JWT** por empresa en **Secrets Manager** (rotación opcional).

---

## 6) Infra AWS (CDK)
- `cdk-core` define: **VPC** (privada), **RDS CORE**, **API GW + Lambda** (core‑gateway), **S3** (artefactos), **SQS** (jobs internos), **Secrets**.
- **Stages**: `dev` (auto), `sbx/prod` (aprobación). 100% AWS, sin local.
- **Jobs de migración**: CodeBuild `core-db-migrate` y `core-db-backfill` parametrizados por `-c stage`.

---

## 7) Tareas para Codex (paso a paso)

### **EMP-A — Auditoría PIM (lectura)**
```
Inspecciona el PIM para listar todas las entidades/tipos y confirmar que la UI es Marca→Producto. Genera informe en /docs.
```

### **EMP-B — Introducir `Company` en Prisma CORE**
```
Crea modelo Company y añade `companyId` (nullable) en Brand y tablas dependientes (Listing, SalesOrder, Lot, Warehouse…).
Crea migración "core_add_company_v1" (A: ampliar, sin romper).
```

### **EMP-C — Seed y mapa Marca→Empresa**
```
Añade docs/brand_company_map.csv y seed que crea Company(s) y asigna Brand→Company.
Propaga companyId a tablas hijas. Job CodeBuild "core-db-backfill".
```

### **EMP-D — Endurecer claves y FKs**
```
Actualiza migraciones: companyId NOT NULL, FKs compuestas Brand(id, companyId), únicos e índices por empresa.
Migración "core_add_company_v2_constraints" (C: endurecer).
```

### **EMP-E — Guard multi-tenant y compat**
```
Añade guard global que exige X-Tenant-Id (companyId).
Modo compat: si sólo llega brandId, resolver companyId y emitir warning. Tests e2e.
```

### **EMP-F — Seeds y verificación**
```
Seeds de Company/Brand/ChannelSite/Warehouse por stage. CI: e2e health/ready + smoke de lectura por tenant.
```

### **EMP-G — Conexión PIM**
```
En PIM, sólo cambiar la base URL (VITE_API_BASE). No tocar pantallas.
El bridge /sync/pim/* seguirá aceptando product/variant con brandId; el CORE inferirá companyId mientras dure el modo compat.
```

---

## 8) Checklists de aceptación
- Tablas CORE con `companyId` y **FKs compuestas** donde aplica.
- **Seeds** crean al menos una empresa y asignan todas las marcas.
- **Backfill** completado; **NOT NULL** aplicado sin errores.
- Guard multi‑tenant activo; **compat** funcionando con métricas de deprecación.
- PIM operativo contra CORE sin cambios de UI.

---

## 9) Frases de control (PRs)
- “Aprobado. Ejecuta **EMP‑B** (añadir Company y `companyId` nullable).”
- “Aprobado. Ejecuta **EMP‑C** (seed + backfill Brand→Company).”
- “Aprobado. Ejecuta **EMP‑D** (NOT NULL + FKs compuestas).”
- “Aprobado. Activa **EMP‑E** (guard multi‑tenant + compat).”

