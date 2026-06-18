# Hireloop Client

Next.js app router frontend for Hireloop.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Environment

Create `client/.env.local` from the root `.env.example`.

Required for local auth and API calls:

- `MONGO_DB_URI`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AUTH_BASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`

Optional until the related flows are used:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `IMGBB_API_KEY`

## Sample Data

The browse experience uses local sample records from:

- `src/lib/jobs-data.js`
- `src/lib/companies-data.js`

Dashboard and authenticated workflows use the Express API and MongoDB data.
