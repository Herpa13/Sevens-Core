# Guía paso a paso: Despliegue del CORE + PIM en AWS (Entorno de PRUEBAS)

---

## 0) Preparación inicial
- Activa **MFA en root** y crea un **usuario con SSO + rol AdministratorAccess**.
- Configura **Budget** con alerta (50 € recomendado).
- Instala AWS CLI y configura con `aws configure sso` (perfil `sevens-admin`).
- Instala **AWS CDK** y haz el bootstrap:
  ```bash
  npm i -g aws-cdk
  cdk bootstrap aws://<account-id>/eu-west-1 --profile sevens-admin
  ```

---

## 1) Secrets en AWS Secrets Manager
Crea los siguientes secretos:
- `core/dev/JWT_SECRET`
- `core/dev/JWT_REFRESH_SECRET`
- `core/dev/APP_CONFIG` → `{ "WRITE_ENABLED": "false", "DRY_RUN": "true", "SAFE_MODE": "true" }`

---

## 2) Infraestructura con CDK
En tu repo local:
```bash
cd infra/cdk-core
yarn cdk deploy -c stage=dev Core-Network --require-approval never
yarn cdk deploy -c stage=dev Core-DB --require-approval never
yarn cdk deploy -c stage=dev Core-API --require-approval never
```
**Outputs:** ApiUrl, RdsProxyEndpoint.

---

## 3) Crear `DATABASE_URL`
1. Ve a Secrets Manager y recupera `username`, `password`, `dbname` del secreto maestro del RDS.
2. Crea secreto `core/dev/DATABASE_URL` con:
   ```
   postgres://<user>:<pass>@<RdsProxyEndpoint>/<dbname>?sslmode=require
   ```

---

## 4) Migraciones Prisma (CodeBuild)
AWS Console → CodeBuild → Create project:
- Fuente: GitHub.
- VPC: misma que Core-Network (subnets privadas).
- Buildspec:
  ```yaml
  version: 0.2
  phases:
    pre_build:
      commands:
        - export DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id core/dev/DATABASE_URL --query SecretString --output text)
    build:
      commands:
        - npx prisma migrate deploy
  ```
Ejecuta el proyecto y valida que las tablas se crean.

---

## 5) Despliegue del CORE (Lambda + API Gateway)
```bash
cd infra/cdk-core
yarn build:all
yarn cdk deploy -c stage=dev Core-API --require-approval never
```

---

## 6) Smoke test del CORE
```bash
curl "<API_URL>/ready"   # 200
curl "<API_URL>/health"  # 200
curl "<API_URL>/stock"   # debe devolver seed si hiciste db-seed
```

---

## 7) Despliegue del PIM (S3 + CloudFront)
1. **S3 bucket**: `pim-dev-<account>-eu-west-1`.
2. **CloudFront**: origen el bucket con OAC, default root `index.html`.
3. Build local apuntando al CORE:
   ```bash
   $env:VITE_API_BASE="<API_URL>"
   yarn --cwd frontends/pim-frontend build
   aws s3 sync frontends/pim-frontend/dist s3://pim-dev-<account>-eu-west-1/ --delete --profile sevens-admin
   aws cloudfront create-invalidation --distribution-id <dist-id> --paths "/*"
   ```

---

## 8) Validación final
- Abre el **dominio CloudFront** y verifica que el PIM carga.
- En DevTools de navegador: comprobar que las llamadas van al API Gateway del CORE.

---

## Checklist PRUEBAS
- [ ] MFA root + Budget activo.
- [ ] Secrets (`JWT`, `DATABASE_URL`, `APP_CONFIG`).
- [ ] Stacks Core-Network, Core-DB, Core-API desplegados.
- [ ] Migraciones Prisma aplicadas (CodeBuild).
- [ ] `/ready`, `/health` = 200; `/stock` responde.
- [ ] PIM en S3 + CloudFront funcionando.

