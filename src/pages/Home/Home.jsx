import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import app from "../../assets/screen/WhatsApp Image 2026-02-20 at 12.54.29 AM.jpeg";
import Card from "../../components/Product/Productcard/Productcard.jsx";
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
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get("http://13.203.29.79:9000/api/v1/customers/home");
        if (response.data.success) {
          const data = response.data.data;
          const categories = data.categories || [];
          setApiData({
            banners: data.banners || [],
            categories: categories,
            bestSellers: data.best_sellers?.records || []
          });
          if (categories.length > 0) setSelectedCategory(categories[0]);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

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
        
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    }, 150); 
  };
  const handleSubSelect = (subName) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/shop?category=${selectedCategory?.name}&sub=${subName}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950 font-bold animate-pulse">LOADING...</div>;

  return (
    <div className="w-full min-h-screen pb-16 bg-transparent overflow-x-hidden">
      
      {/* Banner Slider */}
      <section className="w-full px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
          {apiData.banners.map((item, index) => (
            <div key={item.id || index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <img src={item.banner_image} alt={item.banner_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] xl:max-w-[1600px] mx-auto px-5">
        
        {/* Category Icons */}
        <Category data={apiData.categories} onSelect={handleCategorySelect} />

        {/* Dynamic Sub-category Section */}
        {selectedCategory && (
          <div id="subcategory-section" className="animate-fade-in py-10">
            <div className="mb-8 border-l-4 border-primary pl-4">
              <span className="text-[13px] font-extrabold tracking-[3px] uppercase text-success">Discover</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight italic">
                 {selectedCategory.name}
              </h2>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {selectedCategory.subcategories?.map((sub) => (
                <div 
                  key={sub.id} 
                  onClick={() => handleSubSelect(sub.name)} 
                  className="group min-w-[180px] sm:min-w-[220px] aspect-[3/4] relative rounded-[32px] overflow-hidden cursor-pointer snap-start border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl bg-slate-900"
                >
                  {/* Background Image */}
                  <img 
                    src={sub.image} 
                    alt={sub.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 transition-all"></div>
                  
                  {/* 🔥 NEW HEADING STYLE: Top Left Header */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="inline-block bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                      <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">
                        {sub.name}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Arrow Indicator */}
                  <div className="absolute bottom-5 right-5 w-10 h-10 bg-primary rounded-full flex items-center justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-500 shadow-[0_0_15px_#00f2fe]">
                    <span className="text-black font-bold">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Sellers Grid */}
        <section className="my-20">
         <div className="mb-8">
             <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight underline decoration-primary underline-offset-8">Best Sellers</h2>
         </div>
          <Recommended products={apiData.bestSellers} />
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