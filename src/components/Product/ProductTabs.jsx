import { useState } from "react";
import RatingBreakdown from "./RatingBreakdown";
import ReviewList from "./ReviewList";

function ProductTabs({ product }) {
  const [tab, setTab] = useState("desc");
  const reviewsCount = product.reviews?.length || 0;

  return (
    <div className="w-full">
      <div className="flex gap-5 md:gap-9 border-b border-[var(--border)] mb-8 flex-wrap">
        <button
          className={`bg-transparent border-none py-3.5 text-sm md:text-base font-bold cursor-pointer relative transition-colors duration-200 ${tab === "desc" ? "text-[var(--text-main)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[3px] after:bg-[var(--primary)] after:rounded-[3px]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}
          onClick={() => setTab("desc")}
        >
          Product Description
        </button>
        <button
          className={`bg-transparent border-none py-3.5 text-sm md:text-base font-bold cursor-pointer relative transition-colors duration-200 ${tab === "reviews" ? "text-[var(--text-main)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[3px] after:bg-[var(--primary)] after:rounded-[3px]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}
          onClick={() => setTab("reviews")}
        >
          Ratings & Reviews ({reviewsCount})
        </button>
      </div>

      <div className="animate-[fadeTab_.25s_ease]">
        {tab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[50px]">
            <RatingBreakdown product={product} />
            <ReviewList product={product} />
          </div>
        )}

        {tab === "desc" && (
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Description</h3>
              <p className="text-[15px] text-[var(--text-light)] leading-[1.8]">
                {product.description}
              </p>
            </div>

            {product.specification && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">Specification</h3>
                <p className="text-[15px] text-[var(--text-light)] leading-[1.8]">
                  {product.specification}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-4">Product Details</h3>
              <div className="overflow-hidden border border-[var(--border)] rounded-xl">
                <table className="w-full text-left text-[15px]">
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr className="bg-[var(--bg-soft)]">
                      <th className="px-5 py-3.5 font-semibold text-[var(--text-main)] w-1/3 border-r border-[var(--border)]">Category</th>
                      <td className="px-5 py-3.5 bg-[var(--bg)] text-[var(--text-light)]">{product.category_name || "N/A"}</td>
                    </tr>
                    <tr className="bg-[var(--bg-soft)]">
                      <th className="px-5 py-3.5 font-semibold text-[var(--text-main)] w-1/3 border-r border-[var(--border)]">Subcategory</th>
                      <td className="px-5 py-3.5 bg-[var(--bg)] text-[var(--text-light)]">{product.subcategory_name || "N/A"}</td>
                    </tr>
                    <tr className="bg-[var(--bg-soft)]">
                      <th className="px-5 py-3.5 font-semibold text-[var(--text-main)] w-1/3 border-r border-[var(--border)]">Made In</th>
                      <td className="px-5 py-3.5 bg-[var(--bg)] text-[var(--text-light)] capitalize">{product.made_in || "N/A"}</td>
                    </tr>
                    <tr className="bg-[var(--bg-soft)]">
                      <th className="px-5 py-3.5 font-semibold text-[var(--text-main)] w-1/3 border-r border-[var(--border)]">Unit</th>
                      <td className="px-5 py-3.5 bg-[var(--bg)] text-[var(--text-light)] capitalize">{product.unit || "N/A"}</td>
                    </tr>
                    <tr className="bg-[var(--bg-soft)]">
                      <th className="px-5 py-3.5 font-semibold text-[var(--text-main)] w-1/3 border-r border-[var(--border)]">Return Policy</th>
                      <td className="px-5 py-3.5 bg-[var(--bg)] text-[var(--text-light)]">
                        {product.return_allowed === 1 ? `${product.return_days} Days Returnable` : "Non-Returnable"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;