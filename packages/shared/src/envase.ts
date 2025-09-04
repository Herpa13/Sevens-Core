import { z } from 'zod';

export const EnvaseSchema = z.object({
  id: z.union([z.number(), z.literal('new')]),
  name: z.string(),
  tipo: z.enum(['Bote','Doypack','Blister','Caja']).optional(),
  fotoUrl: z.string().url().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  peso: z.number().optional(),
  capacidad: z.string().optional()
});

export type Envase = z.infer<typeof EnvaseSchema>;
