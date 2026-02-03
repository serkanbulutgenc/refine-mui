import { z } from "zod";

export const CategorySchema = z.object({
  description: z.string().max(1000).nullable(),
  title: z.string().max(255).min(2),
  id: z.number().int().positive(),
  slug: z.string().max(255).nullable(),
});

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  body: z.string().min(5),
  category: CategorySchema,
});
