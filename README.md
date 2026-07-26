# roon-extension-http-api

HTTP API wrapper for controlling [Roon](https://roon.app/) audio streaming.

A Node.js Express server that exposes Roon control via REST endpoints.

Forked from [st0g1e/roon-extension-http-api](https://github.com/st0g1e/roon-extension-http-api) with enhancements from community forks.

---

## Quick Start

```sh
# 1. Install dependencies
npm install

# 2. Configure
cp .env-sample .env
# edit .env with your settings (HOST, PORT, etc.)

# 3. Run
node .

# 4. Enable in Roon
# Go to Roon Settings → Extensions → enable "roon-http-api"
```

## Interactive API Documentation (Swagger)

Once running, open:

**http://[your-host]:[port]/api-docs**

Example: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

Try out any endpoint directly from your browser.

## Configuration

Copy `.env-sample` to `.env` and edit:

```sh
cp .env-sample .env
```

| Variable | Default | Description |
|---|---|---|
| `HOST` | `localhost` | Bind address |
| `PORT` | `3001` | HTTP port |
| `SWAGGER_HOST` | `HOST` | Host shown in Swagger UI |
| `SWAGGER_PORT` | `PORT` | Port shown in Swagger UI |
| `API_TOKEN` | *(empty)* | API token for authentication |

## Docker

```sh
docker build -t roon-http-api .
docker run -p 3001:3001 -v $(pwd)/.env:/app/.env roon-http-api
```

## API Endpoints

All endpoints under `/roonAPI/`:

### Transport

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roonAPI/listZones` | List all zones |
| GET | `/roonAPI/listOutputs` | List all outputs |
| GET | `/roonAPI/getZone?zoneId=` | Get zone details |
| GET | `/roonAPI/getCore` | Connected Roon Core info |
| GET | `/roonAPI/play?zoneId=` | Play |
| GET | `/roonAPI/pause?zoneId=` | Pause |
| GET | `/roonAPI/play_pause?zoneId=` | Toggle play/pause |
| GET | `/roonAPI/stop?zoneId=` | Stop |
| GET | `/roonAPI/next?zoneId=` | Next track |
| GET | `/roonAPI/previous?zoneId=` | Previous track |
| GET | `/roonAPI/change_volume?outputId=&volume=` | Set volume absolute (0-100) |
| GET | `/roonAPI/change_volume_relative?outputId=&volume=` | Change volume relative |
| GET | `/roonAPI/mute?outputId=` | Mute (volume to 0) |

### Grouping

| Method | Endpoint | Description |
|---|---|---|
| POST | `/roonAPI/group` | Group outputs (`body: { "output": [...] }`) |
| POST | `/roonAPI/ungroup` | Ungroup outputs |
| GET | `/roonAPI/transferZone?fromZoneId=&toZoneId=` | Transfer playback |

### Browse

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roonAPI/listByItemKey?zoneId=&item_key=&page=&list_size=` | Browse by item key |
| GET | `/roonAPI/listSearch?zoneId=&toSearch=&list_size=` | Search library |
| GET | `/roonAPI/goUp?zoneId=&list_size=` | Browse up one level |
| GET | `/roonAPI/goHome?zoneId=&list_size=` | Browse to root |
| GET | `/roonAPI/listGoPage?page=&list_size=` | Go to page |
| GET | `/roonAPI/listRefresh?zoneId=` | Refresh browse |

### Internet Radio

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roonAPI/getInternetRadios?zoneId=&toSearch=` | Search & auto-play internet radio |

### Images

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roonAPI/getImage?image_key=` | Image (300x200) |
| GET | `/roonAPI/getMediumImage?image_key=` | Image (640x480) |
| GET | `/roonAPI/getIcon?image_key=` | Icon (100x100) |
| GET | `/roonAPI/getOriginalImage?image_key=` | Original size |

### Timers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roonAPI/getTimers` | List timers |
| GET | `/roonAPI/addTimer?zoneId=&time=&command=&isRepeat=` | Add timer |
| GET | `/roonAPI/removeTimer?zoneId=&time=&command=&isRepeat=` | Remove timer |

## Front-end Examples

Open in browser:

- **Player**: [http://localhost:3001/player.html](http://localhost:3001/player.html)
- **Browser**: [http://localhost:3001/browser.html](http://localhost:3001/browser.html)
- **Timers**: [http://localhost:3001/timers.html](http://localhost:3001/timers.html)

## Features merged from community forks

- **Core connection safety** – All endpoints check if Roon Core is connected ([@thingspi](https://github.com/thingspi/roon-extension-http-api))
- **Mute endpoint** – Quick mute convenience ([@thingspi](https://github.com/thingspi/roon-extension-http-api))
- **Swagger API docs** – Interactive docs at `/api-docs` ([@thingspi](https://github.com/thingspi/roon-extension-http-api))
- **Dockerfile** – Containerized deployment ([@thingspi](https://github.com/thingspi/roon-extension-http-api))
- **Internet Radio search** – Search and auto-play radio stations ([@CaseyRo](https://github.com/CaseyRo/roon-extension-http-api))
- **Group/Ungroup/Transfer** – Zone grouping and playback transfer ([@nidr](https://github.com/nidr/roon-extension-http-api))
