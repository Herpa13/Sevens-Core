import { z } from 'zod';

export const VideoSchema = z.object({
  id: z.union([z.number(), z.literal('new')]),
  name: z.string(),
  url: z.string(),
  platform: z.string(),
  type: z.enum(['Producto','Marca','Testimonio','Educativo']),
  duration: z.number(),
  status: z.enum(['Planificado','Grabado','En Edición','Publicado','Archivado']),
  countryId: z.number(),
  productIds: z.array(z.number()).optional()
});

export type Video = z.infer<typeof VideoSchema>;
