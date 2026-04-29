import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../../utils/api"; 
import ProductGallery from "../ProductGallery";
import ProductInfo from "../ProductInfo";
import ProductTabs from "../ProductTabs";
import SimilarProducts from "../../SimilarProduct/SimilarProducts";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const infoRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/customers/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data.product);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); 
  }, [id]);

  const requireLogin = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-slate-400">Loading Product...</p>
      </div>
    );
  }

  if (!product) return <h2 className="text-center text-2xl font-black mt-20 text-white">Product not found</h2>;

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-5 flex flex-col gap-6 pb-[100px] md:pb-10">
      
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 w-fit text-white font-bold hover:opacity-80 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </button>

      <div className="bg-[var(--card-bg)] rounded-[18px] p-[25px] md:p-10 shadow-[var(--shadow-md)] border border-[var(--border)] flex flex-col" ref={infoRef}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[50px] items-start">
          <ProductGallery product={product} requireLogin={requireLogin} />
          <ProductInfo product={product} requireLogin={requireLogin} />
        </div>

        <div className="mt-12 pt-10 border-t border-[var(--border)]">
          <ProductTabs product={product} />
        </div>

        <div className="mt-12 pt-10 border-t border-[var(--border)]">
          <SimilarProducts currentProduct={product} />
        </div>

      </div>

      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="bg-[var(--bg)] rounded-3xl p-6 max-w-[320px] w-full shadow-2xl flex flex-col items-center text-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-4 text-[var(--primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.25 8.25v-3a3.25 3.25 0 10-6.5 0v3h6.5z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-xl font-black text-[var(--text-main)] mb-2">Login Required</h3>
            <p className="text-xs font-bold text-[var(--text-muted)] mb-6 px-2 leading-relaxed">
              Please login to add items to your cart and complete your purchase.
            </p>

            <div className="flex w-full gap-3">
              <button 
                className="flex-1 bg-[var(--bg-soft)] text-[var(--text-muted)] text-xs font-black py-3 rounded-xl uppercase tracking-widest"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-[var(--primary)] text-[var(--secondary)] text-xs font-black py-3 rounded-xl shadow-[var(--shadow-sm)] uppercase tracking-widest"
                onClick={() => navigate("/login")}
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;