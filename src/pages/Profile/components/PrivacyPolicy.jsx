import React, { useState, useEffect } from "react";
import { getContentDetails } from "../../../utils/contentApi";

function PrivacyPolicy() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getContentDetails();
        if (res && res.success && res.data && res.data.records) {
          const record = res.data.records.find(item => item.page_key === "privacyPolicy");
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
      <h2 className="section-title">Privacy Policy</h2>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-8 h-8 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : content ? (
        <div className="static-content" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="static-content">
          <h4>1. Information We Collect</h4>
          <p>We collect information to provide better services to our users. This includes your name, delivery address, and contact details when you register or place an order.</p>
        </div>
      )}
    </div>
  );
}

export default PrivacyPolicy;