import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom"; // 🔴 ADDED useSearchParams
import "./categoryPage.css";

import categories from "../../data/category";
import products from "../../data/products.json";

import CategoryHero from "./CategoryHero";
import CategoryRow from "./CategoryRow";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";

const CategoryPage = () => {
  const location = useLocation();
  
  // 🔴 1. GLOBAL SEARCH STATE (Listens to Navbar)
  const [searchParams, setSearchParams] = useSearchParams();
  const globalSearchTerm = searchParams.get("search") || "";

  // 2. PAGE STATES
  const uniqueCategories = categories.filter(
    (value, index, self) => index === self.findIndex((t) => t.name === value.name)
  );

  const [activeCategory, setActiveCategory] = useState(uniqueCategories[0]?.name || "Electronics");
  const [activeSub, setActiveSub] = useState("All");
  
  // 🔴 3. SORTING STATE
  const [sortOrder, setSortOrder] = useState("featured");

  // Handle Navigation state
  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setActiveCategory(location.state.selectedCategory);
      setActiveSub(location.state.selectedSub || "All");
    }
  }, [location]);

  // Handle Sidebar Images
  const currentCategoryObj = uniqueCategories.find((cat) => cat.name === activeCategory);
  const rawSubCategories = currentCategoryObj?.subcategories || [];

  const subCategoriesWithImages = [
    { 
      name: "All", 
      image: `/category/${currentCategoryObj?.image || "default.png"}` 
    },
    ...rawSubCategories.map((subName) => {
      const firstProduct = products.find(
        (p) => p.mainCategory === activeCategory && p.category === subName
      );
      return {
        name: subName,
        image: firstProduct?.image || "default.png" 
      };
    })
  ];

  // 🔴 4. THE MASTER FILTER & SORT ENGINE
  // useMemo ensures this only runs when filters actually change
  const processedProducts = useMemo(() => {
    // Step A: Filter
    let filtered = products.filter((p) => {
      // If user typed in the Navbar, ignore category and search ALL products
      if (globalSearchTerm) {
        return p.name.toLowerCase().includes(globalSearchTerm.toLowerCase());
      }
      // Otherwise, filter normally by sidebar category
      const matchCategory = p.mainCategory === activeCategory;
      const matchSub = activeSub === "All" || p.category === activeSub;
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

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    setActiveSub("All");
    if (globalSearchTerm) setSearchParams({}); // Clear search if they click a new category
  };

  const handleClearFilters = () => {
    if (globalSearchTerm) setSearchParams({});
    setActiveSub("All");
    setSortOrder("featured");
  };

  return (
    <div className="cat-page-wrapper">
      <div className="container">
        {/* Hide Top Row if Searching Globally */}
        {!globalSearchTerm && (
          <CategoryRow
            categories={uniqueCategories}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        )}

        <div className={`cat-content-split ${globalSearchTerm ? "search-active" : ""}`}>
          
          {/* Hide Sidebar if Searching Globally */}
          {!globalSearchTerm && (
            <CategorySidebar
              subCategoriesData={subCategoriesWithImages}
              activeSub={activeSub}
              setActiveSub={setActiveSub}
            />
          )}

          <ProductGrid
            products={processedProducts} // 🔴 Passed the sorted/filtered list
            activeCategory={globalSearchTerm ? "Search Results" : activeCategory}
            activeSub={globalSearchTerm ? `"${globalSearchTerm}"` : activeSub}
            clearFilters={handleClearFilters}
            sortOrder={sortOrder}       // 🔴 Passed down to control the dropdown
            setSortOrder={setSortOrder} // 🔴 Passed down to update state
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;