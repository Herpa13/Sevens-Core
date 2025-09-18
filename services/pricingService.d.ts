import type { AppData, PricingRule, PriceHistoryLogSource } from '../types';
interface PriceCalculationOptions {
    logProcess?: boolean;
}
interface PriceCalculationResult {
    finalAmount: number;
    source: PriceHistoryLogSource;
    log?: string[];
}
export declare const calculatePrice: (productId: number, platformId: number, rule: PricingRule, appData: AppData, options?: PriceCalculationOptions) => PriceCalculationResult;
export declare const calculateFinalCustomerPrice: (publishedPrice: number, discount?: number | null, coupon?: number | null) => number;
export {};
