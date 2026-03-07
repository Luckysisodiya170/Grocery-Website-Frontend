import { useRef, useEffect } from "react";
import "./category.css";
import { useNavigate } from "react-router-dom";

function Category({ data = [], onSelect }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); 

  // 🌟 MAGIC TRICK: Array ko duplicate kiya taaki loop kabhi khatam na ho
  const infiniteData = [...data, ...data]; 

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1; // 1px speed
          
          // Seamless Loop Logic: Jaise hi scroll half width par pahuchega (jahan original array khatam hoti hai),
          // Ise chupke se 0 par wapas bhej denge. Duplicate hone ki wajah se user ko pata hi nahi chalega!
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
             scrollContainer.scrollLeft = 0;
          }
        }
      }, 20); 
    };

    startScrolling();

    // Hover karne par scroll rokne ke liye
    if (scrollContainer) {
      scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
      scrollContainer.addEventListener('mouseleave', startScrolling);
    }

    return () => clearInterval(scrollInterval);
  }, []);

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: "instant" }); 
    navigate("/shop");
  };

  // 🛠️ FIX: Missing function added
  const handleCategoryClick = (item) => {
    if (onSelect) {
      onSelect(item.name);
    }
  };

  return (
    <section className="category-section container">
      <div className="category-header">
        <div className="title-area">
          <h2 className="category-title">Categories
            <span className="title-dot">.</span>
          </h2>
        </div>
        <div className="category-actions">
          <span className="view-all-text" onClick={handleViewAll}>
            View all categories <span className="arrow-right">→</span>
          </span>
        </div>
      </div>

      <div className="category-scroll" ref={scrollRef}>
        {infiniteData.map((item, index) => (
          <div
            // Key mein index lagaya taaki duplicate items par React error na de
            key={`${item.id}-${index}`} 
            className="app-cat-item"
            onClick={() => handleCategoryClick(item)} 
          >
            <div className="app-cat-img-box">
              <img
                src={`/category/${item.image}`}
                alt={item.name}
                className="app-cat-img"
                loading="lazy"
              />
            </div>
            <span className="app-cat-title">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Category;