import React from "react";

function RatingBreakdown({ product }) {
  const rating = parseFloat(product.avg_rating || 0).toFixed(1);
  const reviews = product.reviews || [];
  const reviewsCount = reviews.length;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    if (review.rating && starCounts[review.rating] !== undefined) {
      starCounts[review.rating] += 1;
    }
  });

  const reviewCategories = [
    { label: "Excellent", stars: 5, color: "bg-green-500" },
    { label: "Very Good", stars: 4, color: "bg-emerald-400" },
    { label: "Good", stars: 3, color: "bg-yellow-400" },
    { label: "Average", stars: 2, color: "bg-orange-400" },
    { label: "Poor", stars: 1, color: "bg-red-500" }
  ].map(cat => {
    const count = starCounts[cat.stars];
    const fill = reviewsCount > 0 ? `${(count / reviewsCount) * 100}%` : "0%";
    return { ...cat, count, fill };
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h2 className="text-[54px] font-black text-[var(--text-main)] leading-none">
          {rating}
        </h2>
        <div className="text-[var(--warning)] text-[22px] my-2 tracking-[4px]">
          ★★★★★
        </div>
        <p className="text-[var(--text-muted)] text-[14px] font-medium mt-1">
          Based on {reviewsCount} reviews
        </p>
      </div>

      <div className="flex flex-col gap-3.5 border-t border-[var(--border)] pt-6">
        {reviewCategories.map((item) => (
          <div key={item.stars} className="flex items-center gap-4 group">
            
            <div className="w-[85px]">
              <span className="text-[14px] font-bold text-[var(--text-main)]">
                {item.label}
              </span>
            </div>
            
            <div className="flex-1 h-2 bg-[var(--bg-soft)] rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: item.fill }}
              />
            </div>

            <span className="w-6 text-right text-[13px] font-bold text-[var(--text-muted)]">
              {item.count}
            </span>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingBreakdown;