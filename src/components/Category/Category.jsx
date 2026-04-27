import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Category({ data = [], onSelect }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Filter categories that have at least one subcategory
  const validCategories = data.filter(
    (item) => item.subcategories && item.subcategories.length > 0
  );

  // If no valid categories, don't render the section
  if (validCategories.length === 0) return null;

  return (
    <section className="w-full py-10 lg:py-14">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight underline decoration-primary underline-offset-8">
            Categories
          </h2>
          <p className="text-[13px] sm:text-md text-amber-400 font-bold uppercase tracking-[4px] mt-2">
            Premium Selection
          </p>
        </div>
        <span
          className="text-sm font-bold text-slate-400 hover:text-green-500 cursor-pointer transition-all hover:translate-x-1"
          onClick={() => navigate("/shop")}
        >
          View all →
        </span>
      </div>

      {/* Scrollable Container */}
      <div
        className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-8 scrollbar-hide snap-x"
        ref={scrollRef}
      >
        {validCategories.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-4 cursor-pointer group min-w-[135px] sm:min-w-[160px] lg:min-w-[180px] snap-center"
            onClick={() => onSelect && onSelect(item)}
          >
            {/* Circle UI */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-[5px] border-white/5 group-hover:border-green-500 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 group-hover:shadow-green-500/20">
              <img
                src={item.icon || item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/10 transition-all duration-500"></div>
            </div>

            {/* Label */}
            <span className="text-[13px] lg:text-[14px] font-black text-white/90 group-hover:text-green-500 uppercase tracking-widest text-center transition-all duration-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Category;