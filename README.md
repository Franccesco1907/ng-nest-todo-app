# Todo app

Angular frontend and NestJS API for email login and task CRUD with JWT and Firestore. Backend features use domain, application and infrastructure layers under `backend/src/modules`.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`. Set `PORT=3000`, `ALLOWED_ORIGINS=http://localhost:4200`, Firebase service-account fields, `JWT_SECRET` and `JWT_EXPIRATION`. Keep credentials private.
2. If `NODE_ENV=development` is already set in the shell, the backend loads `.env.dev` instead; create that file from the same example.
3. Run `docker compose -f docker-compose.local.yml up --build`.

Frontend: `http://localhost:4200`. API docs: `http://localhost:3000/docs`. Frontend API URLs are in `frontend/src/environments`; controllers use the `/v1` prefix.
For local Node development, install dependencies with `npm ci` in each directory, then run `npm start` in `frontend` and `npm run start:dev` in `backend` with the same Firebase configuration.

## Verify

- Backend: `npm test -- --runInBand` and `npm run build`.
- Frontend: `npm test -- --watch=false --browsers=ChromeHeadless` (requires Chrome) and `npm run build`.

The GitHub workflow builds and publishes Docker images on pushes to `main`; it does not run these tests. PRs do not publish images. Production Docker configuration is in `docker-compose.prod.yml`.
Licenses: [repository](LICENSE), [original Atom frontend](frontend/LICENSE). Atom logos remain restricted to the technical assessment.
