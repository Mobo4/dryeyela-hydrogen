import { useState, useEffect } from 'react';
import { Money, flattenConnection } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Text } from '~/components/Text';
import clsx from 'clsx';

/**
 * Represents a product variant with the minimum fields required by PurchaseWidget
 */
interface PurchaseVariant {
    id: string;
    title: string;
    sku?: string | null;
    price: Pick<MoneyV2, 'amount' | 'currencyCode'>;
    availableForSale: boolean;
}

/**
 * Props for the PurchaseWidget component
 */
interface PurchaseWidgetProps {
    product: {
        variants: {
            nodes: PurchaseVariant[];
        };
        vendor?: string | null;
    };
    selectedVariant: PurchaseVariant | null;
}

export function PurchaseWidget({ product, selectedVariant }: PurchaseWidgetProps) {
    const [purchaseType, setPurchaseType] = useState('subscription'); // 'subscription' or 'one-time'

    const variants = flattenConnection(product.variants);

    const isPRN = product.vendor?.toLowerCase().includes('prn');

    // Group variants by supply duration.
    const supplyOptions = variants.map((v: PurchaseVariant) => {
        const title = v.title.toLowerCase();
        let duration = 0;
        if (title.includes('1 month')) duration = 1;
        else if (title.includes('2 month')) duration = 2;
        else if (title.includes('3 month')) duration = 3;

        let count = 0;
        if (title.includes('270')) { count = 270; if (duration === 0) duration = 3; }
        else if (title.includes('180')) { count = 180; if (duration === 0) duration = 2; }
        else if (title.includes('90')) { count = 90; if (duration === 0) duration = 1; }

        return {
            id: v.id,
            duration: duration || 1,
            title: isPRN && duration > 0 ? `${duration} Month Supply` : v.title,
            subtitle: count > 0 ? `${count} Count` : (v.sku || ''),
            price: v.price,
            available: v.availableForSale
        };
    }).sort((a, b) => a.duration - b.duration);

    // Sync state with selectedVariant if it changes or on initial load
    const initialIndex = supplyOptions.findIndex(o => o.id === selectedVariant?.id);
    const [selectedSupply, setSelectedSupply] = useState(initialIndex !== -1 ? initialIndex : 0);

    useEffect(() => {
        const newIndex = supplyOptions.findIndex(o => o.id === selectedVariant?.id);
        if (newIndex !== -1) {
            setSelectedSupply(newIndex);
        }
    }, [selectedVariant?.id]);

    const currentVariant = supplyOptions[selectedSupply];
    const subscriptionPrice = {
        amount: (parseFloat(currentVariant.price.amount) * 0.95).toFixed(2),
        currencyCode: currentVariant.price.currencyCode
    };

    return (
        <div className="flex flex-col gap-8 mt-4">
            {/* Supply Selector */}
            <div className={clsx("grid gap-3", supplyOptions.length === 1 ? "grid-cols-1" : supplyOptions.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {supplyOptions.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedSupply(idx)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                            selectedSupply === idx
                                ? "border-besilos-navy bg-besilos-navy/5 shadow-md scale-[1.02]"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                        )}
                    >
                        <Text className="text-[10px] tracking-tighter font-bold text-besilos-navy mb-1">{option.title}</Text>
                        <Text size="fine" className="text-gray-400 mb-2">{option.subtitle}</Text>
                        <Text className="font-bold text-besilos-navy">
                            <Money data={option.price} withoutTrailingZeros />
                        </Text>
                    </button>
                ))}
            </div>

            {/* Purchase Type Toggle (Subscribe & Save Style) */}
            <div className="flex flex-col gap-3">
                {/* Subscription Row */}
                <div
                    onClick={() => setPurchaseType('subscription')}
                    className={clsx(
                        "relative flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        purchaseType === 'subscription'
                            ? "border-besilos-blue bg-besilos-blue/5 shadow-inner"
                            : "border-gray-100 bg-gray-50/30"
                    )}
                >
                    {purchaseType === 'subscription' && (
                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-yellow-400 text-besilos-navy text-[10px] font-bold px-3 py-1 rounded-full tracking-widest shadow-sm">
                            Save 5%
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            purchaseType === 'subscription' ? "border-besilos-blue bg-besilos-blue" : "border-gray-300"
                        )}>
                            {purchaseType === 'subscription' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-besilos-navy">Subscribe & Save!</span>
                            <span className="text-xs text-besilos-navy/60 font-medium">Free Shipping + Automatic Delivery</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <Money data={subscriptionPrice} className="text-lg font-bold text-besilos-navy" />
                        <Money data={currentVariant.price} className="text-xs text-gray-400 line-through block" />
                    </div>
                </div>

                {/* One-Time Row */}
                <div
                    onClick={() => setPurchaseType('one-time')}
                    className={clsx(
                        "flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        purchaseType === 'one-time'
                            ? "border-besilos-navy bg-besilos-navy/5 shadow-inner"
                            : "border-gray-100 bg-white"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            purchaseType === 'one-time' ? "border-besilos-navy bg-besilos-navy" : "border-gray-300"
                        )}>
                            {purchaseType === 'one-time' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                        <span className="font-bold text-besilos-navy">One-Time Purchase</span>
                    </div>
                    <Money data={currentVariant.price} className="text-lg font-bold text-besilos-navy" />
                </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col gap-4 mt-2">
                <AddToCartButton
                    lines={[{ merchandiseId: currentVariant.id, quantity: 1 }]}
                    className="w-full py-5 bg-besilos-navy text-white rounded-xl font-bold tracking-widest text-sm hover:bg-besilos-blue transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl"
                >
                    Add To Cart
                </AddToCartButton>

                <div className="flex justify-between items-center px-4">
                    <TrustItem icon="🚚" text="Free Shipping" />
                    <TrustItem icon="🛡️" text="Money Back" />
                    <TrustItem icon="✨" text="Expert Choice" />
                </div>
            </div>
        </div>
    );
}

function TrustItem({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-widest">
            <span>{icon}</span>
            <span>{text}</span>
        </div>
    );
}
