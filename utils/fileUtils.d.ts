export declare const parseCsv: (file: File) => Promise<any[]>;
export declare const unparseCsv: (data: any[] | {
    fields: string[];
    data: any[];
}) => string;
export declare const triggerDownload: (content: string | Blob, fileName: string, mimeType: string) => void;
export declare const createZip: (files: {
    name: string;
    content: string;
}[]) => Promise<Blob>;
