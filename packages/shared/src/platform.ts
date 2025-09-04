import { z } from 'zod';

export const PlatformSchema = z.object({
  id: z.union([z.number(), z.literal('new')]),
  name: z.string(),
  countryId: z.number(),
  type: z.enum(['Marketplace','Reventa','Web propia','']),
  status: z.enum(['En estudio','En apertura','Activa','Cerrada']),
  shipsBy: z.enum(['Platform','Us']),
  url: z.string().url().optional(),
  orderSystemUrl: z.string().url().optional(),
  orderSystemUser: z.string().optional(),
  orderSystemPassword: z.string().optional(),
  orderSystemDetails: z.string().optional()
});

export type Platform = z.infer<typeof PlatformSchema>;
