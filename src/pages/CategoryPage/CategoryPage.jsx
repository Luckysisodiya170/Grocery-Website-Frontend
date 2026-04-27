import React, { useState, useEffect, useRef } from "react"; 
import { useSearchParams } from "react-router-dom"; 
import api from "../../utils/api"; 

import CategoryRow from "./CategoryRow";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSubcategory = searchParams.get("subcategory");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(urlCategory || "");
  const [activeSub, setActiveSub] = useState(urlSubcategory || "All");
  const [sortOrder, setSortOrder] = useState("featured");

  const subcategoryRef = useRef(null);
  const productGridRef = useRef(null);
  
  const initialScrollDone = useRef(false);

  const scrollToSubcategory = () => {
    setTimeout(() => {
      subcategoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      productGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/customers/home");
        if (response.data.success) {
          const allCats = response.data.data.categories || [];
          setCategories(allCats);
          if (!urlCategory && allCats.length > 0) setActiveCategory(allCats[0].name);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchInitialData();
  }, []);

  // 2. Extract Products
  useEffect(() => {
    if (categories.length === 0 || !activeCategory) return;
    const currentCat = categories.find(c => c.name === activeCategory);
    if (!currentCat) {
      setProducts([]);
      return;
    }

    if (activeSub === "All") {
      const allProducts = currentCat.subcategories?.flatMap(sub => sub.products || []) || [];
      setProducts(allProducts);
    } else {
      const currentSub = currentCat.subcategories?.find(s => s.name === activeSub);
      setProducts(currentSub?.products || []);
    }
  }, [categories, activeCategory, activeSub]);

  useEffect(() => {
    if (!loading && categories.length > 0 && !initialScrollDone.current) {
      
      setTimeout(() => {
        if (urlSubcategory && urlSubcategory !== "All") {
          productGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (urlCategory) {
          subcategoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); 

      initialScrollDone.current = true;
    }
  }, [loading, categories, urlCategory, urlSubcategory]); 

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
      

        <CategoryRow
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(name) => {
            setActiveCategory(name);
            setActiveSub("All");
            setSearchParams({ category: name });
            scrollToSubcategory(); 
          }}
        />

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          {/* Scroll Target 1 */}
          <div className="lg:w-[150px] shrink-0 scroll-mt-32 md:scroll-mt-40" ref={subcategoryRef}>
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory}
              activeSub={activeSub}
              setActiveSub={(name) => {
                setActiveSub(name);
                if (name === "All") setSearchParams({ category: activeCategory });
                else setSearchParams({ category: activeCategory, subcategory: name });
                scrollToProducts(); 
              }}
            />
          </div>

          {/* Scroll Target 2 */}
          <div className="flex-1 scroll-mt-32 md:scroll-mt-40" ref={productGridRef}>
            <ProductGrid
              products={products}
              loading={loading} 
              activeCategory={activeCategory}
              activeSub={activeSub}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              clearFilters={() => {
                setActiveSub("All");
                setSearchParams({ category: activeCategory });
                scrollToSubcategory(); 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;