import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom"; 
import "./categoryPage.css";

import categories from "../../data/category";
import products from "../../data/products.json";

import CategoryHero from "./CategoryHero";
import CategoryRow from "./CategoryRow";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";

const CategoryPage = () => {
  const location = useLocation();
  
  // 1. GLOBAL SEARCH STATE (Listens to Navbar)
  const [searchParams, setSearchParams] = useSearchParams();
  const globalSearchTerm = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category");
  const urlSubcategory = searchParams.get("subcategory");

  // 2. PAGE STATES
  const uniqueCategories = categories.filter(
    (value, index, self) => index === self.findIndex((t) => t.name === value.name)
  );

  const [activeCategory, setActiveCategory] = useState(
    urlCategory || (location.state && location.state.selectedCategory) || uniqueCategories[0]?.name || "Electronics"
  );
  
  const [activeSub, setActiveSub] = useState(
    urlSubcategory || (location.state && location.state.selectedSub) || "All"
  );
  
  // 3. SORTING STATE
  const [sortOrder, setSortOrder] = useState("featured");

  // Sync state when URL changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
      setActiveSub(urlSubcategory || "All");
    } else if (location.state && location.state.selectedCategory) {
      setActiveCategory(location.state.selectedCategory);
      setActiveSub(location.state.selectedSub || "All");
    }
  }, [urlCategory, urlSubcategory, location]);

  // Handle Sidebar Images
  const currentCategoryObj = uniqueCategories.find((cat) => cat.name === activeCategory);
  const rawSubCategories = currentCategoryObj?.subcategories || [];

  const subCategoriesWithImages = [
    { 
      name: "All", 
      image: `/category/${currentCategoryObj?.image || "default.png"}` 
    },
    ...rawSubCategories.map((subName) => {
      // Find image using flexible keys
      const firstProduct = products.find(
        (p) => (p.mainCategory === activeCategory || p.parentCategory === activeCategory || p.category === activeCategory) && 
               (p.category === subName || p.subCategory === subName)
      );
      return {
        name: subName,
        image: firstProduct?.image || "default.png" 
      };
    })
  ];

  // 4. THE MASTER FILTER & SORT ENGINE
  const processedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      // Agar global search ho rahi hai
      if (globalSearchTerm) {
        return p.name.toLowerCase().includes(globalSearchTerm.toLowerCase());
      }
      
      // 🌟 BULLETPROOF FILTERING LOGIC 🌟
      // Checks all possible variations of your JSON keys
      const matchCategory = p.mainCategory === activeCategory || p.parentCategory === activeCategory || p.category === activeCategory;
      const matchSub = activeSub === "All" || p.category === activeSub || p.subCategory === activeSub;
      
      return matchCategory && matchSub;
    });

    // Step B: Sort
    if (sortOrder === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [activeCategory, activeSub, globalSearchTerm, sortOrder]);


  // --- CLICK HANDLERS (URL UPDATE LOGIC) ---
  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    setActiveSub("All");
    // Update URL parameters
    setSearchParams({ category: catName }); 
  };

  const handleSelectSub = (subName) => {
    setActiveSub(subName);
    // Jab Sidebar par click ho, URL ko bhi update karo taaki sab sync rahe
    if (subName === "All") {
      setSearchParams({ category: activeCategory });
    } else {
      setSearchParams({ category: activeCategory, subcategory: subName });
    }
  };

  const handleClearFilters = () => {
    if (searchParams.toString()) setSearchParams({});
    setActiveSub("All");
    setSortOrder("featured");
  };

  return (
    <div className="cat-page-wrapper">
      <div className="container-max"> 
        
        {!globalSearchTerm && (
          <CategoryRow
            categories={uniqueCategories}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        )}

        <div className={`cat-content-split ${globalSearchTerm ? "search-active" : ""}`}>
          
          {!globalSearchTerm && (
            <CategorySidebar
              subCategoriesData={subCategoriesWithImages}
              activeSub={activeSub}
              setActiveSub={handleSelectSub} // Pass new handler to Sidebar
            />
          )}

          <ProductGrid
            products={processedProducts} 
            activeCategory={globalSearchTerm ? "Search Results" : activeCategory}
            activeSub={globalSearchTerm ? `"${globalSearchTerm}"` : activeSub}
            clearFilters={handleClearFilters}
            sortOrder={sortOrder}       
            setSortOrder={setSortOrder} 
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;