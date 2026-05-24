// src/lib/proxy.ts
// PixelDrain proxy server for bypassing hotlink detection on free accounts.
// This module creates Express routes that fetch from PixelDrain server-side
// and pipe the response to the client, including Range request support.

import http from 'http';
import https from 'https';
import { URL } from 'url';

export interface ProxyConfig {
  /** PixelDrain API key (optional, enables direct hotlinking instead of proxy) */
  pixeldrainApiKey?: string;
  /** Base URL of this addon server (for constructing proxy URLs) */
  addonBaseUrl: string;
  /** Whether proxy is enabled (only needed when no API key) */
  proxyEnabled: boolean;
}

let config: ProxyConfig = {
  addonBaseUrl: 'http://localhost:7000',
  proxyEnabled: true,
};

export function setProxyConfig(newConfig: Partial<ProxyConfig>): void {
  config = { ...config, ...newConfig };
}

export function getProxyConfig(): ProxyConfig {
  return config;
}

/**
 * Get the stream URL for a PixelDrain file.
 * If API key is set, returns authenticated direct URL.
 * If proxy is enabled, returns proxy URL through this server.
 * Otherwise returns direct (will likely be blocked by hotlink detection).
 */
export function getStreamUrl(pixeldrainFileId: string): string {
  if (config.pixeldrainApiKey) {
    // Authenticated direct URL - bypasses hotlink detection
    return `https://${config.pixeldrainApiKey}:@pixeldrain.net/api/file/${pixeldrainFileId}`;
  }
  if (config.proxyEnabled) {
    // Proxy through this server
    return `${config.addonBaseUrl}/proxy/${pixeldrainFileId}`;
  }
  // Direct (will be blocked on free accounts)
  return `https://pixeldrain.net/api/file/${pixeldrainFileId}`;
}

/**
 * Handle a proxy request: fetch from PixelDrain and pipe to client.
 * Supports Range requests for video seeking.
 */
export function handleProxyRequest(
  fileId: string,
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const targetUrl = new URL(`https://pixeldrain.net/api/file/${fileId}`);

  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  };

  // Forward Range header for video seeking
  if (req.headers.range) {
    headers['Range'] = req.headers.range;
  }

  // Add API key auth if available
  if (config.pixeldrainApiKey) {
    const auth = Buffer.from(`${config.pixeldrainApiKey}:`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const proxyReq = https.request(
    {
      hostname: targetUrl.hostname,
      path: targetUrl.pathname,
      method: 'GET',
      headers,
    },
    (proxyRes) => {
      // Forward status code (200 or 206 for partial content)
      const statusCode = proxyRes.statusCode || 500;

      // Forward relevant headers
      const forwardHeaders: Record<string, string> = {};
      const headersToForward = [
        'content-type',
        'content-length',
        'content-range',
        'accept-ranges',
        'content-disposition',
      ];

      for (const header of headersToForward) {
        const value = proxyRes.headers[header];
        if (value) {
          forwardHeaders[header] = Array.isArray(value) ? value[0] : value;
        }
      }

      // Add CORS headers
      forwardHeaders['Access-Control-Allow-Origin'] = '*';
      forwardHeaders['Access-Control-Allow-Headers'] = 'Range';
      forwardHeaders['Access-Control-Expose-Headers'] = 'Content-Range, Content-Length, Accept-Ranges';

      res.writeHead(statusCode, forwardHeaders);
      proxyRes.pipe(res);
    }
  );

  // Abort the backend request immediately if the client disconnects or aborts (e.g., during player seeking)
  req.on('close', () => {
    console.log(`[Proxy] Client closed connection. Aborting backend request to PixelDrain for file ID: ${fileId}`);
    proxyReq.destroy();
  });

  proxyReq.on('error', (err) => {
    console.error(`[Proxy] Error fetching ${fileId}:`, err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    }
  });

  proxyReq.end();
}
