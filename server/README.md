# Hireloop Server

Express API for Hireloop.

## Scripts

```bash
npm run dev
npm run start
npm run check
npm test
```

## Environment

Create `server/.env` from the root `.env.example`.

Required:

- `MONGO_DB_URI`
- `PORT`

The API defaults to port `5000` when `PORT` is not set.

## Data

There is no seed command in this package. MongoDB data is created through the API and auth flows. The main collections are users, sessions, companies, jobs, applications, plans, subscriptions, and payments.
