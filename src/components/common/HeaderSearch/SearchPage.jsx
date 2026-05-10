import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { searchProducts } from "../../../utils/searchApi";
import { getHomeData } from "../../../utils/homeApi";
import Card from "../../../components/Product/Productcard/Productcard";


const catStyles = [
  { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100" },
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
  { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100" },
];

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await getHomeData(1, 20); 
      if (res?.success) {
        const filtered = (res.data.categories || []).filter(
          (cat) => cat.subcategories && cat.subcategories.length > 0
        );
        setCategories(filtered);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const res = await searchProducts(query.trim());
          if (res?.success) setSearchResults(res.data.products || []);
        } catch (err) { setSearchResults([]); }
        finally { setIsSearching(false); }
      } else { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      addToRecent(query.trim());
    }
  };

  const addToRecent = (term) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 p-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 flex items-center justify-center bg-cyan-900 text-white rounded-2xl shadow-lg shadow-cyan-900/20 hover:scale-110 active:scale-95 transition-all shrink-0"
          >
            <ArrowBackIcon />
          </button>
          
          <div className="flex-1 flex items-center gap-3 px-6 h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus-within:border-cyan-900 focus-within:bg-white transition-all">
            <SearchIcon className="text-slate-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search for snacks, drinks or daily essentials..."
              className="flex-1 bg-transparent outline-none font-bold text-lg text-slate-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && <CloseIcon className="cursor-pointer text-slate-400" onClick={() => setQuery("")} />}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        
        {!query ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                    <HistoryIcon style={{ fontSize: '18px' }} /> Recent Searches
                  </h3>
                  <button onClick={clearRecent} className="text-rose-500 font-bold text-xs flex items-center gap-1 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all">
                    <DeleteSweepIcon style={{ fontSize: '18px' }} /> Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-600 hover:border-cyan-900 hover:text-cyan-900 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Categories Grid */}
            <div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-6 px-1">Shop by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {categories.map((cat, i) => {
                  const style = catStyles[i % catStyles.length];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setQuery(cat.name); addToRecent(cat.name); }}
                      className={`${style.bg} ${style.border} border-2 h-32 rounded-[30px] flex items-center justify-center p-4 transition-all hover:scale-[1.03] hover:shadow-xl group relative overflow-hidden`}
                    >
                      <span className={`${style.text} font-black text-[15px] text-center leading-tight relative z-10 uppercase tracking-tighter`}>
                        {cat.name}
                      </span>
                      <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Search Results */
          <div className="space-y-8">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Results for "{query}"</h2>
                {isSearching && <div className="w-6 h-6 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin" />}
             </div>

             {searchResults.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {searchResults.map((product) => (
                   <div key={product.id} onClick={() => addToRecent(product.name)}>
                     <Card product={product} />
                   </div>
                 ))}
               </div>
             ) : !isSearching && (
               <div className="py-20 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                    <SearchIcon style={{ fontSize: '40px' }} />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No items found</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;