import React from "react";

const InputComponent = ({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error,
  maxLength
}) => {
  return (
    <div className="flex flex-col gap-1 mb-3 relative z-10">
      {/* 🔥 NAYA STATIC LABEL (Upar aur bahar rahega, udedga nahi) */}
      <label className="text-xs font-semibold text-textLight pl-1">
        {label}
      </label>
      
      <div className="relative flex items-center">
        {/* Icon */}
        {Icon && (
          <div className={`absolute left-3.5 z-10 transition-colors ${error ? "text-danger" : "text-textMuted"}`}>
            <Icon fontSize="small" />
          </div>
        )}
        
        {/* Input Field (Thoda height aur padding adjust kiya hai) */}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder=""
          maxLength={maxLength}
          className={`w-full h-12 rounded-md bg-bgSoft border-1.5 outline-none transition-all text-sm text-textMain
            ${Icon ? "pl-11" : "pl-3"} pr-3
            ${error 
              ? "border-danger bg-red-50 focus:ring-2 focus:ring-red-100" 
              : "border-borderMain focus:border-primary focus:bg-white focus:ring-2 focus:ring-teal-50"
            }`}
        />
      </div>

      {/* Error Text */}
      {error && <span className="text-[11px] text-danger font-semibold px-1 animate-pulse">{error}</span>}
    </div>
  );
};

export default InputComponent;