// src/handlers/catalog.ts
import { StremioMeta } from '../types';

export async function handleCatalog(type: string, id: string, extra: any): Promise<{ metas: StremioMeta[] }> {
  const decodedId = decodeURIComponent(id);
  if (type !== 'series' || !decodedId.startsWith('onepace-es-')) {
    return { metas: [] };
  }

  // Support v2/v3 structure (with colons) or clean v4 structure
  let seriesId = decodedId;
  if (decodedId.endsWith('-v2') || decodedId.endsWith('-v3')) {
    seriesId = `${decodedId}:onepace`;
  }

  // Determine the base URL for self-hosted assets (logo, etc.)
  const baseUrl = process.env.BASE_URL || 'http://localhost:7000';

  const metas: StremioMeta[] = [
    {
      id: seriesId,
      type: 'series',
      name: 'One Pace en Español',
      posterShape: 'poster',
      poster: 'https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg',
      background: 'https://image.tmdb.org/t/p/original/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg',
      logo: `${baseUrl}/public/logo.png`,
      description: 'One Pace es un proyecto hecho por fans que recorta el anime One Piece para alinearlo con el ritmo del manga original de Eiichiro Oda, eliminando el relleno. Esta versión en español unifica el catálogo oficial (con subtítulos y audio en español integrados) y las ediciones fan-made de "Spanish Pace" (ediciones exclusivas en español para arcos no cubiertos oficialmente, como Wano 45+ y Egghead).',
      genres: ['Animación', 'Fantasía', 'Aventura', 'Acción', 'Anime'],
      releaseInfo: '1999-',
    },
  ];

  if (extra && extra.search) {
    const query = extra.search.toLowerCase();
    const matches = ['one pace', 'onepiece', 'one pace es', 'spanish pace', 'one pace español'].some(term =>
      term.includes(query) || query.includes(term)
    );
    if (!matches) {
      return { metas: [] };
    }
  }

  return { metas };
}
