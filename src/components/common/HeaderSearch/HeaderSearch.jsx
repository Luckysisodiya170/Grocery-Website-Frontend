import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

import { useCart } from "../../../pages/cart/CartContext";
import products from "../../../data/products.json";

function HeaderSearch() {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedLocation, setSelectedLocation] = useState("New Delhi, 110001");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", street: "", landmark: "", city: "", state: "", pin: "", type: "Home"
  });

  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Search Logic ---
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const handleSearchClick = (productId) => {
    setIsSearchFocused(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
        
        {/* --- Location Pill--- */}
        <button 
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-3 p-1.5 pr-5 bg-white border border-slate-100 rounded-2xl lg:rounded-full shadow-sm hover:border-cyan-900/30 transition-all min-w-full lg:min-w-[280px] group"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-900/20">
            <LocationOnIcon fontSize="small" />
          </div>
          <div className="flex flex-col items-start overflow-hidden text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delivering to</span>
            <strong className="text-sm font-black text-cyan-900 truncate w-40">{selectedLocation}</strong>
          </div>
          <KeyboardArrowDownIcon className="ml-auto text-slate-400 group-hover:text-cyan-900 transition-all" />
        </button>

        {/* --- Search Bar--- */}
        <div className={`relative flex-1 flex border-gray-700 shadow-md items-center gap-3 px-5 h-14 rounded-2xl lg:rounded-full transition-all w-full border ${isSearchFocused ? 'bg-white border-cyan-900 shadow-xl shadow-cyan-900/10' : 'bg-slate-50 border-slate-100'}`}>
          <SearchIcon className={isSearchFocused ? 'text-cyan-900' : 'text-slate-400'} />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
            placeholder="Search for fresh spinach, milk..."
            value={query}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-red-500">
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {/* --- SEARCH SUGGESTIONS DROPDOWN --- */}
      {isSearchFocused && query.length > 0 && (
        <div className="absolute top-full left-0 lg:left-auto lg:right-0 w-full lg:w-[calc(100%-300px)] bg-white mt-3 rounded-[32px] border border-slate-100 shadow-[0_20px_60px_rgba(8,47,55,0.15)] overflow-hidden z-[1100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 px-2">Suggestions for "{query}"</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleSearchClick(product.id)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cyan-50 cursor-pointer group transition-all"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 group-hover:bg-white border border-transparent group-hover:border-cyan-100">
                    <img src={product.product_image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 group-hover:text-cyan-900 transition-colors truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-cyan-900">₹{product.offer_price}</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <AccessTimeIcon style={{ fontSize: '10px' }} /> 8 MINS
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); setIsCartOpen(true); }}
                    className="p-2 bg-white border border-cyan-900 text-cyan-900 rounded-lg hover:bg-cyan-900 hover:text-white transition-all scale-0 group-hover:scale-100 shadow-sm"
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-slate-400 font-bold italic">No matches found. Try searching for something else!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LOCATION MODAL--- */}
      {showLocationModal && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowLocationModal(false)} />
          
          <div className="relative w-full lg:max-w-xl bg-white rounded-t-[40px] lg:rounded-[40px] shadow-2xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center mb-8">
               {isAddingAddress ? (
                 <button onClick={() => setIsAddingAddress(false)} className="flex items-center gap-2 text-slate-400 font-black uppercase text-xs hover:text-cyan-900">
                    <ArrowBackIcon fontSize="inherit" /> Back
                 </button>
               ) : (
                 <div>
                    <h3 className="text-2xl font-black text-cyan-900 tracking-tight">Select Location</h3>
                    <p className="text-slate-400 text-sm font-bold">Where should we deliver your order?</p>
                 </div>
               )}
               <button onClick={() => setShowLocationModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                  <CloseIcon />
               </button>
            </div>

            {isAddingAddress ? (
              /* Detailed form  */
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="flex gap-3">
                   {["Home", "Work", "Other"].map(type => (
                     <button 
                       key={type}
                       onClick={() => setAddressForm({...addressForm, type})}
                       className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${addressForm.type === type ? 'bg-cyan-900 border-cyan-900 text-white shadow-lg shadow-cyan-900/20' : 'bg-slate-50 border-transparent text-slate-400'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-cyan-900 focus:bg-white transition-all" placeholder="Receiver's Name" />
                  <input className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-cyan-900 focus:bg-white transition-all" placeholder="Phone Number" />
                </div>
                <input className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-cyan-900 focus:bg-white transition-all" placeholder="Flat / House No. / Building" />
                <button className="w-full py-5 bg-cyan-900 text-white rounded-[24px] font-black shadow-xl shadow-cyan-900/20 hover:bg-cyan-950 transition-all uppercase tracking-widest">
                   Save & Deliver Here
                </button>
              </div>
            ) : (
              /* Saved addresses */
              <div className="flex flex-col gap-6">
                <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-4 p-5 border-2 border-dashed border-slate-200 rounded-3xl hover:border-cyan-900 hover:bg-cyan-50 transition-all group text-left">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-cyan-900 group-hover:text-white transition-all">
                    <AddIcon />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg group-hover:text-cyan-900 transition-colors">Add New Address</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">For a different location</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-5 bg-cyan-900 text-white rounded-3xl shadow-xl shadow-cyan-900/30 hover:scale-[1.01] transition-all">
                  <MyLocationIcon className="animate-pulse text-cyan-200" />
                  <div className="text-left">
                    <p className="font-black text-lg">Use Current Location</p>
                    <p className="text-xs text-cyan-200/60 font-bold uppercase tracking-widest">Using GPS</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default HeaderSearch;