import { type StockItem, type InventoryMovement } from '@sevens/shared';
export declare class InventoryController {
    getAll(): Promise<StockItem[]>;
    adjust(body: StockItem): Promise<StockItem>;
    movements(): Promise<InventoryMovement[]>;
}
