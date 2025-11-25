# Translator Server

Backend foundation for translation, content processing, auth, usage tracking, and subscription plumbing. Built with Node.js, Express 5, MongoDB, and Redis.

## Features
- JWT-less Google sign-in flow (server validates Google ID token).
- Rate limiting, request logging, and central error handling.
- Plan/quota guard with usage tracking per feature.
- Content tools: translate, summarize, explain, rewrite, form assist.
- OpenAPI spec with Swagger UI.

## Requirements
- Node.js 18+ and npm
- MongoDB (optional to run; server will continue without it)
- Redis (optional to run; server will continue without it)

## Getting started
- Install deps: `npm install`
- Copy env: `cp .env.exemple .env`
- Start in development: `npm run dev`
- Start in production: `npm start`

## Environment variables
- See `./.env.exemple` for the authoritative list and descriptions.
- Typical keys include `PORT`, `CORS_ORIGINS`, `MONGO_URI`, `REDIS_URL`, `GOOGLE_CLIENT_ID`.

## API documentation
- Swagger UI: http://localhost:3000/api-docs
- Raw OpenAPI JSON: http://localhost:3000/openapi.json
- Source spec: `docs-openapi.yaml`

## Core endpoints (summary)
- `GET /health`
- `POST /api/auth/google`
- `POST /api/translate`
- `POST /api/content/summarize`
- `POST /api/content/explain`
- `POST /api/content/rewrite`
- `POST /api/content/form-assist`
- `GET /api/user/status`
- `POST /api/webhooks/paddle`

## Auth and headers
- Many endpoints require an `x-user-id` header. See `docs-openapi.yaml` for details.
- For Google sign-in, send `{ "token": "<google-id-token>" }` to `/api/auth/google`.

## cURL examples
- Health  
  ```bash
  curl -s http://localhost:3000/health
  ```
- Google auth (Windows PowerShell/CMD line breaks shown with ^)
  ```bash
  curl -X POST http://localhost:3000/api/auth/google ^
    -H "Content-Type: application/json" ^
    -d "{ \"token\": \"YOUR_GOOGLE_ID_TOKEN\" }"
  ```
- Translate
  ```bash
  curl -X POST http://localhost:3000/api/translate ^
    -H "Content-Type: application/json" ^
    -H "x-user-id: USER_123" ^
    -d "{ \"text\": \"Hello\", \"sourceLanguage\": \"auto\", \"targetLanguage\": \"ar\" }"
  ```

## Project structure
- `src/app.js`: Express app bootstrap and middleware
- `src/server.js`: Server bootstrap
- `src/api`: Routes and controllers
- `src/core`: Middlewares, validation, and services
- `src/domain`: Mongoose models
- `src/infrastructure`: DB clients
- `src/utils`: Logging and errors
- `docs-openapi.yaml`: OpenAPI source
- `scripts`: Utility scripts

## Useful scripts
- `npm run dev`: Start with nodemon
- `npm start`: Start production server
- `npm run db:setup`: Seed or prepare database (see `scripts/setup-db.js`)

## Notes
- The server accepts requests even if MongoDB/Redis are down; related features will degrade gracefully.
- Rate limits and plan quotas can be tuned in `src/config/plans.js`.

## License
- ISC