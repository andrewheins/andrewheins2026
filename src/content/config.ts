import { defineCollection, z } from 'astro:content';

const writingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    annotation: z.string(),
    type: z.enum(['essay', 'curated']),
    externalUrl: z.string().url().optional(),

    video_desktop: z.string().optional(),
    video_mobile: z.string().optional(),
    poster_desktop: z.string().optional(),
    poster_mobile: z.string().optional(),
    focus_desktop: z.string().optional(),
    focus_mobile: z.string().optional(),
    title_appears_at: z.number().optional(),
    freeze_at: z.number().optional(),
  }),
});

export const collections = {
  writing: writingCollection,
};
