import React from "react";

const CategorySidebar = ({ categories, activeCategory, activeSub, setActiveSub }) => {
  const currentCat = categories.find(c => c.name === activeCategory);
  if (!currentCat) return null;

  const subData = [
    { name: "All", image: currentCat.icon || currentCat.image },
    ...(currentCat.subcategories || [])
  ];

  return (
    <aside className="lg:sticky lg:top-32 flex lg:flex-col gap-10 overflow-x-auto lg:overflow-visible pb-8 scrollbar-hide snap-x">
      {/* Scrollbar hide logic inline */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {subData.map((sub, idx) => {
        const isActive = activeSub === sub.name;
        
        return (
          <button
            key={idx}
            onClick={() => setActiveSub(sub.name)}
            className="flex flex-col items-center gap-4 group outline-none shrink-0 snap-center transition-all"
          >
            {/* Circle UI - Large Size like Category Row */}
            <div className={`relative w-24 h-24 lg:w-25 lg:h-25 rounded-full overflow-hidden border-[2px] transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-slate-900 flex items-center justify-center
              ${isActive 
                ? "border-cyan-500 shadow-cyan-500/30 scale-110" 
                : "border-white/20 group-hover:border-white/60"}`}>
              
              <img 
                src={sub.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={sub.name} 
              />
              
              {/* Subtle Overlay */}
              <div className={`absolute inset-0 transition-all duration-500 ${isActive ? 'bg-transparent' : 'bg-black/10 group-hover:bg-transparent'}`}></div>
            </div>
            
            {/* Subcategory Name */}
            <span className={`text-[11px] lg:text-[13px] font-black uppercase tracking-[2px] text-center max-w-[100px] leading-tight transition-all
              ${isActive ? "text-cyan-500" : "text-slate-500 group-hover:text-white"}`}>
              {sub.name}
            </span>

            {/* Active Indicator Line for Desktop */}
            {isActive && (
              <div className="hidden lg:block absolute -right-2 top-1/3 w-1 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4]" />
            )}
          </button>
        );
      })}
    </aside>
  );
};

export default CategorySidebar;