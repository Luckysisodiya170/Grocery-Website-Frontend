import { useParams, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import products from "../../../data/products.json";
import ProductGallery from "../ProductGallery";
import ProductInfo from "../ProductInfo";
import ProductTabs from "../ProductTabs";
import "./ProductDetails.css";
import SimilarProducts from "../../SimilarProduct/SimilarProducts";
import { useCart } from "../../../pages/cart/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const infoRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);

  const product = products.find((item) => item.id === Number(id));

  useEffect(() => {
    const handleScroll = () => {
      if (!infoRef.current) return;
      const rect = infoRef.current.getBoundingClientRect();
      // Show sticky bar when the info section has scrolled fully above viewport
      setShowSticky(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) return <h2>Product not found</h2>;

  const handleStickyAdd = () => {
    addToCart({
      ...product,
      id: `${product.id}-1kg`,
      price: product.price,
      selectedWeight: "1kg",
      quantity: 1,
    });
  };

  return (
    <div className="product-page">

      <div className="product-container" ref={infoRef}>
        {/* LEFT → IMAGE */}
        <ProductGallery product={product} />

        {/* RIGHT → INFO */}
        <ProductInfo product={product} />
      </div>

      {/* BELOW → TABS + REVIEWS */}
      <ProductTabs product={product} />

      <SimilarProducts currentProduct={product} />

      {/* STICKY MOBILE ADD-TO-CART BAR */}
      {showSticky && (
        <div className="sticky-mobile-cart">
          <div className="sticky-product-info">
            <span className="sticky-name">{product.name}</span>
            <span className="sticky-price">₹{product.price}</span>
          </div>
          <button className="sticky-add-btn" onClick={handleStickyAdd}>
            🛒 Add to Cart
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
