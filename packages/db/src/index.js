"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.addCompany = addCompany;
exports.getBrands = getBrands;
exports.addBrand = addBrand;
exports.getStock = getStock;
exports.adjustStock = adjustStock;
exports.getMovements = getMovements;
exports.reset = reset;
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const DB_FILE = (0, path_1.join)(__dirname, '..', 'db.json');
const defaultData = {
    companies: [],
    brands: [],
    stock: {},
    movements: [],
};
async function read() {
    try {
        const data = JSON.parse(await fs_1.promises.readFile(DB_FILE, 'utf-8'));
        return { ...defaultData, ...data };
    }
    catch {
        return { ...defaultData };
    }
}
async function write(data) {
    await fs_1.promises.writeFile(DB_FILE, JSON.stringify(data));
}
async function getCompanies() {
    const db = await read();
    return db.companies;
}
async function addCompany(company) {
    const db = await read();
    db.companies.push(company);
    await write(db);
}
async function getBrands() {
    const db = await read();
    return db.brands;
}
async function addBrand(brand) {
    const db = await read();
    db.brands.push(brand);
    await write(db);
}
async function getStock() {
    const db = await read();
    return Object.values(db.stock);
}
async function adjustStock(adjust) {
    const db = await read();
    const key = `${adjust.warehouseId}:${adjust.variantId}`;
    const current = db.stock[key] || {
        warehouseId: adjust.warehouseId,
        variantId: adjust.variantId,
        quantity: 0,
    };
    current.quantity += adjust.quantity;
    db.stock[key] = current;
    const movement = {
        id: (0, crypto_1.randomUUID)(),
        stockItemId: key,
        type: 'ADJUSTMENT',
        quantity: adjust.quantity,
        createdAt: new Date(),
    };
    db.movements.push(movement);
    await write(db);
    return current;
}
async function getMovements() {
    const db = await read();
    return db.movements.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
}
async function reset() {
    await write({ ...defaultData });
}
