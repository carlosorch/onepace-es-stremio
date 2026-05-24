# One Pace en Español — Stremio Addon

🌐 [Leer en Español](README_ES.md)

[![Stremio Addon](https://img.shields.io/badge/Stremio-Addon-purple.svg?style=for-the-badge)](https://www.stremio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

A Stremio addon that integrates the **One Pace** catalog with Spanish subtitles and dubbing, merging the official One Pace project releases with community-exclusive Spanish edits (*Spanish Pace*, Wano 45+ arcs, Egghead, etc.).

---

## ⚖️ LEGAL DISCLAIMER & DMCA NOTICE

**This Stremio addon is strictly a technology service acting as an open-source metadata aggregator and parser.**

* **NO MEDIA HOSTING OR DISTRIBUTION:** This addon **DOES NOT** host, store, transmit, or physically distribute any video, audio, or copyrighted multimedia files of any kind.
* **METADATA PARSER ONLY:** The server acts solely as a query transformer. It receives requests from the Stremio client, searches for matching entries in a public text database (`data.json`), and returns formatted JSON data.
* **EXTERNAL LINKS & P2P RESOLUTION:** Stream endpoints returned by this API are strictly public BitTorrent **infoHash hashes** (which are resolved and played peer-to-peer natively by the Stremio client) or **proxy redirection URLs** pointing to third-party file storage systems (PixelDrain), which operate entirely independently of this software.
* **EDUCATIONAL & RESEARCH PURPOSES:** This software is developed purely for educational and research purposes concerning the interoperability of Stremio's protocol. The developers assume no responsibility for how users interact with or utilize the metadata provided.

---

## 🚀 Key Features

* 🔄 **Version-Agnostic Compatibility:** Instant support for Stremio client requests querying legacy version patterns (`onepace-es-v2`, `onepace-es-v3`) and current formats (`onepace-es-v4`), preventing blank rendering screen crashes by resolving historical offline library states.
* ⚡ **Optimized Stream Proxy:** An integrated proxy server to resolve direct streams from PixelDrain, heavily reducing daily quota consumption through Range requests (smooth scrubbing) and active request-abort handling.
* 🌐 **Dual-Stack Socket Binding:** Automated binding to both IPv4 (`0.0.0.0`) and IPv6 (`::`) interfaces to resolve connection issues on Linux/Pop!_OS clients trying to connect to localhost.
* 🧲 **Native P2P Integration:** Automatically structures official episode hashes into compliant Stremio torrent stream responses.

---

## 🔧 Prerequisites

* [Node.js](https://nodejs.org/) (Version 20 or higher recommended)
* [pnpm](https://pnpm.io/) or `npm`

---

## 🛠️ Installation & Local Setup

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the Development Server:**
   ```bash
   pnpm run dev
   ```
   *The addon runs on port `7000` by default.*
   * **Manifest URL:** `http://localhost:7000/manifest.json`
   * **Stremio Installation Link:** `stremio://localhost:7000/manifest.json`

3. **Run Compatibility Tests:**
   Validate that all API endpoints (catalog, meta, and streams) respond correctly for all legacy and current version schemas:
   ```bash
   npx tsx scratch/test-compat.ts
   ```

---

## 📦 Project Structure

* `src/manifest.ts` — Addon manifest configuration and supported version prefixes.
* `src/index.ts` — Express server router, CORS settings, and proxy endpoints.
* `src/handlers/` — Stremio API protocol handlers (`catalog.ts`, `meta.ts`, `stream.ts`).
* `src/lib/` — Stream proxy mechanics and range request utilities.
* `scratch/` — Local integration and compatibility testing scripts.
