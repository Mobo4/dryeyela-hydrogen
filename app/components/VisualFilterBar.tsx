import { Link, useSearchParams } from '@remix-run/react';
import clsx from 'clsx';
import { IconCheck } from '~/components/Icon';

const SYMPTOM_FILTERS = [
    { label: 'Red Eyes', id: 'red-eyes', icon: '🔴' },
    { label: 'Itchy Eyes', id: 'itchy-eyes', icon: '🌿' },
    { label: 'Watery Eyes', id: 'watery-eyes', icon: '💧' },
    { label: 'Fatigue', id: 'eye-fatigue', icon: '💤' },
    { label: 'Dryness', id: 'severe-dry-eye', icon: '🌵' },
    { label: 'MGD', id: 'mgd', icon: '👁️' },
];

export function VisualFilterBar() {
    const [params] = useSearchParams();

    return (
        <div className="w-full py-8 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max px-4 md:justify-center">
                {SYMPTOM_FILTERS.map((filter) => {
                    const isActive = params.get('filter.tags')?.includes(filter.label); // Simplified logic

                    // Construct URLSearchParams
                    const newParams = new URLSearchParams(params);
                    if (isActive) {
                        newParams.delete('filter.tags');
                        // Ideally we'd remove just this tag, but for MVP this toggles off
                    } else {
                        newParams.set('filter.tags', `"${filter.label}"`); // Shopify API format
                    }

                    return (
                        <Link
                            key={filter.id}
                            to={`?${newParams.toString()}`}
                            className={clsx(
                                "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border min-w-[100px] group cursor-pointer",
                                isActive
                                    ? "bg-besilos-navy text-white border-besilos-navy shadow-md scale-105"
                                    : "bg-white text-besilos-navy border-besilos-sage/20 hover:border-besilos-sage hover:shadow-sm hover:-translate-y-1"
                            )}
                        >
                            <div className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors",
                                isActive ? "bg-white/10" : "bg-besilos-cream/50 group-hover:bg-besilos-cream"
                            )}>
                                {filter.icon}
                            </div>
                            <span className="text-sm font-medium tracking-wide">{filter.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
