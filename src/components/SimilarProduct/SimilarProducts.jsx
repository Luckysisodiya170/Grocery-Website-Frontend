import "./SimilarProducts.css";
import Card from "../../pages/Productcard/Productcard";
import products from "../../data/products.json";

function SimilarProducts({ currentProduct }) {

  // filter similar products by category
  const similarItems = products
    .filter(
      (p) =>
        p.category === currentProduct.category &&
        p.id !== currentProduct.id
    )
    .slice(0, 6);

  if (similarItems.length === 0) return null;

  return (
    <section className="similar-section">
      <div className="similar-header">
        <h2>Similar Products</h2>
      </div>

      <div className="similar-grid">
        {similarItems.map((item) => (
          <Card key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

export default SimilarProducts;
