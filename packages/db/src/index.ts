import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import {
  Company,
  Brand,
  StockItem,
  InventoryMovement,
} from '@sevens/shared';

interface Database {
  companies: Company[];
  brands: Brand[];
  stock: Record<string, StockItem>;
  movements: InventoryMovement[];
}

const DB_FILE = join(__dirname, '..', 'db.json');

const defaultData: Database = {
  companies: [],
  brands: [],
  stock: {},
  movements: [],
};

async function read(): Promise<Database> {
  try {
    const data = JSON.parse(await fs.readFile(DB_FILE, 'utf-8')) as Database;
    return { ...defaultData, ...data };
  } catch {
    return { ...defaultData };
  }
}

async function write(data: Database): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data));
}

export async function getCompanies(): Promise<Company[]> {
  const db = await read();
  return db.companies;
}

export async function addCompany(company: Company): Promise<void> {
  const db = await read();
  db.companies.push(company);
  await write(db);
}

export async function getBrands(): Promise<Brand[]> {
  const db = await read();
  return db.brands;
}

export async function addBrand(brand: Brand): Promise<void> {
  const db = await read();
  db.brands.push(brand);
  await write(db);
}

export async function getStock(): Promise<StockItem[]> {
  const db = await read();
  return Object.values(db.stock);
}

export async function adjustStock(adjust: StockItem): Promise<StockItem> {
  const db = await read();
  const key = `${adjust.warehouseId}:${adjust.variantId}`;
  const current = db.stock[key] || {
    warehouseId: adjust.warehouseId,
    variantId: adjust.variantId,
    quantity: 0,
  };
  current.quantity += adjust.quantity;
  db.stock[key] = current;
  const movement: InventoryMovement = {
    id: randomUUID(),
    stockItemId: key,
    type: 'ADJUSTMENT',
    quantity: adjust.quantity,
    createdAt: new Date(),
  };
  db.movements.push(movement);
  await write(db);
  return current;
}

export async function getMovements(): Promise<InventoryMovement[]> {
  const db = await read();
  return db.movements.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
}

export async function reset(): Promise<void> {
  await write({ ...defaultData });
}
