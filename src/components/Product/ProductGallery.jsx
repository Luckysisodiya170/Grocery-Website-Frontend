import { useState } from "react";

function ProductGallery({ product }) {
  const [active, setActive] = useState(product.image);

  return (
    <div className="product-gallery">

      <div className="main-image">
        <img src={`/product/${active}`} alt="" />
      </div>

      <div className="thumbs">
        {[1,2,3].map((_, i) => (
          <img
            key={i}
            src={`/product/${product.image}`}
            onClick={() => setActive(product.image)}
            alt=""
          />
        ))}
      </div>

    </div>
  );
}

export default ProductGallery;
