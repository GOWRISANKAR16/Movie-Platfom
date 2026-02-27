# Movie-Platfom

A Netflix-style movie landing page built with **React + Vite**, using **TMDB** as the data source.

### Features

- Netflix-like hero banner and horizontal movie rows
- Data fetched from TMDB using a secure API key stored in `.env`
- Linting with ESLint and tests with Vitest + React Testing Library

### Getting started

```bash
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Then run:

```bash
npm run check:tmdb   # verify TMDB API connectivity
npm run build        # build for production
```
