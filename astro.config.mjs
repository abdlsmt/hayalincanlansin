import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain kesinleştiğinde bu URL ve src/config/site.ts içindeki
// siteUrl / domain alanlarını güncelle.
export default defineConfig({
  site: 'https://hayalincanlansin.com.tr',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
