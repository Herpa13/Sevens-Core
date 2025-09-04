import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.union([z.number(), z.literal('new')]),
  name: z.string(),
  sku: z.string(),
  status: z.enum(['En Estudio','Activo','Inactivo']),
  asin: z.string().optional(),
  ean: z.string().optional(),
  units: z.number().optional()
});

export type Product = z.infer<typeof ProductSchema>;
