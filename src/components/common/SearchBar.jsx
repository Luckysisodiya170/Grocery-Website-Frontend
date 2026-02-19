import { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./common.css";

const dummyData = [
  "Fresh Organic Apples",
  "Robusta Bananas",
  "Full Cream Milk",
  "Whole Wheat Bread",
  "Farm Fresh Eggs",
  "Green Vegetables",
  "Seasonal Fruits",
  "Basmati Rice",
  "Wireless Headphones",
  "Luxury Skincare"
];

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = dummyData.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-container" ref={dropdownRef}>
      <div className={`search-input-wrapper ${isFocused ? "focused" : ""}`}>
        <SearchIcon className="search-icon" />
        <input
          placeholder="Search products, brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {/* Floating Glass Dropdown */}
      {query && isFocused && (
        <div className="search-dropdown glass-panel">
          {filtered.length ? (
            filtered.map((item, i) => (
              <div 
                key={i} 
                className="dropdown-item" 
                onClick={() => { setQuery(item); setIsFocused(false); }}
              >
                <SearchIcon className="item-icon" fontSize="small" />
                <span>{item}</span>
                <ArrowForwardIosIcon className="item-arrow" />
              </div>
            ))
          ) : (
            <div className="dropdown-empty">
              <span>No results found for "{query}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;