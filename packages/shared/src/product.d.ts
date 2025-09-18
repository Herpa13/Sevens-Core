import { z } from 'zod';
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    sku: z.ZodString;
    status: z.ZodEnum<["En Estudio", "Activo", "Inactivo"]>;
    asin: z.ZodOptional<z.ZodString>;
    ean: z.ZodOptional<z.ZodString>;
    units: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sku: string;
    status: "Activo" | "En Estudio" | "Inactivo";
    id: number | "new";
    ean?: string | undefined;
    units?: number | undefined;
    asin?: string | undefined;
}, {
    name: string;
    sku: string;
    status: "Activo" | "En Estudio" | "Inactivo";
    id: number | "new";
    ean?: string | undefined;
    units?: number | undefined;
    asin?: string | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
