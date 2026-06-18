# Hireloop

Hireloop is a job marketplace built with a Next.js client and an Express/MongoDB API. It includes public job browsing, company discovery, Better Auth sign-in, seeker and recruiter dashboards, admin moderation screens, subscriptions, payments, saved jobs, and applications.

## Project Layout

- `client/` - Next.js app router frontend, Better Auth routes, dashboard UI, and local browse sample data.
- `server/` - Express API with Mongoose models for users, companies, jobs, applications, plans, subscriptions, and payments.
- `.env.example` - Shared environment template. Copy the relevant values into `client/.env.local` and `server/.env`.

## Setup

Install dependencies in both apps:

```bash
cd client
npm install

cd ../server
npm install
```

Create environment files:

```bash
copy .env.example client\.env.local
copy .env.example server\.env
```

For local development, update both files with a reachable `MONGO_DB_URI`. The client also needs `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_AUTH_BASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. Google OAuth and ImgBB keys are optional until those flows are used.

## Development

Start the API:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:3000`. The API defaults to `http://localhost:5000/api`.

## Validation

```bash
cd client
npm run lint
npm run build

cd ../server
npm run check
```

## Seed And Sample Data

There is no database seeder script yet. MongoDB collections start empty and are populated through the app or API:

- Create users through Better Auth sign-up/sign-in.
- Recruiters can create companies and jobs after onboarding.
- Seekers can save jobs and submit applications.
- Admin routes can manage users, companies, jobs, plans, subscriptions, and payments.

The public browse pages also use checked-in sample data so the marketing and discovery experience has content before the API is populated:

- `client/src/lib/jobs-data.js`
- `client/src/lib/companies-data.js`

Keep those files in sync with the API shape when adding demo records or replacing them with a real seed workflow.

## Notes

- `client/.env.local`, `server/.env`, `node_modules/`, `.next/`, and build outputs are ignored by git.
- `client/.env.local` in this workspace contains development-only values so local builds can run without committing secrets.
