// src/index.ts
import express from 'express';
import * as path from 'path';
import { addonBuilder, getRouter } from 'stremio-addon-sdk';
import { manifest } from './manifest';
import { handleCatalog } from './handlers/catalog';
import { handleMeta } from './handlers/meta';
import { handleStream } from './handlers/stream';
import { handleProxyRequest, setProxyConfig } from './lib/proxy';

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async (args) => {
  return handleCatalog(args.type, args.id, args.extra);
});

builder.defineMetaHandler(async (args) => {
  return handleMeta(args.type, args.id);
});

builder.defineStreamHandler(async (args) => {
  return handleStream(args.type, args.id);
});

const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);

const app = express();

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[HTTP Logger] ${req.method} ${req.url}`);
  next();
});


// Add CORS headers for proxy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Range');
  res.header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
  next();
});

// Serve static public assets (logo, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  immutable: true,
}));

// Register PixelDrain proxy endpoint
app.get('/proxy/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  console.log(`[Server] Proxy request received for file ID: ${fileId}`);
  handleProxyRequest(fileId, req, res);
});

// Register the stremio addon router
app.use('/', router);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 7000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Configure proxy base URL
setProxyConfig({
  addonBaseUrl: BASE_URL,
  proxyEnabled: true
});

app.listen(PORT, () => {
  console.log(`\n🚀 One Pace en Español Stremio Addon is running!`);
  console.log(`📡 Addon manifest URL: ${BASE_URL}/manifest.json`);
  console.log(`📺 Proxy base URL: ${BASE_URL}/proxy`);
  console.log(`🔗 Stremio installation link: stremio://${BASE_URL.replace(/^https?:\/\//, '')}/manifest.json\n`);
});
