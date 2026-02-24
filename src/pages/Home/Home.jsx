import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 1. Import useNavigate
import "./Home.css";
import app from "../../assets/screen/WhatsApp Image 2026-02-20 at 12.54.29 AM.jpeg"
import Card from "../../components/Product/Productcard/Productcard.jsx";
import products from "../../data/products.json";
import Category from "../../components/Category/Category.jsx";
import categories from "../../data/category.js";
import Recommended from "../../components/Recommendation/Recommended.jsx";

import beauty from "../../assets/bannerimages/beauty11.jpg";
import electronics from "../../assets/bannerimages/fashion4th.jpg";
import fashion from "../../assets/bannerimages/electro11.jpg";
import food from "../../assets/bannerimages/grocery11.jpg";
import toys from "../../assets/bannerimages/health11.jpg";

function Home() {
  const navigate = useNavigate(); // 👈 2. Initialize navigate
  const banners = [beauty, electronics, fashion, food, toys];
  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const recommendedItems = products.filter(p => p.rating >= 4.5).slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);   
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setVisibleCount(8);
    
    setTimeout(() => {
      document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 👈 3. THE MAGIC: Ab click karne par new page par jayega data ke sath!
// 👈 3. THE MAGIC: Ab click karne par new page par jayega data ke sath!
  const handleSubSelect = (sub) => {
    
    // 🔴 THE FIX: Force the browser window to scroll back to the very top 
    // smoothly BEFORE navigating to the new page.
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "instant" instead of smooth so they don't see the jump
    });

    navigate("/shop", {
      state: {
        selectedCategory: selectedCategory.name, // Parent Category ka naam (e.g. Grocery)
        selectedSub: sub                           // Subcategory ka naam (e.g. Fruits)
      }
    });
  };

  // Home page par ab sirf Main category ke products dikhenge
  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return true;
    return p.parentCategory === selectedCategory.name;
  });

  const displayProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  return (
    <div className="home cinematic-bg">
      {/* ================= HERO SLIDER ================= */}
      <section className="hero-elite container">
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
        {/* ================= CATEGORIES ================= */}
        <Category data={categories} onSelect={handleCategorySelect} />

       {/* ================= BENTO SUBCATEGORIES ================= */}
        {selectedCategory?.subcategories && (
          <section id="explore-section" className="subcategory-elite">
            <div className="editorial-header">
              <span className="overline">Discover</span>
              <h2 className="section-title-elite">Explore {selectedCategory.name}</h2>
            </div>

            <div className="bento-grid">
              {selectedCategory.subcategories.map((sub) => {
                const allSubProducts = products.filter((p) => p.category === sub);
                const totalCount = allSubProducts.length;
                
                if (totalCount === 0) return null; 

                const previewImages = allSubProducts.slice(0, 4); 

                return (
                  <div
                    key={sub}
                    className="bento-card"
                    onClick={() => handleSubSelect(sub)} // 👈 Click pe redirect
                  >
                    <div className="bento-header">
                      <span className="bento-title">{sub}</span>
                      <span className="bento-arrow">→</span>
                    </div>
                    <div className="bento-image-grid">
                      {previewImages.map((p, index) => {
                        const isMoreSlot = index === 3 && totalCount > 4;

                        return (
                          <div className={`bento-img-box ${isMoreSlot ? "more-box" : ""}`} key={p.id}>
                            <img src={`/product/${p.image}`} alt={p.name} />
                            {isMoreSlot && (
                              <div className="more-overlay">
                                <span>More Products</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= MAIN PRODUCT GRID (TRENDING) ================= */}
        <section id="products-section" className="glass-panel-heavy products-elite">
          <div className="editorial-header center">
            <span className="overline">Curated Collection</span>
            <h2 className="section-title-elite">{selectedCategory?.name || "Trending Selection"}</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state-box">
              <h3>No product found.</h3>
              <p>We couldn't find any items in this category right now.</p>
            </div>
          ) : (
            <>
              <div className="product-grid-elite">
                {displayProducts.map((item) => (
                  <Card key={item.id} product={item} />
                ))}
              </div>

              {hasMoreProducts && (
                <div className="load-more-container">
                  <button className="btn-load-more" onClick={() => setVisibleCount(prev => prev + 8)}>
                    Explore More ++
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ================= RECOMMENDED SECTION ================= */}
        <Recommended products={recommendedItems} />

        {/* ================= APP BANNER ================= */}
        <div className="app-image">
          <a href="https://play.google.com/store/apps" target="_blank" rel="noreferrer">
            <img src={app} alt="Download App" />
          </a>
        </div>

      </div>
    </div>
  );
}

export default Home;