// Lista única das páginas que entram no sitemap.xml.
// Regra: toda tarefa que muda o texto de uma página atualiza a data dela aqui.
// Mudança só de rodapé, topo, estilo ou código não muda a data.
// Página nova entra nesta lista no mesmo PR que cria a página.
// Ficam de fora: /privacidade, /404 e /link-da-bio.

export interface PaginaSitemap {
  // Endereço da página, começando com barra
  caminho: string;
  // Data da última mudança de texto, no formato AAAA-MM-DD
  data: string;
  // Prioridade (o Google ignora, mantida para seguir o formato de hoje)
  prioridade: string;
}

export const paginas: PaginaSitemap[] = [
  { caminho: '/', data: '2026-11-12', prioridade: '1.0' },
  { caminho: '/api-oficial-whatsapp', data: '2026-11-20', prioridade: '0.8' },
  { caminho: '/crm-para-whatsapp', data: '2026-11-20', prioridade: '0.8' },
  { caminho: '/kommo-crm', data: '2026-11-20', prioridade: '0.9' },
  { caminho: '/parceiro-kommo', data: '2026-11-15', prioridade: '0.8' },
  { caminho: '/rotina-comercial', data: '2026-11-19', prioridade: '0.8' },
  { caminho: '/sobre', data: '2026-11-15', prioridade: '0.6' },
];
