import React from 'react';
import Card from '../../components/Product/Productcard/Productcard'; // Ensure path is correct
import { useWishlist } from './WishlistContext';
import "./wishlist.css";

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page container">
      <h1 className="wishlist-title">My Wishlist</h1>
      
      {wishlist && wishlist.length > 0 ? (
        <div className="product-grid-elite">
          {wishlist.map((item) => (
            <Card 
              key={item.id} // 👈 Fixes the "unique key" error
              product={item} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-wishlist-box glass-panel">
          <h3>Your wishlist is empty</h3>
          <p>Go back to the shop to add some favorites!</p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;