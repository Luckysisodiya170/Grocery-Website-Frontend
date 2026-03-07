import { useState, useEffect } from "react";

function ProductGallery({ product }) {
  const [active, setActive] = useState(product.image);
  const [animating, setAnimating] = useState(false);

  // Update active image if the product changes
  useEffect(() => {
    setActive(product.image);
  }, [product.image]);

  const handleThumbClick = (img) => {
    if (img === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(img);
      setAnimating(false);
    }, 220);
  };

  const imgSrc = (img) =>
    img.startsWith("http") ? img : `/product/${img}`;

  // Build a simple set of thumbs (up to 4 views of same image if no gallery array)
  const thumbs = product.images
    ? product.images
    : [product.image, product.image, product.image];

  return (
    <div className="product-gallery">
      <div className="main-image">
        <img
          src={imgSrc(active)}
          alt={product.name}
          className={animating ? "img-fade" : ""}
        />
      </div>

      <div className="thumbs">
        {thumbs.map((img, i) => (
          <img
            key={i}
            src={imgSrc(img)}
            onClick={() => handleThumbClick(img)}
            alt={`thumbnail ${i + 1}`}
            className={active === img ? "active-thumb" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;