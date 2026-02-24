import { useRef } from "react";
import "./recommended.css";
import Card from "../Product/Productcard/Productcard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Recommended({ products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Calculates scroll amount based on screen size (responsive scrolling)
      const scrollAmount = window.innerWidth < 768 
        ? (direction === "left" ? -220 : 220) 
        : (direction === "left" ? -400 : 400);
        
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="recommended-spotlight">
      {/* Header inside the standard container */}
      <div className="container">
        <div className="editorial-header space-between">
          <div className="title-area">
            <span className="overline">Handpicked</span>
            <h2 className="section-title-elite">
              Recommended <span className="text-gradient">Selection</span>
            </h2>
          </div>
          
          {/* Functional Magnetic Control Buttons */}
          <div className="elite-controls">
            <button className="control-btn" onClick={() => scroll("left")} aria-label="Scroll Left">
              <ArrowBackIosNewIcon fontSize="small" />
            </button>
            <button className="control-btn" onClick={() => scroll("right")} aria-label="Scroll Right">
              <ArrowForwardIosIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      {/* The Full-Width Track Wrapper */}
      <div className="spotlight-full-wrapper">
        <div className="spotlight-track" ref={scrollRef}>
          {products.map((item) => (
            <div key={item.id} className="spotlight-item">
              <div className="badge-exclusive">Elite Choice</div>
              <Card product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Recommended;