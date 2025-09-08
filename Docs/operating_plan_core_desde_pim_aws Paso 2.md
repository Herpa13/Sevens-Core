# OPERATING_PLAN_CORE_DESDE_PIM_AWS

Plan operativo para evolucionar el CORE API desde PIM y desplegarlo en AWS con infraestructura completa.

---

## 🔧 Stack y restricciones (guardarraíl)

- **Gestor de paquetes**: Yarn Workspaces (Classic 1.x).
- **Node**: 18.x (Docker y `engines`). ➜ **Backend en CommonJS** (sin ESM).
- **Backend**: NestJS 10 + Prisma 6.14.0.
- **Infraestructura AWS (objetivo prod)**: VPC, RDS Postgres (Multi-AZ) + RDS Proxy, Lambda, API Gateway, SQS, S3, Secrets Manager con rotation, VPC Endpoints, WAF.
- **Frontend existente**: PIM (React/Vite/TS 5.8).
- **Validación**: Zod end-to-end, OpenAPI contract generado y publicado.
- **CI/CD**: GitHub Actions + CodeBuild jobs.
- **Observabilidad**: CloudWatch logs + métricas + alarms.

---

## 🅰️→🅶 (del plan original)
- A–G cubren: generación de contratos, servicios base, scaffolding, integración PIM↔CORE, documentación, CDK esqueleto (VPC, RDS, Lambda, API GW, SQS, S3).
- Nota: hasta ahora, el backend usa `db.json`. Falta conectar a RDS real y ejecutar despliegue completo.

---

## 7) CI/CD y gates (ampliado)

### 7.1 Gates de EJECUCIÓN (obligatorios)
- **infra:smoke**: tras `cdk deploy`, invocar `GET /ready` (200) y ejecutar `SELECT 1` vía RDS Proxy.
- **contract:drift**: comparar `openapi.json` desplegado vs artefacto del PR; falla si difiere sin versión.
- **nomocks:strict**: el PIM no puede llamar a mocks; falla si detecta `/__mocks` o `db.json`.

---

## 8) TAREA H — RDS + RDS Proxy + Secrets rotation
- Crear RDS Postgres **Multi-AZ** y RDS Proxy para Lambda.
- Activar Secrets Manager con rotación automática.
- **DoD**: Proxy activo; rotación probada; SG restringido a Lambdas.

## 9) TAREA I — VPC Endpoints y conectividad
- VPC endpoints para Secrets, Logs, S3, API GW.
- **DoD**: `pg_isready` OK desde Lambda; CloudWatch registra `SELECT 1`.

## 10) TAREA J — Pipeline de migraciones Prisma (CodeBuild)
- Job `db-migrate` con rol dedicado que ejecuta `prisma migrate deploy` contra RDS.
- **DoD**: ejecución idempotente en dev.

## 11) TAREA K — Seed mínima
- Job `db-seed` que popula datos de arranque (Company/Brand/Warehouse demo).
- **DoD**: `/stock` devuelve datos en dev.

## 12) TAREA L — OpenAPI versionado
- Generar `openapi.json` en build y publicarlo en S3 con versioning + CloudFront.
- **DoD**: URL accesible; checksum validado en PR.

## 13) TAREA M — e2e + nomocks:strict
- Elevar `check:nomocks` a blocking.
- Añadir tests e2e (Playwright/Vitest) invocando 3 rutas CORE vía API GW.
- **DoD**: pipeline rojo si el PIM toca mocks; verde si pasa en dev.

---

## 14) Infraestructura CDK detallada

Stacks:
- **Core-Network**: VPC + subredes privadas + endpoints.
- **Core-DB**: RDS + Proxy + Secrets rotation.
- **Core-API**: API GW + Lambda en VPC.
- **Core-Observability**: alarms, budgets.

Parámetros clave: `dbInstanceClass`, `enableMultiAZ`, `proxyMaxConnections`, `rotationIntervalDays`.

Outputs: `ApiUrl`, `RdsEndpoint`, `RdsProxyEndpoint`, `OpenApiBucketUrl`.

---

## 15) Prisma en Lambda
- Uso obligatorio de RDS Proxy.
- Singleton `PrismaClient` en warm start.
- **DoD**: conexiones estables `< N` bajo carga baja.

---

## 16) Runbooks operativos
- **Deploy**: infra → migrate → seed → app → invalidate CF.
- **Rollback**: revertir stage en API GW + `prisma migrate resolve`.
- **Rotura de secreto**: regenerar credenciales y refrescar Lambda env.

---

## 17) Seguridad y red
- WAF con reglas managed + rate limit.
- KMS CMK dedicado para RDS/Secrets.
- **DoD**: WAF en `COUNT` → `BLOCK`.

---

## ✅ Veredicto
Con estas tareas H–M y gates de ejecución, el plan pasa de esqueleto a despliegue reproducible y seguro: PIM↔CORE funcionando en AWS, sin `db.json`, con migraciones, seeds, observabilidad y rollback documentado.

