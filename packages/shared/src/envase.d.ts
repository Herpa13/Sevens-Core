import { z } from 'zod';
export declare const EnvaseSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    tipo: z.ZodOptional<z.ZodEnum<["Bote", "Doypack", "Blister", "Caja"]>>;
    fotoUrl: z.ZodOptional<z.ZodString>;
    height: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    peso: z.ZodOptional<z.ZodNumber>;
    capacidad: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    length?: number | undefined;
    tipo?: "Blister" | "Caja" | "Bote" | "Doypack" | undefined;
    fotoUrl?: string | undefined;
    height?: number | undefined;
    width?: number | undefined;
    peso?: number | undefined;
    capacidad?: string | undefined;
}, {
    name: string;
    id: number | "new";
    length?: number | undefined;
    tipo?: "Blister" | "Caja" | "Bote" | "Doypack" | undefined;
    fotoUrl?: string | undefined;
    height?: number | undefined;
    width?: number | undefined;
    peso?: number | undefined;
    capacidad?: string | undefined;
}>;
export type Envase = z.infer<typeof EnvaseSchema>;
