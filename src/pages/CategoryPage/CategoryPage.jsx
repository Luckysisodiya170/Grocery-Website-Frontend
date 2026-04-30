import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../../utils/api";
import { getSubcategories } from "../../utils/categoryApi";
import { getProducts } from "../../utils/productApi";
import CategoryRow from "./CategoryRow";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSubcategory = searchParams.get("subcategory");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [allFallbackProducts, setAllFallbackProducts] = useState([]); 

  const [activeCategory, setActiveCategory] = useState(urlCategory || "");
  const [activeSub, setActiveSub] = useState(urlSubcategory || "All");
  const [sortOrder, setSortOrder] = useState("featured");

  const observer = useRef();

  const normalizeProducts = (records) => {
    return records.map(p => ({
      ...p,
      image: p.primary_image || (p.images && p.images[0]) || (p.all_images && p.all_images[0]?.image_url) || p.product_image || p.image,
      category: p.category || p.category_name,
      subCategory: p.subCategory || p.subcategory_name
    }));
  };

  const lastProductElementRef = useCallback(node => {
    if (loading || fetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !fetchingMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasNextPage]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setPage(1); 
        const token = localStorage.getItem('refreshToken'); 
        
        const homeResponse = await apiService.get("/customers/home");
        let allCats = homeResponse.data?.data?.categories || [];
        setCategories(allCats);
        
        const initialCat = urlCategory || (allCats.length > 0 ? allCats[0].name : "");
        setActiveCategory(initialCat);

        if (token) {
          const [subRes, prodRes] = await Promise.all([
            getSubcategories(),
            getProducts(1, 10, { category: initialCat, subcategory: urlSubcategory !== "All" ? urlSubcategory : undefined })
          ]);
          if (subRes.success) setSubcategories(subRes.data.records.sort((a, b) => a.id - b.id));
          if (prodRes.success) {
            setProducts(normalizeProducts(prodRes.data.records));
            setHasNextPage(prodRes.data.pagination.hasNextPage);
          }
        } else {
          const fallbackSubs = allCats.flatMap(cat => (cat.subcategories || []).map(sub => ({ ...sub, category: cat.name, icon: sub.image })));
          setSubcategories(fallbackSubs.sort((a, b) => a.id - b.id));
          const totalProds = normalizeProducts(allCats.flatMap(cat => (cat.subcategories || []).flatMap(sub => sub.products || [])));
          setAllFallbackProducts(totalProds);
          setProducts(totalProds.slice(0, 10)); 
          setHasNextPage(totalProds.length > 10);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchAllData();
  }, [urlCategory, urlSubcategory]);

  useEffect(() => {
    if (page === 1 || fetchingMore) return;

    const fetchMore = async () => {
      setFetchingMore(true); 

      const token = localStorage.getItem('refreshToken');

      try {
        if (token) {
          const res = await getProducts(page, 10, { 
            category: activeCategory, 
            subcategory: activeSub !== "All" ? activeSub : undefined 
          });
          if (res.success) {
            const newBatch = normalizeProducts(res.data.records);
            setProducts(prev => [...prev, ...newBatch]);
            setHasNextPage(res.data.pagination.hasNextPage);
          }
        } else {
          const startIndex = (page - 1) * 10;
          const nextBatch = allFallbackProducts.slice(startIndex, startIndex + 10);
          setProducts(prev => [...prev, ...nextBatch]);
          setHasNextPage(allFallbackProducts.length > startIndex + 10);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setFetchingMore(false), 800);
      }
    };
    fetchMore();
  }, [page]);

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-10 w-full text-cyan-500">
      <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black mt-4 tracking-[0.2em] uppercase">Loading Products...</p>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 ">
      <div className="max-w-[1600px] mx-auto">
        <CategoryRow
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(name) => {
            setSearchParams({ category: name });
            setProducts([]); 
          }}
        />

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          <div className="lg:w-[250px] shrink-0">
            <CategorySidebar
              subcategories={subcategories.filter(s => s.category === activeCategory)}
              activeCategory={activeCategory}
              activeSub={activeSub}
              setActiveSub={(name) => {
                setSearchParams({ category: activeCategory, subcategory: name });
                setProducts([]); 
              }}
            />
          </div>

          <div className="flex-1">
            {loading ? <LoadingSpinner /> : (
              <>
                <ProductGrid
                  products={products}
                  loading={loading}
                  activeCategory={activeCategory}
                  activeSub={activeSub}
                  sortOrder={sortOrder} 
                  setSortOrder={setSortOrder} 
                />
                
                <div ref={lastProductElementRef} className="h-20 w-full flex justify-center items-center mt-6">
                  {fetchingMore && <LoadingSpinner />}
                  {!hasNextPage && products.length > 0 && (
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">You've reached the end</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;