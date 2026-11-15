// Configuração do Astro. O objetivo é gerar o mesmo HTML de antes.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marcocordeiro.com.br',
  // Gera kommo-crm.html e link-da-bio/index.html como estão hoje
  build: { format: 'preserve' },
  // Não deixa o Astro mexer nos espaços do HTML
  compressHTML: false,
  trailingSlash: 'ignore',
});
