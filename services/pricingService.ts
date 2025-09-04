import type { AppData, PricingRule, Pvpr, PriceHistoryLogSource } from '../types';

interface PriceCalculationOptions {
    logProcess?: boolean;
}

interface PriceCalculationResult {
    finalAmount: number;
    source: PriceHistoryLogSource;
    log?: string[];
}

export const calculatePrice = (
    productId: number,
    platformId: number,
    rule: PricingRule,
    appData: AppData,
    options: PriceCalculationOptions = {}
): PriceCalculationResult => {
    const log: string[] = [];
    const { platforms, pvprs, products, amazonFlashDeals } = appData;
    const productName = products.find(p => p.id === productId)?.name || `ID ${productId}`;

    const platform = platforms.find(p => p.id === platformId);
    if (!platform) {
        if(options.logProcess) log.push(`  - ❌ Error: Plataforma no encontrada.`);
        return {
            finalAmount: 0,
            source: { type: 'pvpr', id: -1, name: 'Error: Plataforma no encontrada' },
            log
        };
    }

    if(options.logProcess) log.push(`Calculando precio para "${productName}" en "${platform.name}"...`);

    // --- START FLASH DEAL CHECK ---
    const now = new Date();
    const activeFlashDeal = amazonFlashDeals.find(deal => 
        deal.productId === productId &&
        deal.platformId === platformId &&
        deal.status === 'Activa' &&
        new Date(deal.startDate) <= now &&
        new Date(deal.endDate) >= now
    );

    if (activeFlashDeal) {
        if(options.logProcess) {
            log.push(`  - ⚡ OFERTA FLASH ACTIVA: "${activeFlashDeal.name}".`);
            log.push(`  - ✅ Precio final por oferta flash: ${activeFlashDeal.dealPrice.toFixed(2)} ${activeFlashDeal.currency}.`);
        }
        return {
            finalAmount: activeFlashDeal.dealPrice,
            source: { type: 'flash_deal', id: activeFlashDeal.id as number, name: activeFlashDeal.name },
            log
        };
    }
    // --- END FLASH DEAL CHECK ---

    const countryId = platform.countryId;
    const basePvpr = pvprs.find(p => p.productId === productId && p.countryId === countryId);
    
    if (!basePvpr) {
        if(options.logProcess) log.push(`  - ❗ No se encontró PVPR base. Precio final = 0.`);
        return {
            finalAmount: 0,
            source: { type: 'pvpr', id: -1, name: 'Error: PVPR no encontrado' },
            log
        };
    }
    
    const pvprAmount = basePvpr.amount;
    if(options.logProcess) log.push(`  - PVPR base encontrado: ${pvprAmount.toFixed(2)} EUR.`);

    if(options.logProcess) {
        log.push(`  - Aplicando regla ejecutada: "${rule.name}".`);
    }

    let finalAmount = pvprAmount;
    const { method, value } = rule.calculation;
    
    switch (method) {
        case 'FIXED_PRICE':
            finalAmount = value ?? 0;
            break;
        case 'DISCOUNT_FROM_PVPR_PERCENTAGE':
            finalAmount = pvprAmount - (pvprAmount * (value ?? 0) / 100);
            break;
        case 'DISCOUNT_FROM_PVPR_AMOUNT':
            finalAmount = pvprAmount - (value ?? 0);
            break;
        case 'MARKUP_FROM_COST':
            finalAmount = pvprAmount; // Placeholder
            break;
        case 'USE_PVPR':
        default:
            finalAmount = pvprAmount;
            break;
    }
    
    const roundedAmount = Math.max(0, parseFloat(finalAmount.toFixed(2)));

    if(options.logProcess) log.push(`  - ✅ Cálculo: ${method}. Precio final: ${roundedAmount.toFixed(2)} EUR.`);

    const finalSource: PriceHistoryLogSource = {
        type: 'rule',
        id: rule.id as number,
        name: rule.name,
    };

    return { finalAmount: roundedAmount, source: finalSource, log };
};

export const calculateFinalCustomerPrice = (
    publishedPrice: number,
    discount?: number | null,
    coupon?: number | null
): number => {
    let finalPrice = publishedPrice;
    if (discount && discount > 0) {
        finalPrice *= (1 - discount / 100);
    }
    if (coupon && coupon > 0) {
        finalPrice *= (1 - coupon / 100);
    }
    // Round to 2 decimal places
    return parseFloat(finalPrice.toFixed(2));
};