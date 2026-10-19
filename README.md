# Frontend

Web interface for managing events with categories, checklist items and responsible persons. The application is a
single-page app that talks to a Symfony API. An optional Spotify player can be integrated through ioBroker.

## Contents

- [Tech stack](#tech-stack)
- [Requirements and support](#requirements-and-support)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [User settings](#user-settings)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

## Tech stack

| Area                | Technology                           |
| ------------------- | ------------------------------------ |
| UI                  | React, TypeScript, Material UI (MUI) |
| State and API       | Redux Toolkit, RTK Query             |
| Routing             | React Router                         |
| Translation         | i18next, react-i18next               |
| Realtime (optional) | socket.io-client (ioBroker)          |

## Requirements and support

### Development

- Node.js 20 or newer
- npm
- A running backend API (Symfony), see [Configuration](#configuration)

### Browsers

The latest versions of Chrome, Firefox, Edge and Safari are supported. Internet Explorer is not supported.

### Languages

| Code | Language         |
| ---- | ---------------- |
| `de` | German (default) |
| `en` | English          |

The language is stored per user in the settings. Before login, the most recently used language from `localStorage`
applies, otherwise the browser language (only `de` or `en`), otherwise German.

A new language needs a translation file, an entry in `resources` and `supportedLngs` of the i18n initialization, and an
additional value in the `choices` of the `language` setting (see [User settings](#user-settings)).

### Optional integrations

| Integration  | Requirement                                                                 | Behavior when not configured               |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------------ |
| Spotify card | ioBroker with the `spotify-premium` adapter and an active Socket.IO adapter | The card is hidden and no socket is opened |

## Quick start

```bash
# Install dependencies
npm install

# Create the runtime configuration (see below)
cp public/config.example.js public/config.js

# Start the development server
npm run dev
```

Other scripts (check the names in your `package.json`):

```bash
npm run build      # Production build to dist/
npm run preview    # Preview the build locally
npm run lint       # Linting
```

## Configuration

The application is configured at **runtime** through the file `public/config.js`. The file is not bundled. You can
replace it in the build folder or in the Docker container without rebuilding.

```js
window.__APP_CONFIG__ = {
    apiUrl: '',
    iobrokerUrl: '',
}
```

| Key           | Required | Description                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`      | yes      | Base URL of the backend API including `/api`. If missing, the app aborts on startup with `API URL is not configured`. |
| `iobrokerUrl` | no       | URL of the ioBroker Socket.IO adapter. Empty or omitted: the Spotify card is hidden.                                  |

The file is loaded in `index.html` as a regular script **before** the app bundle:

```html
<script src="/config.js"></script>
```

> **Note:** `config.js` is readable by every visitor. Only put URLs in it, never credentials or secrets.

### Backend requirements

- The API must be reachable at `apiUrl`.
- The backend must allow the frontend's origin via CORS if both run on different domains or ports.
- Authentication uses a token that is stored in `localStorage` and sent with every request.

### ioBroker (optional)

1. Set up the `spotify-premium` adapter in ioBroker (objects under `spotify-premium.0`).
2. Enable the Socket.IO adapter. The default port is `8084`.
3. Set `iobrokerUrl` in `config.js`, for example `http://192.168.0.12:8084`.

On startup the card shows a spinner, shows an error message on connection problems, and reconnects automatically.
Changes to volume, device and playback are displayed immediately and reconciled with the actual state from ioBroker.

## User settings

Settings belong to the logged-in user and are edited on the settings page. The form is rendered generically from the
definitions in the backend (label, type, default, options). A new setting therefore needs no new form field in the
frontend.

| Key              | Type   | Description                       |
| ---------------- | ------ | --------------------------------- |
| `language`       | select | UI language (`de`, `en`)          |
| `layout`         | select | Color scheme (`light`, `dark`)    |
| `items_per_page` | int    | Entries per page in lists         |
| `reminder_days`  | int    | Reminder in days before the event |
| `send_mails`     | bool   | Email notifications               |

In code, access them through hooks:

```tsx
const itemsPerPage = useSetting('items_per_page') // number

const { settings } = useSettings()
settings.send_mails // boolean
```

### Adding a new setting

1. Add the definition to `setting_definition` via SQL or a migration.
2. Add the key to `TypedSettings` and `DEFAULTS` in the `useSettings` hook (only for type safety and fallback).
3. Write the code that uses the value.

## Docker

The image builds the app and serves it through nginx. `config.js` is mounted as a volume so the same image version can
run in every environment.

### Dockerfile

```dockerfile
# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
```

### nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Never cache the configuration so changes apply immediately
    location = /config.js {
        add_header Cache-Control "no-store";
        try_files $uri =404;
    }

    # Hashed build files may be cached for a long time
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # SPA: forward unknown paths to index.html
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri /index.html;
    }
}
```

The rule for `config.js` with `=404` is important. Without it, nginx would serve `index.html` when the file is missing,
and the browser reports a syntax error.

### Build and run

```bash
docker build -t vacation-frontend .

docker run -d \
    --name vacation-frontend \
    -p 8080:80 \
    -v "$(pwd)/config.js:/usr/share/nginx/html/config.js:ro" \
    vacation-frontend
```

The app is then available at `http://localhost:8080`. `config.js` stays on the host. Edit it there and reload the page,
no container restart is needed.

### docker-compose

```yaml
services:
    frontend:
        build: .
        ports:
            - '8080:80'
        volumes:
            - ./config.js:/usr/share/nginx/html/config.js:ro
        restart: unless-stopped
```

```bash
docker compose up -d --build
```

### Operations notes

- **Image contains a default config:** If `public/config.js` exists at build time, it is baked into the image and serves
  as a fallback. The volume overrides it.
- **`apiUrl` in the browser:** The URL is called from the visitor's browser, not from the container. A Docker-internal
  hostname such as `http://backend:8000` will not work there. Use a publicly reachable URL or a reverse proxy.
- **HTTPS:** If the app is served over HTTPS, `apiUrl` must use HTTPS too, otherwise the browser blocks the requests
  (mixed content). The same applies to `iobrokerUrl` if ioBroker is only reachable over HTTP.

## Troubleshooting

| Problem                                               | Cause and solution                                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Blank page, console shows `API URL is not configured` | `config.js` is missing, not loaded, or has no `apiUrl`. Check that `/config.js` returns JavaScript in the browser. |
| `Unexpected token '<'` when loading `config.js`       | The file does not exist and the server returns `index.html` instead. Create the file or check the volume.          |
| All API calls fail, console reports CORS              | The backend does not allow the frontend's origin. Configure CORS there.                                            |
| Settings and lists stay empty, status 401             | Token expired or invalid. Log out and log in again.                                                                |
| Spotify card is missing                               | `iobrokerUrl` is empty or not set. This is intentional.                                                            |
| Spotify card permanently shows a connection error     | ioBroker or the Socket.IO adapter is unreachable, wrong URL or port, or mixed content is blocked over HTTPS.       |
| Changes to `config.js` have no effect                 | Browser cache. Hard reload. In the container, make sure the nginx rule for `/config.js` is active.                 |
