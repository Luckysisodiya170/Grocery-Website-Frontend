import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import { searchProducts } from "../../../utils/searchApi";
import { useCart } from "../../../pages/cart/CartContext";
import { encodeId } from "../../../utils/crypto";

function SearchPage() {
    const navigate = useNavigate();
    const { addToCart, setIsCartOpen } = useCart();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsSearching(true);
                try {
                    const res = await searchProducts(query.trim());
                    if (res?.success) setSearchResults(res.data.products || []);
                } catch (err) { setSearchResults([]); }
                finally { setIsSearching(false); }
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleProductClick = (product) => {
        const updatedRecent = [product.name, ...recentSearches.filter(s => s !== product.name)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
        
        const maskedKey = encodeId(product.id);
        navigate(`/product/${maskedKey}`);
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Full Width Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-100 p-4 w-full shadow-sm">
                <div className="flex items-center gap-4 w-full">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all shrink-0">
                        <ArrowBackIcon className="text-slate-700" />
                    </button>
                    <div className="flex-1 flex items-center gap-3 px-5 h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus-within:border-[var(--primary)] focus-within:bg-white transition-all w-full">
                        <SearchIcon className="text-slate-400" />
                        <input 
                            autoFocus
                            type="text"
                            placeholder="Search for groceries, snacks..."
                            className="flex-1 bg-transparent outline-none font-bold text-lg w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && <CloseIcon className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setQuery("")} />}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
                {/* Recent Searches */}
                {!query && (
                    <div className="animate-in fade-in duration-500 max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[2px]">Recent Searches</h3>
                            {recentSearches.length > 0 && (
                                <button onClick={clearRecent} className="text-xs font-bold text-rose-500">Clear All</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {recentSearches.map((s, i) => (
                                <button key={i} onClick={() => setQuery(s)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-600 hover:border-[var(--primary)] transition-all shadow-sm">
                                    <AccessTimeIcon style={{ fontSize: '14px' }} className="opacity-40" /> {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid Layout */}
                {query && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Showing results for "{query}"</p>
                            {isSearching && <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>}
                        </div>

                        {/* Responsive Grid: Mobile 2, Tablet 3, Desktop 4, Large 5 */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                            {searchResults.map((product) => (
                                <div 
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className="bg-white rounded-[32px] p-3 md:p-4 border border-slate-100 hover:border-[var(--primary)] hover:shadow-2xl transition-all cursor-pointer group flex flex-col relative"
                                >
                                    {/* Big Product Image */}
                                    <div className="aspect-square w-full bg-slate-50 rounded-[24px] overflow-hidden p-4 mb-4 relative">
                                        <img src={product.product_image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        
                                        {/* Time Badge Overlay */}
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                                            <AccessTimeIcon style={{ fontSize: '12px' }} className="text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-700">8 MINS</span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 px-1">
                                        <h4 className="font-black text-slate-800 text-[15px] leading-tight mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-slate-900">₹{product.offer_price}</span>
                                                {product.price > product.offer_price && (
                                                    <span className="text-xs text-slate-400 line-through font-bold">₹{product.price}</span>
                                                )}
                                            </div>

                                            {/* Plus Add Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                    setIsCartOpen(true);
                                                }}
                                                className="w-10 h-10 md:w-12 md:h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <AddIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!isSearching && searchResults.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-200">
                                    <SearchIcon style={{ fontSize: '40px' }} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;