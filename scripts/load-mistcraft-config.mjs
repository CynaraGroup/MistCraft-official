import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'mistcraft.config.yaml');

const defaultConfig = {
  site: {
    name: 'MistCraft',
    url: 'https://cynara.work',
    description: {
      zh: 'MistCraft 官方网站，展示产品、伙伴、专栏与团队动态。',
      en: 'MistCraft official website featuring products, partners, articles, and team updates.',
    },
    keywords: ['MistCraft', 'MistCraftGroup', 'Tech', 'WebDev'],
    defaultImage: '/assets/images/MistCraft-Line.svg',
    logo: '/assets/images/MistCraft-Icon.svg',
  },
  assets: {
    backgroundImage: '/assets/images/site-background.jpg',
    introVideo: 'https://s.mahiro.work/d/cynara-offical/begin.mp4?sign=EV_Zz9Q2oblkZSHcm0E6MI1ugKe9hM3DfCyFocXaekE=:0',
  },
  home: {
    featuredProducts: 5,
    featuredPartners: 4,
    featuredArticles: 3,
  },
  articles: {
    pinnedOnlyOnHome: true,
    search: {
      enabled: true,
      excerptLength: 6,
      showImages: false,
      showSubResults: false,
    },
    toc: {
      enabled: true,
      scrollOffset: 104,
    },
  },
  routes: {
    home: '/home',
    products: '/products',
    partners: '/partners',
    articles: '/articles',
  },
  external: {
    contactEmail: 'mhya123@mail.mistcraft.cn',
    hiringEmail: 'mhya123@mail.mistcraft.cn',
    sponsorUrl: 'https://payment.mahiro.work/sponsor?referra=MistCraft-WebSite',
    bilibiliUrl: 'https://space.bilibili.com/3706979616819218',
  },
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig(base, override) {
  if (!isRecord(base) || !isRecord(override)) {
    return override ?? base;
  }

  const merged = { ...base };

  for (const [key, value] of Object.entries(override)) {
    merged[key] = isRecord(value) && isRecord(base[key])
      ? mergeConfig(base[key], value)
      : value;
  }

  return merged;
}

function normalizeRoute(route, fallback) {
  if (typeof route !== 'string' || route.trim() === '') {
    return fallback;
  }

  const nextRoute = route.trim();
  return nextRoute.startsWith('/') ? nextRoute : `/${nextRoute}`;
}

function normalizeConfig(config) {
  const merged = mergeConfig(defaultConfig, config);

  return {
    ...merged,
    site: {
      ...merged.site,
      url: String(merged.site.url).replace(/\/+$/, ''),
      keywords: Array.isArray(merged.site.keywords) ? merged.site.keywords : defaultConfig.site.keywords,
    },
    home: {
      featuredProducts: Number(merged.home.featuredProducts) || defaultConfig.home.featuredProducts,
      featuredPartners: Number(merged.home.featuredPartners) || defaultConfig.home.featuredPartners,
      featuredArticles: Number(merged.home.featuredArticles) || defaultConfig.home.featuredArticles,
    },
    articles: {
      ...merged.articles,
      search: {
        ...merged.articles.search,
        excerptLength: Number(merged.articles.search.excerptLength) || defaultConfig.articles.search.excerptLength,
      },
      toc: {
        ...merged.articles.toc,
        scrollOffset: Number(merged.articles.toc.scrollOffset) || defaultConfig.articles.toc.scrollOffset,
      },
    },
    routes: {
      home: normalizeRoute(merged.routes.home, defaultConfig.routes.home),
      products: normalizeRoute(merged.routes.products, defaultConfig.routes.products),
      partners: normalizeRoute(merged.routes.partners, defaultConfig.routes.partners),
      articles: normalizeRoute(merged.routes.articles, defaultConfig.routes.articles),
    },
  };
}

export function loadMistCraftConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      return normalizeConfig(defaultConfig);
    }

    const rawConfig = fs.readFileSync(configPath, 'utf8');
    const parsedConfig = parse(rawConfig) ?? {};
    return normalizeConfig(parsedConfig);
  } catch (error) {
    console.warn(`[mistcraft-config] Failed to read mistcraft.config.yaml: ${error instanceof Error ? error.message : String(error)}`);
    return normalizeConfig(defaultConfig);
  }
}

export const mistcraftConfig = loadMistCraftConfig();
