import { useState, useEffect } from "react";
import "./Home.css"; // Ensure all your CSS is combined here
import app from "../../assets/screen/WhatsApp Image 2026-02-20 at 12.54.29 AM.jpeg"
import Card from "../Productcard/Productcard.jsx";
import products from "../../data/products.json";
import Category from "../../components/Category/Category";
import categories from "../../data/category.js";
import Recommended from "./Recommended.jsx";
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
  const recommendedItems = products.filter(p => p.rating >= 4.5).slice(0, 8);
  // Auto-Slide Logic for the Cinematic Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds to match fillProgress animation
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSub(null);
    // Smooth scroll to results
    document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return true;
    if (!selectedSub) return p.parentCategory === selectedCategory.name; // Adjust based on your JSON structure
    return p.category === selectedSub;
  });

  return (
    <div className="home cinematic-bg">
      {/* ===== CINEMATIC HERO SLIDER ===== */}
      <section className="hero-elite">
        <div className="hero-slider">
          {banners.map((img, index) => (
            <div
              key={index}
              className={`hero-slide-wrapper ${index === current ? "active" : ""}`}
              style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
            >
              <img src={img} alt="Banner" className="hero-slide-img" />
              <div className="hero-vignette"></div>
            </div>
          ))}
          <div className="elite-slider-dots">
            {banners.map((_, i) => (
              <div key={i} className={`elite-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)}>
                {i === current && <div className="dot-progress"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* ===== CATEGORY SELECTION ===== */}
        <Category data={categories} onSelect={handleCategorySelect} />

        {/* ===== BENTO SUBCATEGORIES ===== */}
        {selectedCategory?.subcategories && (
          <section id="explore-section" className="subcategory-elite">
            <div className="editorial-header">
              <span className="overline">Discover</span>
              <h2 className="section-title-elite">Explore {selectedCategory.name}</h2>
            </div>

            <div className="bento-grid">
              {selectedCategory.subcategories.map((sub) => {
                const previewImages = products.filter((p) => p.category === sub).slice(0, 4);
                return (
                  <div
                    key={sub}
                    className={`bento-card ${selectedSub === sub ? "active" : ""}`}
                    onClick={() => {
                      setSelectedSub(sub);

                      // scroll to products
                      setTimeout(() => {
                        document
                          .getElementById("products-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    <div className="bento-header">
                      <span className="bento-title">{sub}</span>
                      <span className="bento-arrow">→</span>
                    </div>
                    <div className="bento-image-grid">
                      {previewImages.map((p) => (
                        <div className="bento-img-box" key={p.id}>
                          <img src={`/product/${p.image}`} alt={p.name} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== GLASS PRODUCTS PANEL ===== */}
        <section id="products-section" className="glass-panel-heavy products-elite">
          <div className="editorial-header center">
            <span className="overline">Curated Collection</span>
            <h2 className="section-title-elite">{selectedSub || "Trending Selection"}</h2>
          </div>

          <div className="product-grid-elite">
            {filteredProducts.map((item) => (
              <Card key={item.id} product={item} />

            ))}

          </div>

        </section>
        <div className="app-image">
          <img src={app} alt="" href="https://play.google.com/store/games?hl=en_IN" />
        </div>
        <Recommended products={recommendedItems} />
      </div>
    </div>
  );
}

export default Home;