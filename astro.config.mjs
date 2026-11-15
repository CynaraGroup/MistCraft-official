import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import robots from 'astro-robots';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import compress from '@playform/compress';
import { mistcraftConfig } from './scripts/load-mistcraft-config.mjs';
import mistcraftBuildAssets from './scripts/astro-build-assets.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

export default defineConfig({
  site: mistcraftConfig.site.url,
  redirects: {
    '/articles/cynara-members-archive': '/articles/mistcraft-members-archive',
    '/en/articles/cynara-members-archive': '/en/articles/mistcraft-members-archive',
  },
  server: {
    port: 8080,
    host: '127.0.0.1',
  },
  image: {
    domains: [
      'i.mahiro.work',
      'sta.mahiro.work',
      's.mahiro.work',
      'headimg.mahiro.work',
      'layrain.cynara.my',
      'www.hvhbbs.de',
      'avatars.githubusercontent.com',
      'pic1.afdiancdn.com',
    ],
  },
  markdown: {
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    tailwind(),
    mdx(),
    robots({
      sitemap: true,
      policy: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
    mistcraftBuildAssets(),
    compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: false,
    }),
  ],
});
