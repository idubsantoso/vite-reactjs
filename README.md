# React + TypeScript + Vite

## Backend Mode

Development uses MSW by default for mock `/api` responses.

Use the real backend by disabling MSW:

```bash
VITE_USE_MSW=false pnpm dev
```

When `VITE_USE_MSW=false`, requests to `/api/...` are not intercepted by MSW
and will be sent to the real backend available from the app origin or Vite
proxy.

To target a backend on a different origin, set `VITE_API_BASE_URL`:

```bash
VITE_USE_MSW=false VITE_API_BASE_URL=https://api.example.test pnpm dev
```

When `VITE_API_BASE_URL` is empty, the API client uses the app origin.

## Demo Path

Run the app locally with mocks:

```bash
pnpm dev
```

Use a mock user to log in:

- Email: `busan@company.test`
- Password: `admin123`

Walkthrough:

- Open `/`; after login it redirects to `/dashboard`.
- Visit `/users`, `/requests`, and `/audit-logs`.
- Use `?scenario=delay` to see loading states.
- Use `?scenario=empty` to see initial empty states.
- Use `?scenario=403` to see forbidden states.
- Use `?scenario=500` to see server error states.
- Use `?scenario=401` to confirm auth failures redirect to `/login`.
- Open a request detail page and update request status to see pending,
  success, and failure feedback.

Auth failure behavior:

- Protected routes without a valid token redirect to `/login`.
- Permission failures from API responses render a forbidden state.

## Known Limitations and Follow-up Fixes

- Real backend responses must match the current `/api/...` response shapes.
- Users, requests, and audit logs table filtering/pagination are client-side
  until backend query contracts are added.
- MSW mock data is in-memory and resets on page reload.
- Production bundle currently has a Vite chunk-size warning; route-level code
  splitting is a follow-up.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
