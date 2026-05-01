import { useState } from "react";

function ReviewList({ product }) {
  const reviews = product.reviews || [];
  const [selectedImage, setSelectedImage] = useState(null);

  const renderStars = (rating) => {
    const filled = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return filled + empty;
  };

  const getReviewerName = (name) => {
    if (!name || name.trim() === "" || name.toLowerCase() === "anonymous") {
      return "Shipzy User";
    }
    return name;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
        <h3 className="text-[20px] font-bold text-[var(--text-main)]">
          Customer Reviews
        </h3>
        {/* <button 
          className="py-2.5 px-5 bg-[var(--primary)] text-[var(--secondary)] border-none rounded-lg font-bold cursor-pointer transition-transform hover:-translate-y-0.5 shadow-[var(--shadow-sm)] text-sm"
        >        
          Write a Review
        </button> */}
      </div>

      <div className="flex flex-col">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className="py-6 border-b border-[var(--border)] last:border-none flex flex-col" key={review.id || index}>
              
              <div className="flex items-center justify-between mb-2">
                <strong className="text-[16px] text-[var(--text-main)] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-soft)] text-[var(--primary)] flex items-center justify-center font-black text-sm uppercase">
                    {getReviewerName(review.review_given_by).charAt(0)}
                  </div>
                  {getReviewerName(review.review_given_by)}
                </strong>
                {review.created_at && (
                  <span className="text-[12px] text-[var(--text-muted)] font-medium">
                    {review.created_at}
                  </span>
                )}
              </div>
              
              <p className="text-[var(--warning)] my-1 tracking-[2px] text-[16px]">
                {renderStars(review.rating || 5)}
              </p>
              
              <p className="text-[15px] text-[var(--text-light)] leading-[1.7] mt-2">
                {review.review}
              </p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {review.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="review" 
                      onClick={() => setSelectedImage(img)}
                      className="w-[80px] h-[80px] rounded-lg object-cover border border-[var(--border)] shadow-sm hover:scale-105 transition-transform cursor-pointer" 
                    />
                  ))}
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-soft)]">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm text-[var(--text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <p className="text-[var(--text-main)] font-bold text-lg">No reviews yet</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Be the first to review this product.</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-[var(--danger)] transition-colors w-10 h-10 flex items-center justify-center bg-white/10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <img 
            src={selectedImage} 
            alt="Review enlarged" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewList;