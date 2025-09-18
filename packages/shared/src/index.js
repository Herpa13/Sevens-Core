"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMovementSchema = exports.StockItemSchema = exports.CompanySchema = exports.BrandSchema = exports.VideoSchema = exports.EnvaseSchema = exports.PlatformSchema = exports.CountrySchema = exports.ProductSchema = void 0;
var product_1 = require("./product");
Object.defineProperty(exports, "ProductSchema", { enumerable: true, get: function () { return product_1.ProductSchema; } });
var country_1 = require("./country");
Object.defineProperty(exports, "CountrySchema", { enumerable: true, get: function () { return country_1.CountrySchema; } });
var platform_1 = require("./platform");
Object.defineProperty(exports, "PlatformSchema", { enumerable: true, get: function () { return platform_1.PlatformSchema; } });
var envase_1 = require("./envase");
Object.defineProperty(exports, "EnvaseSchema", { enumerable: true, get: function () { return envase_1.EnvaseSchema; } });
var video_1 = require("./video");
Object.defineProperty(exports, "VideoSchema", { enumerable: true, get: function () { return video_1.VideoSchema; } });
var brand_1 = require("./brand");
Object.defineProperty(exports, "BrandSchema", { enumerable: true, get: function () { return brand_1.BrandSchema; } });
var company_1 = require("./company");
Object.defineProperty(exports, "CompanySchema", { enumerable: true, get: function () { return company_1.CompanySchema; } });
var stock_item_1 = require("./stock-item");
Object.defineProperty(exports, "StockItemSchema", { enumerable: true, get: function () { return stock_item_1.StockItemSchema; } });
var inventory_movement_1 = require("./inventory-movement");
Object.defineProperty(exports, "InventoryMovementSchema", { enumerable: true, get: function () { return inventory_movement_1.InventoryMovementSchema; } });
__exportStar(require("./additional"), exports);
