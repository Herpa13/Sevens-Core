import { z } from 'zod';
export declare const VideoSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    url: z.ZodString;
    platform: z.ZodString;
    type: z.ZodEnum<["Producto", "Marca", "Testimonio", "Educativo"]>;
    duration: z.ZodNumber;
    status: z.ZodEnum<["Planificado", "Grabado", "En Edición", "Publicado", "Archivado"]>;
    countryId: z.ZodNumber;
    productIds: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "Archivado" | "Publicado" | "Planificado" | "Grabado" | "En Edición";
    type: "Producto" | "Marca" | "Testimonio" | "Educativo";
    id: number | "new";
    countryId: number;
    url: string;
    platform: string;
    duration: number;
    productIds?: number[] | undefined;
}, {
    name: string;
    status: "Archivado" | "Publicado" | "Planificado" | "Grabado" | "En Edición";
    type: "Producto" | "Marca" | "Testimonio" | "Educativo";
    id: number | "new";
    countryId: number;
    url: string;
    platform: string;
    duration: number;
    productIds?: number[] | undefined;
}>;
export type Video = z.infer<typeof VideoSchema>;
