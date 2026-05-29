// src/manifest.ts
import { Manifest } from 'stremio-addon-sdk';

export const manifest: Manifest = {
  id: 'community.onepace-es-v4',
  version: '1.0.0',
  name: 'One Pace en Español',
  description: 'Ve One Pace editado y subtitulado/doblado al español. Incluye los arcos oficiales de One Pace y las ediciones exclusivas en español de "Spanish Pace" (Wano 45+, Egghead, etc.).',
  types: ['series'],
  catalogs: [
    {
      type: 'series',
      id: 'onepace-es-v4',
      name: 'One Pace ES',
      extra: [
        {
          name: 'search',
          isRequired: false,
        },
      ],
    },
  ],
  resources: ['catalog', 'meta', 'stream'],
  idPrefixes: ['onepace-es-v4', 'onepace-es-v3', 'onepace-es-v2'],
  logo: 'https://onepace.net/images/one-pace-logo.png',
  background: 'https://image.tmdb.org/t/p/original/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg',
  behaviorHints: {
    configurable: false,
  },
};
