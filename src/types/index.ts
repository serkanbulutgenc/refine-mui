import { z } from 'zod';
import type { PostSchema } from './schemas';
import type { CategorySchema } from './schemas';

export type TPost = z.infer<typeof PostSchema>;
export type TCategory = z.infer<typeof CategorySchema>;
