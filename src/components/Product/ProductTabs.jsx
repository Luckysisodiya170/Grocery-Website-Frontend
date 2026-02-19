import { useState } from "react";
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
            Rating & Reviews
          </button>

          <button
            className={tab === "desc" ? "active" : ""}
            onClick={() => setTab("desc")}
          >
            Description
          </button>
        </div>

        {tab === "reviews" && (
          <div className="reviews-layout">

            {/* LEFT → SUMMARY */}
            <div className="rating-summary">

              <h2>4.5</h2>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>(245 reviews)</p>

            </div>

            {/* RIGHT → BARS */}
            <div className="rating-bars">

              {[
                { star: 5, percent: 80 },
                { star: 4, percent: 60 },
                { star: 3, percent: 30 },
                { star: 2, percent: 15 },
                { star: 1, percent: 5 }
              ].map((r) => (
                <div key={r.star} className="rating-row">
                  <span>{r.star}★</span>

                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

        {/* REVIEW LIST */}
        {tab === "reviews" && (
          <div className="review-list">

            <h3>Review this product</h3>
            <button className="write-review">
              Write a customer review
            </button>

            <div className="review-item">
              <strong>Rahul</strong>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>Very fresh product.</p>
            </div>

            <div className="review-item">
              <strong>Amit</strong>
              <p className="stars">⭐⭐⭐⭐</p>
              <p>Good quality.</p>
            </div>

          </div>
        )}

        {tab === "desc" && (
          <p className="desc-text">
            High quality product with best freshness.
          </p>
        )}

      </div>
    </div>
  );
}

export default ProductTabs;
