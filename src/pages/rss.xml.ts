import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { mistcraftConfig } from '../config/mistcraft';

export async function GET(context: { site: URL | undefined }) {
  const articles = await getCollection('articles', ({ data }) => {
    return data.draft !== true;
  });

  const sortedArticles = articles.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${mistcraftConfig.site.name} - 专栏`,
    description: mistcraftConfig.site.description.zh,
    site: context.site?.toString() ?? mistcraftConfig.site.url,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.description ?? '',
      link: `/articles/${article.slug}/`,
      categories: article.data.tags ?? [],
      author: article.data.author ?? mistcraftConfig.site.name,
    })),
    customData: `<language>zh-cn</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
