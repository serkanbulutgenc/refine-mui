import { z } from 'zod';

const CategorySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().max(255),
  slug: z.string().max(255),
});

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(255),
  body: z.string().min(5),
  category: CategorySchema,
});
