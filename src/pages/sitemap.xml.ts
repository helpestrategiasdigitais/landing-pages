import type { APIRoute } from 'astro';
import { paginas } from '../data/paginas';

// Endereço base do site
const SITE = 'https://marcocordeiro.com.br';

// Gera o /sitemap.xml na hora do build, a partir de src/data/paginas.ts
export const GET: APIRoute = () => {
  const urls = paginas
    .map(
      (p) => `  <url>
    <loc>${SITE}${p.caminho}</loc>
    <lastmod>${p.data}</lastmod>
    <priority>${p.prioridade}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
