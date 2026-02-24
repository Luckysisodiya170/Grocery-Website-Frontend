import { useParams } from "react-router-dom";
import products from "../../../data/products.json";
import ProductGallery from "../ProductGallery";
import ProductInfo from "../ProductInfo";
import ProductTabs from "../ProductTabs";
import "./ProductDetails.css";
import SimilarProducts from "../../SimilarProduct/SimilarProducts";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="product-page">

      <div className="product-container">

        {/* LEFT → IMAGE */}
        <ProductGallery product={product} />

        {/* RIGHT → INFO */}
        <ProductInfo product={product} />

      </div>


      {/* BELOW → TABS + REVIEWS */}
      <ProductTabs product={product} />

      <SimilarProducts currentProduct={product} />


    </div>
  );
}

export default ProductDetails;
