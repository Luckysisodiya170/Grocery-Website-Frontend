import React, { useState, useEffect } from "react";
import { getFAQs, getHelpSupportContacts, getAnnouncements, createSupportTicket } from "../../utils/helpApi"; 

function Help() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [supportContacts, setSupportContacts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    support_contact_id: ""
  });

  useEffect(() => {
    const fetchHelpPageData = async () => {
      try {
        setIsLoading(true);
        const [faqResponse, contactResponse, announcementResponse] = await Promise.all([
          getFAQs(),
          getHelpSupportContacts(),
          getAnnouncements()
        ]);
        
        if (faqResponse?.success) setFaqData(faqResponse.data.records);
        
        if (contactResponse?.success) {
          setSupportContacts(contactResponse.data.records);
          if (contactResponse.data.records.length > 0) {
            setTicketForm(prev => ({ ...prev, support_contact_id: contactResponse.data.records[0].id }));
          }
        }

        if (announcementResponse?.success) setAnnouncements(announcementResponse.data.records);
        
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHelpPageData();
  }, []);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: name === "support_contact_id" ? Number(value) : value }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await createSupportTicket(ticketForm);
      if (response?.success) {
        alert(`Ticket created successfully! ID: ${response.data.support_ticket_id}`);
        setTicketForm({ subject: "", message: "", support_contact_id: supportContacts[0]?.id || "" });
      }
    } catch (error) {
      alert("An error occurred while creating the ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full -mt-[50px] font-sans bg-slate-50 min-h-screen">
      
      <div className="relative h-[45vh] min-h-[380px] flex items-center justify-center pt-8">
        <div className="absolute inset-0 bg-[#0f172a] z-0" />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto text-center px-5 -translate-y-4">
          <h1 className="text-4xl md:text-[56px] font-extrabold mb-8 tracking-tight text-white">
            How can we <span className="text-[#3b82f6]">help you?</span>
          </h1>

          <div className="max-w-[650px] mx-auto flex flex-col md:flex-row bg-[#1e293b] border border-slate-700 md:rounded-full rounded-2xl p-1.5 shadow-lg">
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none text-white px-6 py-4 text-[15px] outline-none text-center md:text-left placeholder:text-slate-400" 
              placeholder="Search for articles, questions, or topics..." 
            />
            <button className="bg-[#2563eb] hover:bg-blue-600 text-white border-none px-10 py-3 mt-2 md:mt-0 rounded-xl md:rounded-full font-semibold text-[15px] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-[1200px] mx-auto px-5 -mt-[60px] pb-20 flex flex-col gap-10">
        
        <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-slate-100 w-full">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-[15px]">Quick answers to common queries</p>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-slate-400 text-[15px]">Loading questions...</p>
            ) : (
              faqData.map((faq, index) => (
                <div 
                  key={faq.id || index} 
                  className={`rounded-[16px] border overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-[16px] font-semibold text-slate-800 m-0 pr-4">{faq.question}</h3>
                    <span className={`text-[24px] font-light transition-transform duration-300 shrink-0 ${activeFaq === index ? "text-blue-500 rotate-180" : "text-slate-400"}`}>
                      {activeFaq === index ? "−" : "+"}
                    </span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 px-5 ${activeFaq === index ? "max-h-[200px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="m-0 text-slate-500 text-[15px] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-100 w-full">
            <h2 className="text-[24px] font-bold text-slate-900 mb-8">Create Support Ticket</h2>
            <form onSubmit={handleTicketSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-[14px] font-semibold text-slate-700 mb-2">Department</label>
                <select 
                  name="support_contact_id"
                  value={ticketForm.support_contact_id}
                  onChange={handleTicketChange}
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                >
                  {supportContacts.map(contact => (
                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-slate-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={ticketForm.subject}
                  onChange={handleTicketChange}
                  required
                  placeholder="Briefly describe your issue"
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  name="message"
                  value={ticketForm.message}
                  onChange={handleTicketChange}
                  required
                  rows="5"
                  placeholder="Details about your problem..."
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 w-full px-6 py-4 rounded-xl text-[15px] text-white bg-[#3b82f6] hover:bg-blue-600 font-semibold transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </div>

          <div className="bg-[#1e293b] p-8 md:p-10 rounded-[24px] shadow-sm text-white w-full h-full">
            <h2 className="text-[24px] font-bold mb-8 flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Direct Contact
            </h2>
            <div className="flex flex-col gap-8">
              {isLoading ? (
                <p className="text-slate-400 text-[15px]">Loading contacts...</p>
              ) : (
                supportContacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col gap-2.5 pb-8 border-b border-slate-700/50 last:border-0 last:pb-0">
                    <p className="font-bold text-slate-100 text-[18px]">{contact.name}</p>
                    <a href={`mailto:${contact.email}`} className="text-[15px] text-slate-300 hover:text-blue-400 transition-colors">{contact.email}</a>
                    <a href={`tel:${contact.country_code}${contact.phone_number}`} className="text-[15px] text-slate-300 hover:text-blue-400 transition-colors">{contact.country_code} {contact.phone_number}</a>
                    <p className="text-[14px] text-slate-400 mt-2">{contact.working_hours}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* <div className="w-full bg-[#0f172a] py-20 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-[32px] font-bold text-white mb-2">Announcements</h2>
              <p className="text-slate-400 text-[16px]">Stay updated with our latest news</p>
            </div>
            <div className="hidden md:flex bg-[#1e293b] p-3.5 rounded-full text-blue-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
            {isLoading ? (
              <p className="text-slate-400 text-[15px]">Loading announcements...</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="min-w-[300px] md:min-w-[380px] snap-start bg-[#1e293b] p-8 rounded-[24px] border border-slate-700 hover:border-slate-500 transition-colors flex flex-col shrink-0">
                  <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-3.5 py-1.5 rounded-full w-fit mb-5">
                    {ann.created_at}
                  </span>
                  <h3 className="text-[20px] font-bold text-white mb-3">{ann.title}</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed flex-grow whitespace-normal break-words">{ann.message}</p>
                </div>
              ))
            )}
          </div>
        </div> */}
      {/* </div> */}

    </div>
  );
}

export default Help;