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
    <div className="static-page">
      <h2 className="section-title">Terms & Conditions</h2>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-8 h-8 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : content ? (
        <div className="static-content" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <>
          <p className="section-subtitle">Last Updated: February 2026</p>
          <div className="static-content">
            <h4>1. Acceptance of Terms</h4>
            <p>
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