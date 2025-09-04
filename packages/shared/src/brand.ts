import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type Brand = z.infer<typeof BrandSchema>;
