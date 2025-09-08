# DEPLOY_PRUEBAS.md

Guía paso a paso para desplegar el **CORE + PIM** en entorno de **pruebas (DEV/SBX)**.

---

## 0) Pre-flight local
```bash
corepack enable
yarn -v     # debe ser 1.22.22
yarn install
yarn lint && yarn typecheck && yarn build:all
```

---

## 1) Configuración de Secrets (DEV)
En **AWS Secrets Manager** crear:
- `core/dev/DATABASE_URL`
- `core/dev/JWT_SECRET`
- `core/dev/JWT_REFRESH_SECRET`
- `core/dev/WRITE_ENABLED=true`
- `core/dev/DRY_RUN=true`
- `core/dev/SAFE_MODE=true`

---

## 2) Infraestructura (CDK)
```bash
cd infra/cdk-core

# Red + Endpoints privados
yarn cdk deploy -c stage=dev Core-Network --require-approval never

# BBDD (RDS + Proxy)
yarn cdk deploy -c stage=dev Core-DB --require-approval never

# API Gateway + Lambda
yarn cdk deploy -c stage=dev Core-API --require-approval never

# Observabilidad
 yarn cdk deploy -c stage=dev Core-Observability --require-approval never
```
Actualizar `DATABASE_URL` con el endpoint del RDS Proxy.

---

## 3) Jobs CodeBuild
- **db-migrate**: `npx prisma migrate deploy`
- **db-seed**: `node packages/db/seed.mjs`

DoD: `/stock` devuelve datos en DEV.

---

## 4) Deploy CORE a DEV
```bash
yarn build:all
yarn cdk deploy -c stage=dev Core-API --require-approval never
```

**Smoke test**:
```bash
curl "$API_URL/ready"   # debe responder 200
```

---

## 5) OpenAPI versionado
Generar `openapi.json`, subir a S3 con versionado y comparar en cada PR (`contract:drift`).

---

## 6) Conectar PIM
```bash
export VITE_API_BASE="$API_URL"
yarn --cwd frontends/pim-frontend build
./scripts/upload_pim_s3.sh  # + invalidación CloudFront
```

---

## 7) Pruebas funcionales end-to-end
- `GET /health`, `GET /ready`
- `POST /companies`, `POST /brands`
- `POST /sync/pim/product`
- `GET /stock`, `POST /stock/adjust`

Aceptación: PIM sin mocks, paridad 100%, seeds visibles.

---

## 8) Pipeline CI/CD (resumen)
```yaml
jobs:
  dev:
    steps:
      - run: yarn install --frozen-lockfile
      - run: yarn check:entities && yarn parity && yarn test && yarn build:all
      - run: cd infra/cdk-core && yarn cdk deploy -c stage=dev Core-API --require-approval never
      - run: ./scripts/infra_smoke.sh
      - run: ./scripts/contract_drift.sh
      - run: ./scripts/nomocks_strict.sh
      - run: yarn --cwd frontends/pim-frontend build
      - run: ./scripts/upload_pim_s3.sh
      - run: yarn e2e:run
```

---

## 9) Checklist PR
- Linting, tests y build OK.
- CDK synth/deploy OK.
- `infra:smoke`, `contract:drift`, `nomocks:strict` OK.
- OpenAPI publicado.
- PIM en CloudFront (DEV) apuntando al CORE.

---

## 10) Rollback
- API: revertir stage en API Gateway.
- DB: `prisma migrate resolve --rolled-back`.
- Secrets: regenerar y redeploy Lambda.

