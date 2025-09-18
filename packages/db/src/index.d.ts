import { Company, Brand, StockItem, InventoryMovement } from '@sevens/shared';
export declare function getCompanies(): Promise<Company[]>;
export declare function addCompany(company: Company): Promise<void>;
export declare function getBrands(): Promise<Brand[]>;
export declare function addBrand(brand: Brand): Promise<void>;
export declare function getStock(): Promise<StockItem[]>;
export declare function adjustStock(adjust: StockItem): Promise<StockItem>;
export declare function getMovements(): Promise<InventoryMovement[]>;
export declare function reset(): Promise<void>;
