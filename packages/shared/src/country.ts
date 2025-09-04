import { z } from 'zod';

export const CountrySchema = z.object({
  id: z.union([z.number(), z.literal('new')]),
  name: z.string(),
  iso: z.string(),
  notificationProcess: z.string().optional(),
  requiredDocuments: z.string().optional()
});

export type Country = z.infer<typeof CountrySchema>;
