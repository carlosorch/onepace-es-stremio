## OnePaceEs Research Report — Complete Findings

### Overview

**One Pace** is a fan project that re-edits the One Piece anime to match manga pacing. The **Spanish community** ("OnePaceEs" / "Spanish Pace") is an *unofficial* offshoot that adds Spanish subtitles/edits to One Pace releases and fills gaps for arcs not yet covered by the official project.

There are **two distinct ecosystems**:
1. **Official One Pace** (onepace.net) — has some Spanish subs, uses PixelDrain + torrents
2. **Community "Spanish Pace"** — fan editors (ZamuSkl, Nahel27, Sanji993) who create Spanish-specific edits/subs for uncovered arcs

---

### 1. LINKTREE PAGES (Hub Links)

| Linktree | Owner | Purpose |
|----------|-------|---------|
| `https://linktr.ee/OnePaceEs` | Community hub | Central hub for Spanish One Pace links (watch order, downloads, credits) |
| `https://linktr.ee/zamuskl` | ZamuSkl (editor) | Links to his Spanish Pace edits (Wano, Egghead, Onigashima Kai, Fishman Island 15) |
| `https://linktr.ee/sanji993` | Sanji993 (editor) | Links to Spanish Pace edits |

**Note**: These Linktrees typically contain links to PixelDrain folders/lists, Google Drive, Telegram, and Discord.

---

### 2. PIXELDRAIN — Primary File Hosting

**URL Patterns:**
- Individual files: `https://pixeldrain.net/u/{FileID}`
- Lists/albums (episode collections): `https://pixeldrain.net/l/{ListID}` (e.g., `https://pixeldrain.net/l/Ua5GkcGr`)
- Folders: `https://pixeldrain.net/d/{FolderID}`

**API Access:**
- `GET https://pixeldrain.com/api/list/{list_id}` → Returns JSON with file metadata
- `GET https://pixeldrain.com/api/file/{file_id}?download` → Direct file download
- Response JSON includes: `id`, `name`, `files[]` (each with `id`, `name`, `size`, `mime_type`), `date_created`
- Auth: Basic Auth with API key as password (for private lists)
- **Rate limits**: Daily download quotas apply; can hit streaming caps

**Content Structure:**
- Official One Pace uses PixelDrain for streaming/downloading episodes (linked from onepace.net/watch)
- Spanish Pace editors likely use separate PixelDrain lists organized by arc
- Content is organized by arc → episodes within each arc

**Key Insight for Addon**: PixelDrain lists are the primary structured, API-accessible source of video files.

---

### 3. TELEGRAM

| Channel | Handle | Status |
|---------|--------|--------|
| One Pace - Español | `@OnePaceESP` | Unofficial fan channel; reuploads One Pace with Spanish subs |

**Details:**
- Official One Pace **stopped uploading to Telegram** in 2024 (migrated to PixelDrain)
- `@OnePaceESP` is community-run, hosts files organized by arcs from editors like ZamuSkl and Nahel27
- Files are shared directly in the channel (video files with embedded subs)
- May be outdated; not actively maintained by official team
- **Potential data source**: Telegram Bot API could be used to scrape file links, but this is fragile

---

### 4. DISCORD

| Server | Invite Pattern | Status |
|--------|---------------|--------|
| Official One Pace Discord | `discord.gg/pacing` (historical) | Has been unstable/closed periodically |

**Details:**
- Has had language-specific channels including Spanish
- Spanish channel has role-based access (request "español" role)
- Sharing direct links to PixelDrain is **prohibited** in main server (can get muted)
- Community shares spreadsheets with watch order and episode links
- **Not a reliable programmatic source** — Discord API requires bot tokens, and link sharing is restricted

---

### 5. OFFICIAL ONE PACE WEBSITE (onepace.net)

**Structure:**
- Watch page: `https://onepace.net/en/watch` (localized URLs)
- Each arc has episodes listed with download options: PixelDrain, Magnet, Torrent
- Has Spanish subtitles for many (but NOT all) arcs
- **No official public API**

**Workaround**: The Wayback Machine (`archive.org`) can be used to retrieve PixelDrain links if the site is down.

---

### 6. STREMIO ADDONS

| Addon | URL/Source | Type |
|-------|-----------|------|
| One Pace (standard) | `onepace.arl.sh/manifest.json` | Free, torrent-based |
| One Pace Stremio v2 | `github.com/vasujain275/onepace-stremio-v2` | Older, automated |
| One Pace x Kai | `github.com/roshank231/optest` | Combined, discontinued |
| One Pace Premium | `onepace-premium.1102011.xyz` | Debrid-based, 15+ languages incl. Spanish |
| OnePaceStremio (manual) | `github.com/fedew04/OnePaceStremio` | Early version, manually maintained |

**One Pace Premium is most relevant** — supports Spanish subs, uses debrid for buffer-free streaming, generates custom manifest URLs with API key.

---

### 7. TORRENT SOURCES

| Source | URL | Notes |
|--------|-----|-------|
| Nyaa.si | `https://nyaa.si` (search "One Pace") | Primary torrent index for anime; has One Pace releases |
| Official torrents | Linked from onepace.net | Magnet links on watch page |

- Not all episodes available in 1080p
- Community spreadsheets track quality/availability per arc

---

### 8. SUBTITLE FILES

| Source | URL | Format |
|--------|-----|--------|
| Official GitHub repo | `https://github.com/one-pace/one-pace-public-subtitles` | `.ass` and `.srt` files |

**Details:**
- Official repo focuses on English, German, Portuguese
- Spanish subs exist but are **not consistently available** for all arcs
- Organized by arc/episode folders
- Quality standard: translations must be checked against original Japanese
- Community-created Spanish subs may exist in the repo if contributed

