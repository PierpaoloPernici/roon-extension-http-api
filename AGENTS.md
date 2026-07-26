# roon-extension-http-api

A Node.js Express server that exposes Roon (audio streaming) control as HTTP endpoints.

Forked from [st0g1e/roon-extension-http-api](https://github.com/st0g1e/roon-extension-http-api) with enhancements merged from community forks.

## Commands

- Install: `npm install`
- Run: `node .` (listens on port 3001)
- Docker: `docker build -t roon-http-api . && docker run -p 3001:3001 roon-http-api`
- No build, lint, test, or typecheck steps exist.

## Architecture

- `server.js` – Express entrypoint. Hardcoded port 3001, CORS `*`, serves `htmls/` as static files.
- `routes.js` – All `/roonAPI/*` route registrations (GET + POST).
- `controllers/roonAPI.js` – All route handlers. Also initializes the Roon API client and service discovery.
- `htmls/` – Bare HTML/CSS/JS front-end UIs (player, browser, timers).
- `Dockerfile` – Containerized deployment (Node 18 Alpine).
- `DOCS/` – Project documentation.

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/roonAPI/getCore` | Connected Roon Core info |
| GET | `/roonAPI/listZones` | List all zones |
| GET | `/roonAPI/listOutputs` | List all outputs |
| GET | `/roonAPI/getZone?zoneId=` | Get zone details |
| GET | `/roonAPI/play?zoneId=` | Play |
| GET | `/roonAPI/pause?zoneId=` | Pause |
| GET | `/roonAPI/play_pause?zoneId=` | Toggle play/pause |
| GET | `/roonAPI/stop?zoneId=` | Stop |
| GET | `/roonAPI/next?zoneId=` | Next track |
| GET | `/roonAPI/previous?zoneId=` | Previous track |
| GET | `/roonAPI/change_volume?outputId=&volume=` | Set volume absolute (0-100) |
| GET | `/roonAPI/change_volume_relative?outputId=&volume=` | Change volume relative |
| GET | `/roonAPI/mute?outputId=` | Mute (set volume to 0) |
| POST | `/roonAPI/group` | Group outputs into a zone (body: `{ "output": [...] }`) |
| POST | `/roonAPI/ungroup` | Ungroup outputs (body: `{ "output": [...] }`) |
| GET | `/roonAPI/transferZone?fromZoneId=&toZoneId=` | Transfer playback to another zone |
| GET | `/roonAPI/listByItemKey?zoneId=&item_key=&page=&list_size=` | Browse library by item key |
| GET | `/roonAPI/listSearch?zoneId=&toSearch=&list_size=` | Search library |
| GET | `/roonAPI/goUp?zoneId=&list_size=` | Browse up one level |
| GET | `/roonAPI/goHome?zoneId=&list_size=` | Browse to root |
| GET | `/roonAPI/listGoPage?page=&list_size=` | Go to page in current browse |
| GET | `/roonAPI/listRefresh?zoneId=` | Refresh current browse |
| GET | `/roonAPI/getInternetRadios?zoneId=&toSearch=` | Search & auto-play internet radio |
| GET | `/roonAPI/getImage?image_key=` | Get image (300x200) |
| GET | `/roonAPI/getMediumImage?image_key=` | Get image (640x480) |
| GET | `/roonAPI/getIcon?image_key=` | Get icon (100x100) |
| GET | `/roonAPI/getOriginalImage?image_key=` | Get original size image |
| GET | `/roonAPI/getTimers` | List timers |
| GET | `/roonAPI/addTimer?zoneId=&time=&command=&isRepeat=` | Add a timer |
| GET | `/roonAPI/removeTimer?zoneId=&time=&command=&isRepeat=` | Remove a timer |

## Features merged from community forks

- **Core connection safety** (from [thingspi](https://github.com/thingspi/roon-extension-http-api)) – All endpoints check if core is connected before operating, returning `"core_not_connected"` instead of crashing.
- **Mute endpoint** (from thingspi) – Convenience endpoint to set volume to 0.
- **Swagger API docs** (from thingspi) – Interactive API documentation available at `/api-docs`.
- **Internet Radio search** (from [CaseyRo](https://github.com/CaseyRo/roon-extension-http-api)) – Search internet radio stations; auto-plays if exactly one match is found.
- **Dockerfile** (from thingspi) – Containerized deployment support.
- **Group/Ungroup/Transfer** (from [nidr](https://github.com/nidr/roon-extension-http-api)) – Zone grouping and playback transfer.

## Important gotchas

- `config.json` is gitignored but **required at runtime** — it stores Roon pairing tokens. Each user must pair with their Roon Core to generate one.
- `config.json` currently exists in the working tree even though gitignored. Do not stage or commit it.
- Roon API dependencies are installed directly from GitHub repos (`github:` protocol), not npm registry.
- `package-lock.json` is committed; run `npm install` (not `npm ci`) if dependencies change.
- The `PORT` is hardcoded in `server.js:10` — there is no env-var or CLI override.
- The `list_size` query param is accepted but the browse functions effectively always return the full loaded page (100 items from Roon). The explicit pagination math is in `controllers/roonAPI.js:331` and `:348`.
- `play` returns `{"zone": "Success"}` while all other transport endpoints return `{"status": "success"}` — this is intentional to match existing API consumers.
