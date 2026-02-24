import React from "react";
import "./categoryPage.css"; // Ensure this matches your file path

const CategorySidebar = ({ subCategoriesData = [], activeSub, setActiveSub }) => {
  if (!subCategoriesData || subCategoriesData.length === 0) return null;

  const IMAGE_FOLDER_PATH = "/product/"; 

  return (
    <aside className="cat-sidebar-rail">
      <ul className="sub-cat-list-rail">
        {subCategoriesData.map((sub, index) => {
          
          const safeImage = sub?.image || "default.png";
          let finalImagePath = safeImage;
          
          if (typeof safeImage === "string" && !safeImage.startsWith("/") && !safeImage.startsWith("http")) {
             finalImagePath = `${IMAGE_FOLDER_PATH}${safeImage}`;
          }

          const isActive = activeSub === sub?.name;

          return (
            <li key={index} className="sub-cat-item">
              <button
                className={`sub-cat-btn-rail ${isActive ? "active" : ""}`}
                onClick={() => setActiveSub(sub?.name)}
              >
                <div className="sub-cat-img-box">
                  <img 
                    src={finalImagePath} 
                    alt={sub?.name || "Category"} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ENo Img%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="sub-cat-name">{sub?.name}</span>
              </button>
              
              {/* Animated Active Pill Indicator */}
              {isActive && <div className="active-indicator"></div>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default CategorySidebar;