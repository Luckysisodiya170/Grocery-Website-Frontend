import { useState } from "react";
import { toast } from "react-toastify";

function ProductInfo({ product, requireLogin }) {
  const [cartQty, setCartQty] = useState(0);

  const currentPrice = parseFloat(product.offer_price || 0).toLocaleString('en-IN');
  const mrp = parseFloat(product.mrp || 0).toLocaleString('en-IN');
  const ratingNum = parseFloat(product.avg_rating || 0);
  const rating = ratingNum.toFixed(1);
  const reviewsCount = product.reviews?.length || 0;
  const isAvailable = parseInt(product.stock_available || 0) > 0;
  const discountNum = parseFloat(product.discount_percentage || 0);

  const ratingColor = ratingNum >= 4 ? 'var(--success)' : ratingNum >= 2.5 ? 'var(--warning)' : 'var(--danger)';

  const handleAddToCart = () => {
    if (!requireLogin()) return; 
    setCartQty(1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleIncrease = () => {
    setCartQty(prev => prev + 1);
  };

  const handleDecrease = () => {
    setCartQty(prev => prev - 1);
  };

  const handleBuyNow = () => {
    if (!requireLogin()) return;
  };

  return (
    <div className="flex flex-col">
      <div className="text-[11px] font-black uppercase tracking-wider mb-3 flex items-center gap-2 flex-wrap">
        <span className="bg-[var(--primary)] text-[var(--secondary)] px-2.5 py-1 rounded shadow-sm">
          {product.category_name}
        </span> 
        {product.subcategory_name && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]"></span>
            <span className="bg-[var(--bg-soft)] text-[var(--primary)] px-2.5 py-1 rounded shadow-sm border border-[var(--border)]">
              {product.subcategory_name}
            </span>
          </>
        )}
      </div>
      
      <h1 className="text-[26px] md:text-[30px] font-black text-[var(--text-main)] mb-1.5 leading-snug capitalize">
        {product.name}
      </h1>

      {product.company_name && (
        <p className="text-[13px] font-medium text-[var(--text-muted)] mb-4">
          Sold by: <span className="text-[var(--text-main)] font-bold">{product.company_name}</span>
        </p>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-[var(--bg)] shadow-sm"
          style={{ borderColor: ratingColor, color: ratingColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg>
          <span className="font-black text-[14px]">{rating}</span>
        </div>
        <span className="text-[13px] font-bold text-[var(--text-light)]">
          ({reviewsCount} reviews)
        </span>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className="text-[34px] font-black text-[var(--text-main)] leading-none">
          ₹{currentPrice}
        </span>
        {product.mrp && (
          <span className="text-[16px] text-[var(--text-muted)] line-through font-semibold mb-1">
            ₹{mrp}
          </span>
        )}
        {discountNum > 0 && (
          <span className="bg-[var(--success)] text-[var(--secondary)] px-2.5 py-1 rounded text-[11px] font-black mb-1.5 tracking-wide shadow-sm">
            {discountNum.toFixed(0)}% OFF
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-black uppercase tracking-wider border w-fit ${isAvailable ? 'bg-emerald-50 text-[var(--success)] border-emerald-200' : 'bg-red-50 text-[var(--danger)] border-red-200'}`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></span>
          {isAvailable ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <p className="text-[14px] text-[var(--text-light)] leading-relaxed mb-6 font-medium">
        {product.description}
      </p>

      {product.variant_name && (
        <div className="mb-6">
          <p className="text-[12px] font-bold mb-2 text-[var(--text-main)] uppercase tracking-wider">Variant</p>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--secondary)] font-black text-[14px] cursor-default shadow-[var(--shadow-sm)] border-none tracking-wide">
              {product.variant_name} {product.unit !== "piece" ? product.unit : ""}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-[var(--border)]">
        
        {cartQty > 0 ? (
          <div className="flex-[0.8] flex items-center justify-between p-1.5 rounded-xl border border-[var(--primary)] bg-[var(--bg)] shadow-sm">
            <button 
              onClick={handleDecrease}
              className="w-10 h-10 flex items-center justify-center text-[var(--primary)] font-black text-xl hover:bg-[var(--bg-soft)] rounded-lg transition-colors"
            >
              -
            </button>
            <span className="font-bold text-lg text-[var(--primary)] w-8 text-center">{cartQty}</span>
            <button 
              onClick={handleIncrease}
              className="w-10 h-10 flex items-center justify-center text-[var(--primary)] font-black text-xl hover:bg-[var(--bg-soft)] rounded-lg transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            className="flex-1 py-3.5 px-4 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--secondary)] font-black text-[14px] uppercase tracking-wider cursor-pointer transition-all duration-250 hover:bg-[var(--primary)] hover:text-[var(--secondary)] hover:shadow-[var(--shadow-sm)] disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            {isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
        )}

        <button 
          className="flex-1 py-3.5 px-4 rounded-xl border-none bg-[var(--primary)] text-[var(--secondary)] font-black text-[14px] uppercase tracking-wider cursor-pointer transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" 
          onClick={handleBuyNow}
          disabled={!isAvailable}
        >
          Buy Now
        </button>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-[12px] text-[var(--text-main)] font-semibold flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--primary)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        Dispatch in {product.return_days || 1-2} days
        {product.return_allowed === 1 && (
          <>
            <span className="w-1 h-1 rounded-full bg-[var(--border)] mx-0.5"></span>
            Easy Returns
          </>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;