# Roon API References

> Last updated: July 26, 2026

This document collects all official references for the Roon API (JavaScript/Node.js), which is used to build extensions that interact with the Roon Core for audio streaming control.

---

## Table of Contents

1. [Repository Map](#1-repository-map)
2. [Core Package](#2-core-package)
3. [Service Packages (Used by this Project)](#3-service-packages-used-by-this-project)
4. [Service Packages (Additional / Not Used)](#4-service-packages-additional--not-used)
5. [Tutorial & Examples](#5-tutorial--examples)
6. [JSDoc Generated Documentation](#6-jsdoc-generated-documentation)
7. [Community & Support](#7-community--support)
8. [Quick Start Snippet](#8-quick-start-snippet)

---

## 1. Repository Map

All official Roon API packages are hosted on GitHub under the **RoonLabs** organization:

- **Organization**: [https://github.com/RoonLabs](https://github.com/RoonLabs)
- **Main API repo**: [https://github.com/RoonLabs/node-roon-api](https://github.com/RoonLabs/node-roon-api)

The API follows an extension/service model:
- The **core package** (`node-roon-api`) handles discovery, connection, pairing, and transport.
- **Service packages** can either be *used by* an extension (to control Roon) or *provided by* an extension (to expose functionality to Roon).

---

## 2. Core Package

### `node-roon-api`

| Field | Value |
|---|---|
| Repository | [RoonLabs/node-roon-api](https://github.com/RoonLabs/node-roon-api) |
| Language | JavaScript |
| License | Apache-2.0 |
| Stars | ~150 |
| npm specifier | `github:roonlabs/node-roon-api` |

**Purpose:** Core JavaScript Roon API. Handles:
- Extension identity registration (`extension_id`, `display_name`, etc.)
- Roon Core discovery via UDP (`start_discovery()`)
- WebSocket connection for browser usage (`ws_connect()`)
- Pairing with Roon Cores (`core_paired` / `core_unpaired` callbacks)
- Multi-core support (`core_found` / `core_lost` callbacks)
- Authorization token persistence
- Disconnect / stop discovery

**Key classes:**
- `RoonApi` — main entry point
- `RoonApiTransport` — zone and transport control (via `core.services.RoonApiTransport`)
- `Zone` — represents a Roon zone
- `Output` — represents an audio output device

---

## 3. Service Packages (Used by this Project)

### 3.1 `node-roon-api-transport`

| Field | Value |
|---|---|
| Repository | [RoonLabs/node-roon-api-transport](https://github.com/RoonLabs/node-roon-api-transport) |
| npm specifier | `github:roonlabs/node-roon-api-transport` |

**Purpose:** Control zones and transport (playback). Used by extensions to:

- **Subscribe to zones**: `transport.subscribe_zones(callback)` — receives zone state changes
- **Transport controls**: `play()`, `pause()`, `play_pause()`, `next()`, `previous()`, `seek()`
- **Volume control**: `change_volume()`, `set_volume()`, `mute()`, `unmute()`
- **Zone grouping**: `group_outputs()`, `ungroup_outputs()`, `transfer_zone()`
- **Standby**: `standby()`, `wake()`
- **Queue management**: `add_to_queue()`, `remove_from_queue()`, `clear_queue()`

The callback for `subscribe_zones` receives `(cmd, data)` where `cmd` is one of:
- `"Subscribed"` — initial zone list
- `"Changed"` — zone state changed (playing, paused, volume, etc.)
- `"ZonesChanged"` — zone grouping changed (outputs added/removed)

### 3.2 `node-roon-api-browse`

| Field | Value |
|---|---|
| Repository | [RoonLabs/node-roon-api-browse](https://github.com/RoonLabs/node-roon-api-browse) |
| npm specifier | `github:roonlabs/node-roon-api-browse` |

**Purpose:** Browse Roon's music library and perform actions.

- **Browse hierarchy**: `browse.browse(opts, cb)` — navigate the library tree (browse by album, artist, genre, playlist, etc.)
- **Load a page**: `browse.load(opts, cb)` — load items in a given hierarchy level
- **Search**: `browse.search(opts, cb)` — search across the library
- **List actions** (play now, play next, add to queue, etc.)
- **Get info**: `browse.info(opts, cb)` — get detailed info about an item

Responses include pagination info (`offset`, `has_more`, `items`) and each item has `title`, `subtitle`, `image_key`, and available actions.

### 3.3 `node-roon-api-image`

| Field | Value |
|---|---|
| Repository | [RoonLabs/node-roon-api-image](https://github.com/RoonLabs/node-roon-api-image) |
| npm specifier | `github:roonlabs/node-roon-api-image` |

**Purpose:** Download images from Roon (album art, artist photos, etc.).

- `get_image(image_key, opts, cb)` — fetch image data by its `image_key`
- Supports various output formats and sizes
- Image keys are obtained from browse results or transport zone state

### 3.4 `node-roon-api-status`

| Field | Value |
|---|---|
| Repository | [RoonLabs/node-roon-api-status](https://github.com/RoonLabs/node-roon-api-status) |
| npm specifier | `github:roonlabs/node-roon-api-status` |

**Purpose:** Report extension status to Roon (a *provided* service, not *used*).

- `set_status(message, is_error)` — display a status line under the extension in Roon Settings
- Useful for indicating operational state (e.g., "Connected", "USB device not found")

---

## 4. Service Packages (Additional / Not Used)

These packages are available but not currently used by this project:

| Package | Repository | Purpose |
|---|---|---|
| `node-roon-api-settings` | [RoonLabs/node-roon-api-settings](https://github.com/RoonLabs/node-roon-api-settings) | Provide a settings UI inside Roon Settings |
| `node-roon-api-volume-control` | [RoonLabs/node-roon-api-volume-control](https://github.com/RoonLabs/node-roon-api-volume-control) | Volume control for non-Roon-Ready devices |
| `node-roon-api-source-control` | [RoonLabs/node-roon-api-source-control](https://github.com/RoonLabs/node-roon-api-source-control) | Source input switching for non-Roon-Ready devices |
| `node-roon-api-audioinput` | [RoonLabs/node-roon-api-audioinput](https://github.com/RoonLabs/node-roon-api-audioinput) | Audio input support |

---

## 5. Tutorial & Examples

### Official README Tutorial
The [README of `node-roon-api`](https://github.com/RoonLabs/node-roon-api#roon-api-for-javascript-an-overview-and-tutorial) contains a complete step-by-step tutorial covering:

1. Getting started (project setup, dependencies)
2. Connecting to a Roon Core
3. Services overview (using vs providing)
4. Pairing (single vs multi-core environments)
5. Providing a service (status example)
6. Using a service (transport zone subscription example)
7. Working with multiple Roon Cores
8. Using the API in a Web Browser (WebSocket vs UDP discovery)

### Web Test App
- **Repository**: [RoonLabs/roon-extension-web-testapp](https://github.com/RoonLabs/roon-extension-web-testapp)
- A working example of the Roon API used in a web browser context
- Demonstrates `ws_connect()` instead of UDP discovery

### Third-party Examples
- **This project** (`roon-extension-http-api`) — [PierpaoloPernici/roon-extension-http-api](https://github.com/PierpaoloPernici/roon-extension-http-api) — serves as a practical example of wrapping Roon API behind HTTP endpoints for transport, browse, and image services.

---

## 6. JSDoc Generated Documentation

> **URL**: [https://roonlabs.github.io/node-roon-api/](https://roonlabs.github.io/node-roon-api/)

Auto-generated documentation from source code comments. Key pages:

| Page | Description |
|---|---|
| `index.html` | Entry point with class listing |
| `RoonApi.html` | Main RoonApi class — constructor, discovery, services |
| `RoonApiTransport.html` | Transport service — subscribe_zones, play, pause, volume, etc. |
| `RoonApiImage.html` | Image service — get_image method |
| `Zone.html` | Zone object structure (state, outputs, now_playing, etc.) |
| `Output.html` | Output object structure |
| `lib.js.html` | Internal library utilities |

The JSDoc is also available locally in the `docs/` folder of the `node-roon-api` repository.

---

## 7. Community & Support

| Resource | Link |
|---|---|
| Gitter Chat | [gitter.im/RoonLabs/node-roon-api](https://gitter.im/RoonLabs/node-roon-api) |
| GitHub Issues (core) | [node-roon-api/issues](https://github.com/RoonLabs/node-roon-api/issues) |
| GitHub Issues (transport) | [node-roon-api-transport/issues](https://github.com/RoonLabs/node-roon-api-transport/issues) |
| GitHub Issues (browse) | [node-roon-api-browse/issues](https://github.com/RoonLabs/node-roon-api-browse/issues) |
| Roon Labs Website | [roonlabs.com](https://roonlabs.com) |
| Roon Knowledge Base | [kb.roonlabs.com](https://kb.roonlabs.com) |

---

## 8. Quick Start Snippet

```javascript
const RoonApi = require('node-roon-api');
const RoonApiTransport = require('node-roon-api-transport');
const RoonApiStatus = require('node-roon-api-status');

const roon = new RoonApi({
    extension_id: 'com.example.my-extension',
    display_name: 'My Extension',
    display_version: '1.0.0',
    publisher: 'My Name',
    email: 'me@example.com',
    website: 'https://example.com',
});

const svc_status = new RoonApiStatus(roon);

roon.init_services({
    required_services: [RoonApiTransport],
    provided_services: [svc_status],
});

roon.start_discovery();
```

---

*For questions or updates to this document, refer to the individual GitHub repositories linked above.*
