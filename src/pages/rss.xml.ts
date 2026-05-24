import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('writing', ({ data }) => data.type === 'essay');
  essays.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: `${siteConfig.authorFullName} — Writing`,
    description: `Essays by ${siteConfig.authorFullName}, President of ${siteConfig.employerName}.`,
    site: context.site ?? siteConfig.siteBaseUrl,
    items: essays.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.slug}/`,
    })),
  });
}
