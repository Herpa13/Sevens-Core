import { z } from 'zod';
export declare const PlatformSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    countryId: z.ZodNumber;
    type: z.ZodEnum<["Marketplace", "Reventa", "Web propia", ""]>;
    status: z.ZodEnum<["En estudio", "En apertura", "Activa", "Cerrada"]>;
    shipsBy: z.ZodEnum<["Platform", "Us"]>;
    url: z.ZodOptional<z.ZodString>;
    orderSystemUrl: z.ZodOptional<z.ZodString>;
    orderSystemUser: z.ZodOptional<z.ZodString>;
    orderSystemPassword: z.ZodOptional<z.ZodString>;
    orderSystemDetails: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "Activa" | "En estudio" | "En apertura" | "Cerrada";
    type: "" | "Marketplace" | "Reventa" | "Web propia";
    id: number | "new";
    countryId: number;
    shipsBy: "Platform" | "Us";
    url?: string | undefined;
    orderSystemUrl?: string | undefined;
    orderSystemUser?: string | undefined;
    orderSystemPassword?: string | undefined;
    orderSystemDetails?: string | undefined;
}, {
    name: string;
    status: "Activa" | "En estudio" | "En apertura" | "Cerrada";
    type: "" | "Marketplace" | "Reventa" | "Web propia";
    id: number | "new";
    countryId: number;
    shipsBy: "Platform" | "Us";
    url?: string | undefined;
    orderSystemUrl?: string | undefined;
    orderSystemUser?: string | undefined;
    orderSystemPassword?: string | undefined;
    orderSystemDetails?: string | undefined;
}>;
export type Platform = z.infer<typeof PlatformSchema>;
