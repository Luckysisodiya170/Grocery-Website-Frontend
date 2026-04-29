import { useState } from "react";
import Card from "../Product/Productcard/Productcard";

function SimilarProducts({ currentProduct }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const similarItems = currentProduct?.similar_products || [];
  const displayItems = similarItems.slice(0, visibleCount); 

  if (similarItems.length === 0) {
    return (
      <section className="w-full mt-10 p-5 md:p-[30px] bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
        <div className="mb-5">
          <h2 className="text-[18px] md:text-[22px] font-extrabold text-[var(--text-main)]">Similar Products</h2>
        </div>
        <div className="text-center py-12 bg-[var(--bg-soft)] rounded-lg border border-dashed border-[var(--border)]">
          <h3 className="text-lg font-bold text-[var(--text-main)]">No product found.</h3>
          <p className="text-[var(--text-muted)] mt-2">We couldn't find any similar items right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-10 p-5 md:p-[30px] bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
      <div className="mb-5">
        <h2 className="text-[18px] md:text-[22px] font-extrabold text-[var(--text-main)]">Similar Products</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[15px] md:gap-5">
        {displayItems.map((item) => (
          <Card key={item.id} product={item} />
        ))}
      </div>

      {visibleCount < similarItems.length && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-6 py-2.5 font-bold text-[var(--primary)] bg-transparent border-2 border-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-300"
          >
            More Products ++
          </button>
        </div>
      )}
    </section>
  );
}

export default SimilarProducts;