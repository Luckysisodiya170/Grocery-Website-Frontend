import { useState } from "react";
import RatingBreakdown from "./RatingBreakdown";
import ReviewList from "./ReviewList";
import "./ProductTabs.css";

function ProductTabs() {
  const [tab, setTab] = useState("reviews");

  return (
    <div className="product-tabs-wrapper">
      <div className="product-tabs container">

        {/* TAB HEADER */}
        <div className="tab-header">
          <button
            className={tab === "reviews" ? "active" : ""}
            onClick={() => setTab("reviews")}
          >
            Ratings & Reviews
          </button>
          <button
            className={tab === "desc" ? "active" : ""}
            onClick={() => setTab("desc")}
          >
            Product Description
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content" key={tab}>
          {tab === "reviews" && (
            <div className="reviews-layout">
              <RatingBreakdown />
              <ReviewList />
            </div>
          )}

          {tab === "desc" && (
            <p className="desc-text">
              High quality product guaranteed to deliver the best freshness. Carefully sourced and rigorously checked to ensure premium standards. Store in a cool, dry place to maintain optimal quality.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductTabs;