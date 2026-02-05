import { type ProductReview } from '~/data/prn-products';

interface ReviewsSectionProps {
    reviews: ProductReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
    if (!reviews || reviews.length === 0) return null;

    const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

    return (
        <section className="bg-white py-16 px-4 border-t border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#152c52] mb-4">
                        Customer Reviews
                    </h2>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-2xl">
                                    {star <= Math.round(averageRating) ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className="text-slate-600 font-medium">
                            ({reviews.length} reviews)
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm"
                        >
                            <div className="flex text-yellow-400 mb-3 text-sm">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                                ))}
                            </div>
                            <h3 className="font-bold text-[#152c52] mb-2">{review.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                "{review.text}"
                            </p>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span className="font-semibold text-slate-500">
                                    {review.author}
                                </span>
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
