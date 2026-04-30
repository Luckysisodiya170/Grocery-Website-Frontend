import RatingBreakdown from "./RatingBreakdown";
import ReviewList from "./ReviewList";

function ProductTabs({ product }) {
  const reviewsCount = product.reviews?.length || 0;

  return (
    <div className="w-full flex flex-col gap-12 mt-10">
      
   
      <section id="product-description" className="w-full">
        <h2 className="text-[24px] md:text-[28px] font-black text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border)]">
          Product Details
        </h2>

        <div className="flex flex-col gap-8">
          {/* Description */}
          <div>
            <h3 className="text-[18px] font-bold text-[var(--text-main)] mb-3">Description</h3>
            <p className="text-[15px] text-[var(--text-light)] leading-[1.8]">
              {product.description || "No description available for this product."}
            </p>
          </div>

          {/* Specification  */}
          {product.specification && (
            <div>
              <h3 className="text-[18px] font-bold text-[var(--text-main)] mb-3">Specification</h3>
              <p className="text-[15px] text-[var(--text-light)] leading-[1.8]">
                {product.specification}
              </p>
            </div>
          )}

          {/* Technical Details Table */}
          <div>
            <h3 className="text-[18px] font-bold text-[var(--text-main)] mb-4">Other Details</h3>
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
      </section>

     
      <section id="product-reviews" className="w-full pt-6">
        <h2 className="text-[24px] md:text-[28px] font-black text-[var(--text-main)] mb-8 pb-4 border-b border-[var(--border)] flex items-center gap-3">
          Ratings & Reviews 
          <span className="text-[16px] text-[var(--text-muted)] font-bold bg-[var(--bg-soft)] px-3 py-1 rounded-full">
            {reviewsCount}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[50px] items-start">
          {/* Left Side: Rating Summary */}
          <div className="sticky top-[100px]">
            <RatingBreakdown product={product} />
          </div>

          {/* Right Side: Individual Reviews List */}
          <div>
            <ReviewList product={product} />
          </div>
        </div>
      </section>

    </div>
  );
}

export default ProductTabs;