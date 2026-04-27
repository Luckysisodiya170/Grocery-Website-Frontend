import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import app from "../../assets/screen/WhatsApp Image 2026-02-20 at 12.54.29 AM.jpeg";
import Category from "../../components/Category/Category.jsx";
import Recommended from "../../components/Recommendation/Recommended.jsx";

function Home() {
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    banners: [],
    categories: [],
    bestSellers: []
  });
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasNextPage: false });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchHomeData = async (pageNo = 1) => {
    try {
      if (pageNo === 1) setLoading(true);
      else setLoadMoreLoading(true);

      const response = await axios.get(`http://13.203.29.79:9000/api/v1/customers/home?page=${pageNo}&limit=10`);
      
      if (response.data.success) {
        const data = response.data.data;
        const categories = data.categories || [];
        const newBestSellers = data.best_sellers?.records || [];
        const pagin = data.best_sellers?.pagination;

        setApiData((prev) => ({
          banners: pageNo === 1 ? (data.banners || []) : prev.banners,
          categories: pageNo === 1 ? categories : prev.categories,
          bestSellers: pageNo === 1 ? newBestSellers : [...prev.bestSellers, ...newBestSellers]
        }));

        setPagination({
          page: pagin?.page || 1,
          hasNextPage: pagin?.hasNextPage || false
        });

        if (pageNo === 1 && categories.length > 0) setSelectedCategory(categories[0]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData(1);
  }, []);

  // Banner Auto-play
  useEffect(() => {
    if (apiData.banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % apiData.banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [apiData.banners.length]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      const subSection = document.getElementById("subcategory-section");
      if (subSection) {
        const yOffset = -170;
        const y = subSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 150);
  };

  const handleSubSelect = (subName) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // 🌟 FIX: Name ko URL-safe banane ke liye encodeURIComponent lagaya
    const safeCategory = encodeURIComponent(selectedCategory?.name);
    const safeSubcategory = encodeURIComponent(subName);

    const query = subName === "All" 
      ? `category=${safeCategory}` 
      : `category=${safeCategory}&subcategory=${safeSubcategory}`;
      
    navigate(`/shop?${query}`);
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      fetchHomeData(pagination.page + 1);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950 font-bold animate-pulse">LOADING SHIPZZY...</div>;

  return (
    <div className="w-full min-h-screen pb-16 bg-transparent overflow-x-hidden">
      
      {/* Banner Slider */}
      <section className="w-full px-4 sm:px-6 mt-14">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[450px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
          {apiData.banners.map((item, index) => (
            <div key={item.id || index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <img src={item.banner_image} alt={item.banner_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] xl:max-w-[1600px] mx-auto px-5">
        
        <Category data={apiData.categories} activeCategory={selectedCategory?.name} onSelect={handleCategorySelect} />

        {/* Dynamic Sub-category Section */}
        {selectedCategory && (
          <div id="subcategory-section" className="animate-fade-in py-10">
            <div className="mb-8 border-l-4 border-cyan-500 pl-4">
              <span className="text-[13px] font-extrabold tracking-[3px] uppercase text-cyan-500">Discover</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight italic">
                {selectedCategory.name}
              </h2>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
             {/* --- ALL CARD --- */}
              <div 
                onClick={() => handleSubSelect("All")} 
                className="group min-w-[200px] sm:min-w-[240px] aspect-[3/4] relative rounded-[32px] overflow-hidden cursor-pointer snap-start border-2 border-dashed border-cyan-500/40 bg-cyan-900/10 flex flex-col items-center justify-center transition-all duration-500 hover:bg-cyan-900/30 hover:border-solid"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-cyan-500 text-3xl font-black">+</span>
                  </div>
                  
                  <h3 className="text-cyan-500 font-black text-xl sm:text-2xl tracking-tighter leading-none">
                    VIEW ALL
                  </h3>
                  
                  <p className="text-white/40 text-[10px] sm:text-[11px] mt-3 font-bold tracking-[2px] uppercase">
                    Explore Entire <br/> {selectedCategory?.name}
                  </p>
                </div>

                <div className="absolute bottom-6 right-6 w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:rotate-45 transition-all duration-500">
                  <span className="text-black font-black text-xl">→</span>
                </div>
              </div>

              {selectedCategory.subcategories?.map((sub) => (
                <div 
                  key={sub.id} 
                  onClick={() => handleSubSelect(sub.name)} 
                  className="group min-w-[180px] sm:min-w-[220px] aspect-[3/4] relative rounded-[32px] overflow-hidden cursor-pointer snap-start border border-white/5 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl bg-slate-900"
                >
                  <img src={sub.image} alt={sub.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <span className="text-[11px] sm:text-xs font-black text-white uppercase">{sub.name}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-5 right-5 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-black font-bold">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Sellers Grid */}
        <section className="my-20">
          <div className="mb-10 flex justify-between items-end">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight underline decoration-cyan-500 underline-offset-8">Best Sellers</h2>
          </div>
          
          <Recommended products={apiData.bestSellers} />

          {/* LOAD MORE BUTTON */}
          {pagination.hasNextPage && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={loadMoreLoading}
                className="px-10 py-4 bg-cyan-900/30 border border-cyan-500/50 text-cyan-500 font-black rounded-full hover:bg-cyan-500 hover:text-black transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
              >
                {loadMoreLoading ? "LOADING..." : "VIEW MORE PRODUCTS"}
                {!loadMoreLoading && <span className="text-xl">↓</span>}
              </button>
            </div>
          )}
        </section>

        {/* App Promo */}
        <div className="w-full my-24 flex justify-center px-2">
          <a href="https://play.google.com/store/apps" target="_blank" rel="noreferrer" className="w-full max-w-[1200px]">
            <img src={app} alt="Download App" className="w-full rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] object-cover" />
          </a>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Home;