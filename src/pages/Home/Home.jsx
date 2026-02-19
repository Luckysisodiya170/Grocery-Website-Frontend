import { useState, useEffect } from "react";
import "./Home.css";

import Card from "../Productcard/Productcard.jsx";
import products from "../../data/products.json";
import Category from "../../components/Category/Category";
import categories from "../../data/category.js";
import Footer from "../../components/Footer/Footer.jsx";

import beauty from "../../assets/bannerimages/beauty11.jpg";
import electronics from "../../assets/bannerimages/fashion4th.jpg";
import fashion from "../../assets/bannerimages/electro11.jpg";
import food from "../../assets/bannerimages/grocery11.jpg";
import toys from "../../assets/bannerimages/health11.jpg";

function Home() {
  const banners = [beauty, electronics, fashion, food, toys];

  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  /* ---------------- CATEGORY CLICK ---------------- */
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSub(null);
  };

  /* ---------------- SUBCATEGORY CLICK ---------------- */
  const handleSubSelect = (sub) => {
    setSelectedSub(sub);
  };

  /* ---------------- FILTER PRODUCTS ---------------- */
  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return true;
    if (selectedCategory.name === "Grocery") {
      return !selectedSub || p.category === selectedSub;
    }
    return true;
  });

  return (
    <div className="home app-layout">

      {/* ===== CLEAN HERO SLIDER ===== */}
      <section className="hero-clean container">
        <div className="hero-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((img, index) => (
            <img key={index} src={img} alt="Promo Banner" className="hero-image" />
          ))}
        </div>

        <button className="nav-arrow left" onClick={prevSlide}>‹</button>
        <button className="nav-arrow right" onClick={nextSlide}>›</button>

        <div className="slider-pagination">
          {banners.map((_, i) => (
            <span key={i} className={`page-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      </section>

      {/* ===== CATEGORY ===== */}
      <Category data={categories} onSelect={handleCategorySelect} />

    {/* ===== SUBCATEGORY (Visual Bento Cards) ===== */}
      {selectedCategory?.subcategories && (
        <section className="subcategory-bento container">
          <div className="section-header">
            <h2>Explore {selectedCategory.name}</h2>
          </div>

          <div className="bento-grid">
            {selectedCategory.subcategories.map((sub) => {
              // Automatically grab up to 4 products that match this subcategory
              const previewImages = products
                .filter((p) => p.category === sub)
                .slice(0, 4);

              return (
                <div
                  key={sub}
                  className={`bento-card ${selectedSub === sub ? "active" : ""}`}
                  onClick={() => handleSubSelect(sub)}
                >
                  <div className="bento-header">
                    <span className="bento-title">{sub}</span>
                    <span className="bento-arrow">→</span>
                  </div>

                  <div className="bento-image-grid">
                    {previewImages.length > 0 ? (
                      previewImages.map((p) => (
                        <div className="bento-img-box" key={p.id}>
                          <img src={`/product/${p.image}`} alt={p.name} />
                        </div>
                      ))
                    ) : (
                      <div className="bento-empty">More items coming soon</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* ===== PRODUCTS ===== */}
      <section className="products-clean container">
        <div className="section-header">
          <h2>{selectedSub || "Trending Now"}</h2>
        </div>

        <div className="product-grid-clean">
          {filteredProducts.map((item) => (
            <Card key={item.id} product={item} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;