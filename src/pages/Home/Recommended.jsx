import { useRef } from "react";
import "./recommended.css";
import Card from "../Productcard/Productcard.jsx";

function Recommended({ products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;

  return (
   <section className="recommended-spotlight">
  {/* The Header stays inside the standard container */}
  <div className="container">
    <div className="editorial-header space-between">
      <div className="title-area">
        <span className="overline">Handpicked</span>
        <h2 className="section-title-elite">Recommended <span className="text-gradient">Selection</span></h2>
      </div>
      <div className="elite-controls">
         {/* ... buttons ... */}
      </div>
    </div>
  </div>

  {/* The Track goes full width */}
  <div className="spotlight-full-wrapper">
    <div className="spotlight-track" ref={scrollRef}>
      {products.map((item) => (
        <div key={item.id} className="spotlight-item">
          <Card product={item} />
          <div className="badge-exclusive">Elite Choice</div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}

export default Recommended;