---

### 9. METADATA / STRUCTURED DATA SOURCES

| Repository | URL | Data |
|-----------|-----|------|
| ladyisatis/one-pace-metadata | `github.com/ladyisatis/one-pace-metadata` | `arcs.json`, `episodes.json`, `status.json` |
| jasanpreetn9/onepace-metadata | `github.com/jasanpreetn9/onepace-metadata` | Sonarr-style media manager, scrapes metadata |
| matteron/one-pace-plex-api | `github.com/matteron/one-pace-plex-api` | Plex metadata API |
| tissla/opforjellyfin | `github.com/tissla/opforjellyfin` | Jellyfin integration |
| jwueller/jellyfin-plugin-onepace | `github.com/jwueller/jellyfin-plugin-onepace` | Jellyfin plugin |

**Key structured data files:**
- `arcs.json` — arc names, numbers, status
- `episodes.json` — episode titles, CRC32 hashes, descriptions, release dates, manga chapter mappings
- These are auto-scraped from official sources and maintained in append-only format

---

### 10. SPANISH PACE — ARC COVERAGE MAP

Based on community watch guides, here's what uses "Spanish Pace" (fan edits) vs. official One Pace:

| Arc | Source | Editor |
|-----|--------|--------|
| Romance Dawn → Koby-Meppo | Official One Pace | — |
| Little Garden (01-03) | Official One Pace | — |
| Little Garden (04-05) | Old edits | — |
| Drum Island → Skypiea | Official One Pace | — |
| **Long Ring Long Land** | **Spanish Pace** | Nahel27 |
| Water Seven (01-05) | Official One Pace | — |
| **Water Seven (06-20)** | **Spanish Pace** | Nahel27 |
| Enies Lobby | Official One Pace | — |
| **Post-Enies Lobby** | **Spanish Pace** | Nahel27 |
| Thriller Bark → Return to Sabaody | Official One Pace | — |
| Fishman Island (01-14) | Official One Pace | — |
| **Fishman Island (15)** | **Spanish Pace** | ZamuSkl |
| Punk Hazard → Levely | Official One Pace | — |
| Wano (01-44) | Official One Pace | — |
| **Wano (45-55+)** | **Spanish Pace** | ZamuSkl |
| **Egghead** | **Spanish Pace** | ZamuSkl |
| **Onigashima Kai** | **Spanish Pace** | ZamuSkl |

---

### 11. ALL URLS COLLECTED (Organized by Type)

**Official Sites:**
- `https://onepace.net` — Main website
- `https://onepace.net/en/watch` — Episode watch/download page

**Linktree Hubs:**
- `https://linktr.ee/OnePaceEs` — Spanish community hub
- `https://linktr.ee/zamuskl` — ZamuSkl's links
- `https://linktr.ee/sanji993` — Sanji993's links

**PixelDrain (file hosting):**
- Pattern: `https://pixeldrain.net/l/{ListID}` (lists/albums)
- Pattern: `https://pixeldrain.net/u/{FileID}` (individual files)
- Pattern: `https://pixeldrain.net/d/{FolderID}` (folders)
- API: `https://pixeldrain.com/api/list/{id}` (JSON metadata)
- API: `https://pixeldrain.com/api/file/{id}?download` (download)

**Telegram:**
- `https://t.me/OnePaceESP` (or `@OnePaceESP`) — Spanish channel

**Discord:**
- `https://discord.gg/pacing` — Official One Pace (historically; may be invalid)

**GitHub Repositories:**
- `https://github.com/one-pace/one-pace-public-subtitles` — Official subtitle files
- `https://github.com/ladyisatis/one-pace-metadata` — Structured metadata (arcs.json, episodes.json)
- `https://github.com/jasanpreetn9/onepace-metadata` — Media manager
- `https://github.com/vasujain275/onepace-stremio-v2` — Stremio addon (older)
- `https://github.com/fedew04/OnePaceStremio` — Stremio addon (manual)
- `https://github.com/roshank231/optest` — One Pace x Kai addon
- `https://github.com/tissla/opforjellyfin` — Jellyfin tool
- `https://github.com/jwueller/jellyfin-plugin-onepace` — Jellyfin plugin
- `https://github.com/matteron/one-pace-plex-api` — Plex metadata API

**Stremio Addons:**
- `https://onepace-premium.1102011.xyz` — Premium addon config page
- `onepace.arl.sh/manifest.json` — Standard addon manifest

**Torrent Sites:**
- `https://nyaa.si` (search "One Pace")

**Community/Social:**
- `https://reddit.com/r/onepace` — Reddit community
- `https://stremio-addons.net` — Stremio addon catalog

---

### 12. RECOMMENDATIONS FOR STREMIO ADDON DEVELOPMENT

For building a Stremio addon for OnePaceEs, the most promising approaches are:

1. **PixelDrain API** — The most structured, API-accessible source. If you can get the list IDs from the Linktree/community pages, you can programmatically fetch all file metadata (names, sizes) and construct download/stream URLs.

2. **Metadata repos** (`ladyisatis/one-pace-metadata`) — Provides `arcs.json` and `episodes.json` with structured episode data (titles, CRC32 hashes, arc mappings). This is essential for building the catalog.

3. **Official subtitle repo** (`one-pace/one-pace-public-subtitles`) — For serving Spanish subtitles alongside video streams.

4. **Existing Stremio addon code** — Study `vasujain275/onepace-stremio-v2` and the Premium addon for patterns on how they structure the manifest, catalog, and stream resolution.

The project workspace (`/home/carlosorch/Documents/onepace-es-stremio`) is currently empty (only contains `.antigravitycli`).
