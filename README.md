<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16wSnJmRQ2Lu1NupGw6gdw1HZnYYNPRom

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to AWS

The repository includes an AWS CDK stack that provisions all required AWS resources for both the backend and the frontend.

1. Deploy the infrastructure:

   ```bash
   yarn workspace @sevens/cdk-core cdk deploy
   ```

2. Publish application artifacts using the CodeBuild projects created by the stack:

   - `db-migrate` – runs database migrations.
   - `openapi-publish` – uploads the OpenAPI specification.
   - `frontend-publish` – builds the Vite frontend and syncs it to the S3 bucket.

The frontend is served from an S3 bucket behind a CloudFront distribution. The API base URL is injected at build time through the `VITE_API_BASE` environment variable.
