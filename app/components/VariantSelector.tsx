import { useEffect, useState } from 'react';

export type ProductVariant = {
    id: string;
    title: string;
    price: number;
    savings: number;
    sku: string;
    recommended?: boolean;
    image?: string;
};

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({
    variants,
    selectedVariant,
    onSelect,
}: VariantSelectorProps) {
    return (
        <div className="space-y-3">
            {variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                const isRecommended = variant.recommended;

                return (
                    <button
                        key={variant.id}
                        onClick={() => onSelect(variant)}
                        className={`w-full relative flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer
                            ${isSelected
                                ? 'bg-[#152c52] text-white shadow-lg'
                                : 'bg-slate-100 hover:bg-[#1e3a6e] hover:text-white'
                            }`}
                    >
                        {isRecommended && (
                            <div className={`absolute -top-3 right-4 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm
                                ${isSelected ? 'bg-white text-[#c00000]' : 'bg-[#c00000] text-white'}`}>
                                Recommended
                            </div>
                        )}

                        <div className="flex flex-col items-start">
                            <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-white'}`}>
                                {variant.title}
                            </span>
                            {variant.savings > 0 && (
                                <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-[#4A9F53]'}`}>
                                    Save ${variant.savings}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col items-end">
                            <span className={`font-bold text-xl ${isSelected ? 'text-white' : 'text-[#152c52]'}`}>
                                ${variant.price}
                            </span>
                            {variant.savings > 0 && (
                                <span className={`text-xs line-through ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                    ${(variant.price + variant.savings).toFixed(2)}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

