import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth } from "../../../context/AuthContext";

import { useCart } from "../../../pages/cart/CartContext";
import { useWishlist } from "../../../pages/wishlist/WishlistContext";

const Card = ({ product }) => {

const navigate = useNavigate();
const { user } = useAuth();

const { cart, addToCart, removeFromCart } = useCart();
const cartItem = cart.find((item) => item.id === product.id);
const quantity = cartItem ? cartItem.quantity : 0;

const { toggleWishlist, isProductLiked } = useWishlist();
const liked = isProductLiked(product.id);

const [selectedSize,setSelectedSize] = useState(product?.sizes?.[0] || null);
const [selectedColor,setSelectedColor] = useState(product?.colors?.[0] || null);

const requireLogin = () => {
if(!user){
navigate("/login");
return false;
}
return true;
};

const handleInitialAdd = (e)=>{
e.stopPropagation();
if(!requireLogin()) return;

const productToAdd = {
...product,
selectedSize,
selectedColor
};

addToCart(productToAdd);
};

const handleIncrement = (e)=>{
e.stopPropagation();
if(!requireLogin()) return;
addToCart(product);
};

const handleDecrement = (e)=>{
e.stopPropagation();
if(!requireLogin()) return;
removeFromCart(product.id);
};

const handleToggleLike = (e)=>{
e.stopPropagation();
if(!requireLogin()) return;
toggleWishlist(product);
};

const handleBuyNow = (e)=>{
e.stopPropagation();
};

const goToProduct = ()=>{
window.scrollTo({top:0,behavior:"instant"});
navigate(`/product/${product.id}`);
};

const renderStars = (rating)=>{
const stars=[];
for(let i=1;i<=5;i++){
stars.push(
<span key={i} className={i<=rating?"star filled":"star"}>★</span>
);
}
return stars;
};

return(

<StyledWrapper>

<div className="card">

<button className="wishlist-btn" onClick={handleToggleLike}>
{liked ? (
<FavoriteIcon style={{color:"#f24c4c",fontSize:"18px"}}/>
):(
<FavoriteBorderIcon style={{color:"#ed3c42",fontSize:"18px"}}/>
)}
</button>

{product.discount && (
<span className="discount">{product.discount} OFF</span>
)}

<div className="image-box" onClick={goToProduct}>
<img
src={product?.image ? (product.image.startsWith("http") ? product.image : `/product/${product.image}`) : "/placeholder.jpg"}
alt={product?.name || "Product"}
/>
</div>

<div className="info" onClick={goToProduct}>

<div className="cat-rating-row">

<span className="category-tag">{product.category || "Fruits"}</span>

{product.rating && (
<div className="rating-stars">
{renderStars(product.rating)}
</div>
)}

</div>

<h4 className="name">{product.name}</h4>
<div className="price-row">

<span className="price">
₹{product.price}
{product.unit && <span className="unit">/{product.unit}</span>}
</span>

{product.originalPrice && (
<span className="old">₹{product.originalPrice}</span>
)}

</div>

<div className="review-row">
(120 reviews)
</div>

<div className="variants-container">

{product.sizes && product.sizes.length>0 && (

<div className="variant-options">

{product.sizes.map((size)=>(
<span
key={size}
className={`size-pill ${selectedSize===size?"active":""}`}
onClick={(e)=>{
e.stopPropagation();
setSelectedSize(size);
}}
>
{size}
</span>
))}

</div>

)}

</div>

<div className="action-row" onClick={(e)=>e.stopPropagation()}>

<button className="buy-now-btn" onClick={handleBuyNow}>
Buy Now
</button>

{quantity===0 ? (

<button className="add-cart-btn" onClick={handleInitialAdd}>
Add
</button>

):( 

<div className="qty-controls">

<button className="qty-btn" onClick={handleDecrement}>
<RemoveIcon fontSize="small"/>
</button>

<span className="qty-count">{quantity}</span>

<button className="qty-btn" onClick={handleIncrement}>
<AddIcon fontSize="small"/>
</button>

</div>

)}

</div>

</div>
</div>

</StyledWrapper>

);
};

const StyledWrapper = styled.div`

.card{
background:#ffffff;
border:1px solid #e5e7eb;
border-radius:6px;
overflow:hidden;
display:flex;
flex-direction:column;
height:100%;
position:relative;
}

.card:hover{
box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

.wishlist-btn{
position:absolute;
top:8px;
right:8px;
background:white;
border:none;
border-radius:50%;
width:26px;
height:26px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
z-index:2;
}

.discount{
position:absolute;
top:8px;
left:8px;
background:#ef4444;
color:white;
padding:3px 6px;
border-radius:4px;
font-size:9px;
font-weight:700;
}

.image-box{
width:100%;
aspect-ratio:4/3;
background:#f8fafc;
overflow:hidden;
cursor:pointer;
}

.image-box img{
width:100%;
height:100%;
object-fit:cover;
}

.info{
padding:10px;
display:flex;
flex-direction:column;
flex-grow:1;
}

.cat-rating-row{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:4px;
}

.category-tag{
font-size:11px;
font-weight:600;
color:#9ca3af;
}

.rating-stars{
display:flex;
gap:2px;
}

.star{
color:#e5e7eb;
font-size:12px;
}

.star.filled{
color:#fbbf24;
}

.name{
font-size:20px;
font-weight:600;
color:#374151;
//  margin-top:50px;
margin-bottom:-5px;

}

.price-row{
display:flex;
align-items:center;
 margin-bottom:6px;
}

.price{
font-size:19px;
font-weight:700;
color:#429b58;
}

.unit{
font-size:12px;
}

.old{
font-size:15px;
color:#9ca3af;
text-decoration:line-through;
// margin-left:2px;
}

.review-row{
font-size:11px;
color:#9ca3af;
margin-bottom:8px;
}

.variant-options{
display:flex;
gap:6px;
margin-bottom:10px;
}

.size-pill{
font-size:10px;
padding:3px 6px;
border:1px solid #e5e7eb;
border-radius:4px;
cursor:pointer;
}

.size-pill.active{
border-color:#429b58;
color:#429b58;
}

.action-row{
display:flex;
gap:6px;
margin-top:auto;
}

.buy-now-btn{
flex:1;
padding:8px;
background:#429b58;
color:white;
border:1px solid #429b58;
border-radius:4px;
font-size:12px;
cursor:pointer;
}

.add-cart-btn{
flex:1;
padding:8px;
background:white;
color:#429b58;
border:1px solid #429b58;
border-radius:4px;
font-size:12px;
cursor:pointer;
}

.qty-controls{
flex:1;
display:flex;
align-items:center;
justify-content:center;
gap:6px;
background:#429b58;
color:white;
border-radius:4px;
height:34px;
}

.qty-btn{
border:none;
background:transparent;
color:white;
cursor:pointer;
}

.qty-count{
font-weight:700;
}

`;

export default Card;