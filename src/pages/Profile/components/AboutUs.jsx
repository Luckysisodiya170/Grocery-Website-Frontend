import React, { useState, useEffect } from "react";
import { getContentDetails } from "../../../utils/contentApi";

function AboutUs() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getContentDetails();
        if (res && res.success && res.data && res.data.records) {
          const record = res.data.records.find(item => item.page_key === "aboutUs");
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
      <h2 className="section-title">About Us</h2>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-8 h-8 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : content ? (
        <div className="static-content" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <>
          <p className="section-subtitle">Get to know the team and the mission behind Shipzyy.</p>
          <div className="static-content">
            <h4>Our Mission</h4>
            <p>
              At Shipzyy, we believe that getting your daily essentials shouldn't be a chore. 
              Our mission is to revolutionize the way you shop by bringing premium quality groceries, 
              fresh produce, and daily necessities right to your doorstep in minutes.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default AboutUs;