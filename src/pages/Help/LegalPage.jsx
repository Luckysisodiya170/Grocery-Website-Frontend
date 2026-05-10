import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContentDetails } from "../../utils/contentApi";

function LegalPage() {
  const { type } = useParams(); 
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await getContentDetails();
        if (res?.success) {
          const record = res.data.records.find(item => item.page_key === type);
          setContent(record?.content || "Content not found.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
    window.scrollTo(0, 0); 
  }, [type]);

  return (
    <div className="min-h-[70vh] py-10 md:py-16 px-5 flex items-start justify-center">
      <div className="max-w-4xl w-full bg-white p-8 md:p-14 rounded-[40px] shadow-[0_10px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-slate-100 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 capitalize tracking-tight">
            {type.replace(/([A-Z])/g, ' $1')}
          </h1>
          <div className="absolute bottom-0 left-0 w-20 h-1.5 bg-blue-500 rounded-full"></div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full"></div>
            <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded-full w-4/5"></div>
          </div>
        ) : (
          <div 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-bold text-[15px] 
            prose-headings:text-slate-800 prose-headings:font-black prose-p:mb-6"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        )}
      </div>
    </div>
  );
}

export default LegalPage;