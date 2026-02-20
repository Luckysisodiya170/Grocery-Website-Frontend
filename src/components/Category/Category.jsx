import { useRef } from "react";
import "./category.css";

function Category({ data = [], onSelect }) {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="category-section container">
      <div className="category-header">
        
        <div className="title-area">
          <h2 className="category-title">Category
            <span className="title-dot"></span>
          </h2>
        </div>

        <div className="category-actions">
          <span className="view-all-text">
            View all categories <span className="arrow-right">→</span>
          </span>
          
          
        </div>

      </div>

      <div className="category-scroll" ref={scrollRef}>
        {data.map((item) => (
          <div
            key={item.id}
            className="app-cat-item"
            onClick={() => onSelect?.(item)}
          >
            {/* Larger Squircle Icon Box */}
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