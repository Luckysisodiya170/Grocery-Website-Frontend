import React, { useState, useEffect } from "react";
import { getContentDetails } from "../../../utils/contentApi";

function TermsConditions() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getContentDetails();
        if (res && res.success && res.data && res.data.records) {
          const record = res.data.records.find(item => item.page_key === "termsConditions");
          setContent(record?.content || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="p-6 md:p-8 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] w-full h-full min-h-[500px]">
      <div className="mb-6 pb-4 border-b border-[var(--border)]">
        <h2 className="text-[22px] font-black text-[var(--text-main)]">Terms & Conditions</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : content ? (
        <div className="text-[14px] md:text-[15px] text-[var(--text-light)] leading-relaxed prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <>
          <p className="text-[13px] text-[var(--text-muted)] font-medium mb-5">Last Updated: February 2026</p>
          <div className="text-[14px] md:text-[15px] text-[var(--text-light)] leading-relaxed">
            <h4 className="text-[18px] font-bold text-[var(--text-main)] mb-2">1. Acceptance of Terms</h4>
            <p className="mb-5">
              By accessing and using the Shipzyy platform, you accept and agree to be bound by 
              the terms and provisions of this agreement.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default TermsConditions;