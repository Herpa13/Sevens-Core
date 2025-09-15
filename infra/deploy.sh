#!/bin/bash
set -euo pipefail

STACK_NAME="CoreStack"
TEST_USER="test@example.com"
TEST_PASS="UnaPasswordSegura123!"
ENV_FILE=".env"

echo "🚀 1. Instalando dependencias mínimas de infraestructura..."
npm install

echo "🔨 2. Compilando TypeScript (si aplica)..."
npm run build || echo "⚠️ No hay build script, continuando..."

echo "📦 3. Bootstrap de CDK (solo la primera vez en la cuenta/región)..."
npx cdk bootstrap

echo "🚀 4. Desplegando la infraestructura con CDK..."
npx cdk deploy $STACK_NAME --require-approval never

echo "✅ Infraestructura desplegada."

echo "📡 5. Ejecutando migraciones de base de datos..."
aws codebuild start-build --project-name db-migrate

echo "📄 6. Publicando especificación OpenAPI..."
aws codebuild start-build --project-name openapi-publish

echo "🌐 7. Publicando frontend..."
aws codebuild start-build --project-name frontend-publish

echo "📤 8. Recuperando outputs del stack..."
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
  --output json)

echo "$OUTPUTS" | jq -r '.[] | @tsv' | column -t

API_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.[0]=="ApiUrl") | .[1]')
FRONTEND_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.[0]=="FrontendUrl") | .[1]')
OPENAPI_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.[0]=="OpenApiUrl") | .[1]')

echo "👤 9. Creando usuario de prueba en Cognito..."
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 \
  --query "UserPools[?Name=='CoreUserPool'].Id" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID \
  --query "UserPoolClients[?ClientName=='CoreUserPoolClient'].ClientId" --output text)

aws cognito-idp sign-up \
  --client-id $CLIENT_ID \
  --username $TEST_USER \
  --password "$TEST_PASS" \
  || echo "⚠️ El usuario ya existe, omitiendo creación."

echo "🔑 10. Autenticando usuario y obteniendo token JWT..."
AUTH_RESULT=$(aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id $CLIENT_ID \
  --auth-parameters USERNAME=$TEST_USER,PASSWORD=$TEST_PASS)

ID_TOKEN=$(echo $AUTH_RESULT | jq -r '.AuthenticationResult.IdToken')

echo "✅ Usuario autenticado. Token JWT (IdToken) obtenido."

echo "💾 11. Guardando credenciales en $ENV_FILE ..."
cat > $ENV_FILE <<EOF
# Variables generadas automáticamente por deploy.sh
API_URL=$API_URL
FRONTEND_URL=$FRONTEND_URL
OPENAPI_URL=$OPENAPI_URL
COGNITO_CLIENT_ID=$CLIENT_ID
COGNITO_USER_POOL_ID=$USER_POOL_ID
TEST_USER=$TEST_USER
TEST_PASS=$TEST_PASS
JWT_TOKEN=$ID_TOKEN
EOF

echo "📂 Archivo .env creado con las variables."
cat $ENV_FILE

echo "🧪 12. Probando la API con curl..."
API_RESPONSE=$(curl -s -H "Authorization: Bearer $ID_TOKEN" $API_URL || echo "error")

echo "📡 Respuesta de la API:"
echo "$API_RESPONSE"

echo "🧪 13. Probando el frontend (CloudFront)..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)

if [ "$FRONTEND_RESPONSE" == "200" ]; then
  echo "✅ Frontend responde correctamente (HTTP 200)."
else
  echo "⚠️ Frontend respondió con código HTTP $FRONTEND_RESPONSE."
fi

echo "🧪 14. Probando OpenAPI JSON..."
OPENAPI_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $OPENAPI_URL)

if [ "$OPENAPI_RESPONSE" == "200" ]; then
  echo "✅ OpenAPI JSON disponible en $OPENAPI_URL"
else
  echo "⚠️ OpenAPI respondió con código HTTP $OPENAPI_RESPONSE."
fi

echo
echo "👉 Ejemplo de llamada manual a la API:"
echo "curl -H \"Authorization: Bearer \$JWT_TOKEN\" \$API_URL"
echo
echo "🎉 Despliegue completo."
echo "   API:      $API_URL"
echo "   Frontend: $FRONTEND_URL"
echo "   OpenAPI:  $OPENAPI_URL"
