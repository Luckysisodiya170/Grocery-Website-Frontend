function RatingBreakdown({ product }) {
  const rating = parseFloat(product.avg_rating || 0).toFixed(1);
  const reviewsCount = product.reviews?.length || 0;

  const reviewCategories = [
    { label: "Excellent", stars: 5, count: 30, fill: "80%", color: "bg-green-500" },
    { label: "Very Good", stars: 4, count: 10, fill: "10%", color: "bg-emerald-400" },
    { label: "Good", stars: 3, count: 5, fill: "50%", color: "bg-yellow-400" },
    { label: "Average", stars: 2, count: 2, fill: "20%", color: "bg-orange-400" },
    { label: "Poor", stars: 1, count: 1, fill: "70%", color: "bg-red-500" }
  ];

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