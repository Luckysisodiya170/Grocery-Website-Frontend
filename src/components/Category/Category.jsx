import { useRef, useEffect } from "react";
import "./category.css";
import { useNavigate } from "react-router-dom";

function Category({ data = [], onSelect }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); 

  // 🌟 Auto-Scroll Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1; // 1px per interval (Speed adjust kar sakti hain)
          
          // Agar scroll end tak pohoch jaye, toh wapas start par aa jaye (Infinite loop effect)
          if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
             scrollContainer.scrollLeft = 0;
          }
        }
      }, 20); // 20ms delay (Number kam karne se speed badhegi)
    };

    startScrolling();

    // Hover karne par scroll rokne ke liye
    if (scrollContainer) {
      scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
      scrollContainer.addEventListener('mouseleave', startScrolling);
    }

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: "instant" }); 
    navigate("/shop");
  };

 // 🌟 Auto-Scroll Alternate (Ping-Pong) Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollInterval;
    let direction = 1; // 1 matlab Right ja raha hai, -1 matlab Left aayega

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += direction; 

          // Agar right end tak pohoch jaye, toh direction ulta (-1) kardo
          if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth - 1)) {
             direction = -1;
          }
          // Agar left end (shuruwaat) par wapas aa jaye, toh direction seedha (1) kardo
          else if (scrollContainer.scrollLeft <= 0) {
             direction = 1;
          }
        }
      }, 20); // 20ms delay (Speed adjust karne ke liye)
    };

    startScrolling();

    // Hover karne par scroll rokne ke liye
    if (scrollContainer) {
      scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
      scrollContainer.addEventListener('mouseleave', startScrolling);
    }

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

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
        {data.map((item) => (
          <div
            key={item.id}
            className="app-cat-item"
            onClick={() => handleCategoryClick(item)} // Redirect added here
          >
            <div className="app-cat-img-box">
              <img
                src={`/category/${item.image}`}
                alt={item.name}
                className="app-cat-img"
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