import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaXmark, FaArrowLeftLong, FaCheck, FaCreditCard, FaReceipt, FaUser, FaStar, FaRotateLeft, FaCamera, FaTrashCan } from "react-icons/fa6";
import { getOrderDetails } from "../../utils/orderApi";
import { addReview, updateReview, deleteReview } from "../../utils/reviewApi";
import { cancelOrderItem, returnOrderItem } from "../../utils/orderActionsApi";
import { decodeId } from "../../utils/crypto";

const OrderDetails = () => {
    const { id: maskedKey } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const [activeModal, setActiveModal] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewFiles, setReviewFiles] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [returnReason, setReturnReason] = useState("");
    const [returnComments, setReturnComments] = useState("");
    const [returnFiles, setReturnFiles] = useState([]);
    
    const fileInputRef = useRef(null);
    const returnFileInputRef = useRef(null);

    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get("item_id");

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const decodedOrderId = decodeId(maskedKey);
            
            if (!decodedOrderId) {
                navigate("/orders");
                return;
            }

            const res = await getOrderDetails(decodedOrderId, itemId);
            if (res && res.success) {
                setOrder(res.data);
            }
        } catch (error) {
            navigate("/orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (maskedKey) fetchDetails();
    }, [maskedKey, itemId, navigate]);

    const currentItem = order?.items?.find(item => String(item.item_id) === String(itemId)) || order?.items?.[0];
    
    const getDisplayStatus = (status) => {
        const s = status?.toLowerCase() || "";
        if (s === "confirmed" || s === "pending") return "Order Under Processing";
        return status;
    };

    const handleReviewFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setReviewFiles((prev) => [...prev, ...selectedFiles]);
    };

    const removeReviewFile = (index) => {
        setReviewFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleReturnFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setReturnFiles((prev) => [...prev, ...selectedFiles]);
    };

    const removeReturnFile = (index) => {
        setReturnFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const openReviewModal = () => {
        if (currentItem?.is_reviewed) {
            setRating(currentItem.review_rating || 0);
            setReviewText(currentItem.review_message || "");
        } else {
            setRating(0);
            setReviewText("");
            setReviewFiles([]);
        }
        setActiveModal('review');
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) return alert("Please select a star rating!");

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("rating", rating);
            formData.append("review", reviewText);

            if (currentItem.is_reviewed) {
                await updateReview(currentItem.review_id, formData);
            } else {
                formData.append("item_id", currentItem.item_id);
                formData.append("product_id", currentItem.product_id);
                formData.append("order_id", order.id);
                reviewFiles.forEach(file => formData.append("imageUrls", file));
                await addReview(formData);
            }

            setActiveModal(null);
            fetchDetails();
        } catch (error) {
            alert("Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your review?");
        if (!confirmDelete) return;

        try {
            setIsSubmitting(true);
            await deleteReview(currentItem.review_id); 
            setActiveModal(null);
            fetchDetails(); 
        } catch (error) {
            alert("Failed to delete review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelOrder = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this item?");
        if (!confirmCancel) return;

        try {
            setIsSubmitting(true);
            const data = {
                order_id: order.id,
                item_id: currentItem.item_id
            };
            await cancelOrderItem(data);
            fetchDetails();
        } catch (error) {
            alert("Failed to cancel order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReturnSubmit = async () => {
        if (!returnReason) return alert("Please select a reason for return.");
        
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("order_id", order.id);
            formData.append("item_id", currentItem.item_id);
            
            const finalReason = returnComments ? `${returnReason} - ${returnComments}` : returnReason;
            formData.append("reason", finalReason);

            returnFiles.forEach(file => formData.append("images", file));

            await returnOrderItem(formData);
            
            setActiveModal(null);
            fetchDetails();
        } catch (error) {
            alert("Failed to initiate return.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!order || !currentItem) return <div className="text-center mt-20 text-white font-bold">Order not found.</div>;

    const mainStatus = currentItem.item_status?.toLowerCase();
    const isDelivered = mainStatus === "delivered";
    const isCancelled = mainStatus === "cancelled";
    const isReturned = mainStatus === "returned" || mainStatus === "return pending";

    const canReturn = isDelivered && 
                  !isReturned &&
                  currentItem.is_return_allowed === true && 
                  Number(currentItem.return_days) > 0;

    const getThemeColor = () => {
        if (isCancelled || isReturned) return "rose"; 
        if (isDelivered) return "emerald"; 
        return "blue"; 
    };

    const theme = getThemeColor();

    const colorClasses = {
        blue: { bg: "bg-blue-600", text: "text-blue-600", line: "bg-blue-500", border: "border-blue-100", lightBg: "bg-blue-50" },
        rose: { bg: "bg-rose-500", text: "text-rose-600", line: "bg-rose-500", border: "border-rose-100", lightBg: "bg-rose-50" },
        emerald: { bg: "bg-emerald-600", text: "text-emerald-600", line: "bg-emerald-500", border: "border-emerald-100", lightBg: "bg-emerald-50" }
    };

    return (
        <div className="min-h-screen text-slate-900 pt-10 pb-20 px-4 md:px-6">
            <div className="max-w-[1100px] mx-auto">
                
                <div className="flex items-center justify-between mb-10">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-3 bg-white hover:bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200 text-slate-800 transition-all font-black shadow-sm"
                    >
                        <FaArrowLeftLong className="group-hover:-translate-x-2 transition-transform"/> 
                        Back to Orders
                    </button>
                </div>

                <div className="bg-white rounded-[45px] overflow-hidden shadow-sm border border-slate-200 flex flex-col">
                    
                    <div className="p-8 md:p-12 border-b border-slate-100">
                        <div className="flex flex-col lg:flex-row gap-10 items-start">
                            <div 
                                className="w-full sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-slate-50 rounded-[35px] border border-slate-100 flex-shrink-0 cursor-zoom-in relative group overflow-hidden"
                                onClick={() => setIsImageOpen(true)}
                            >
                                <img src={currentItem.product_image} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Enlarge</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                    <div className="space-y-2">
                                        <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest">Order ID: #{order.order_number}</span>
                                        <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{currentItem.name}</h2>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border ${
                                        (isCancelled || isReturned) ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        isDelivered ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {getDisplayStatus(currentItem.item_status)}
                                    </span>
                                </div>

                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-6">By {currentItem.vendor_name}</p>
                                
                                <div className="bg-slate-50/80 p-5 rounded-[20px] border border-slate-100 mb-6 w-full break-words whitespace-pre-wrap">
                                    <p className="text-slate-700 text-[14px] leading-relaxed font-bold">
                                        {currentItem.description}
                                    </p>
                                </div>

                                <div className="flex items-baseline gap-4 mt-6">
                                    <div className="text-3xl sm:text-4xl font-black text-slate-900">₹{Number(currentItem.offer_price).toLocaleString('en-IN')}</div>
                                    <span className="text-slate-400 line-through font-black text-sm">₹{currentItem.mrp}</span>
                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-md text-[11px] font-black uppercase">{currentItem.discount_percentage}% OFF</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${colorClasses[theme].lightBg} p-8 md:p-12 border-b border-slate-100`}>
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-12">Track Parcel</h3>
                        <div className="flex justify-between items-start gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {currentItem.tracking_status?.map((track, idx, arr) => {
                                const isCurrentCancelledOrReturned = (track.label === "Cancelled" || track.label === "Return Pending" || track.label === "Returned") && track.is_completed;
                                const isStepCompleted = (isDelivered && !isReturned) ? true : track.is_completed;
                                
                                let nodeColor = "bg-white text-slate-300 border-slate-200";
                                if (isStepCompleted) nodeColor = colorClasses[theme].bg + " text-white border-transparent scale-110 shadow-md";

                                return (
                                    <div key={idx} className="flex flex-col items-center flex-1 min-w-[120px] relative">
                                        {idx !== arr.length - 1 && (
                                            <div className={`absolute top-5 left-[60%] w-full h-[3px] rounded-full transition-all duration-1000 ${
                                                ((isDelivered && !isReturned) || arr[idx+1]?.is_completed) ? colorClasses[theme].line : 'bg-slate-200'
                                            }`} />
                                        )}
                                        <div className={`relative z-10 w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${nodeColor}`}>
                                            {isCurrentCancelledOrReturned ? <FaXmark size={14}/> : isStepCompleted ? <FaCheck size={14}/> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                        </div>
                                        <span className={`text-[11px] font-black uppercase mt-4 text-center ${isStepCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {track.label}
                                        </span>
                                        {track.date && <span className="text-[10px] font-black text-slate-400 mt-1">{track.date}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-8 md:p-12 bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            <div className="lg:col-span-7">
                                <div className="flex items-center gap-3 mb-6">
                                    <FaReceipt className="text-cyan-600 text-lg"/>
                                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-500">Bill Details</h3>
                                </div>
                                <div className="space-y-4 bg-slate-50 p-6 rounded-[30px] border border-slate-100">
                                    <div className="flex justify-between text-sm font-black text-slate-600">
                                        <span>Subtotal ({currentItem.quantity} item)</span>
                                        <span className="text-slate-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-black text-slate-600">
                                        <span>Delivery Charges</span>
                                        <span className="text-emerald-600 uppercase">{Number(order.delivery_charges) > 0 ? `₹${order.delivery_charges}` : 'FREE'}</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center mt-2">
                                        <span className="text-[16px] font-black text-slate-900">Total Paid</span>
                                        <span className="text-2xl font-black text-cyan-700">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col md:flex-row gap-4">
                                    {(mainStatus === 'pending' || mainStatus === 'confirmed' || mainStatus === 'shipped') && (
                                        <button 
                                            onClick={handleCancelOrder}
                                            disabled={isSubmitting}
                                            className={`flex-1 py-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl font-black uppercase text-[12px] tracking-wider transition-all ${isSubmitting ? 'opacity-50' : 'hover:bg-rose-100'}`}
                                        >
                                            {isSubmitting ? "Processing..." : "Cancel Order"}
                                        </button>
                                    )}
                                    {(isDelivered || isReturned) && (
                                        <>
                                            {canReturn && (
                                                <button 
                                                    onClick={() => setActiveModal('return')}
                                                    className="flex-1 py-4 border border-slate-300 bg-white text-slate-900 rounded-2xl font-black uppercase text-[12px] tracking-wider flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                                                >
                                                    <FaRotateLeft/> Return ({currentItem.return_days} Days Left)
                                                </button>
                                            )}
                                            
                                            {currentItem.is_reviewed ? (
                                                <div 
                                                    onClick={openReviewModal}
                                                    className="flex-1 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl cursor-pointer hover:bg-cyan-100 transition-all flex flex-col justify-center gap-2"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[11px] font-black uppercase text-cyan-700">
                                                            <FaCheck className="inline mr-1"/> Review Submitted
                                                        </span>
                                                        <div className="flex gap-0.5 text-amber-400 text-[14px]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} className={i < (currentItem.review_rating || 0) ? "text-amber-400" : "text-slate-300"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={openReviewModal}
                                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[12px] tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition-all"
                                                >
                                                    <FaStar/> Write a Review
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-5 space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaUser className="text-slate-400 text-sm"/>
                                        <h4 className="text-[12px] font-black uppercase text-slate-500 tracking-widest">Delivery Address</h4>
                                    </div>
                                    <p className="text-[13px] font-bold text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-[20px] border border-slate-100">{order.full_address}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaCreditCard className="text-slate-400 text-sm"/>
                                        <h4 className="text-[12px] font-black uppercase text-slate-500 tracking-widest">Payment Info</h4>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-50 p-5 rounded-[20px] border border-slate-100">
                                        <span className="text-[14px] font-black text-slate-900">{order.payment_method}</span>
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${order.payment_status === 'Paid' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[30px] overflow-hidden shadow-xl text-slate-900 relative border border-slate-100">
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 p-2 rounded-full">
                            <FaXmark size={18}/>
                        </button>
                        
                        <div className="p-8">
                            {activeModal === 'review' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black">{currentItem.is_reviewed ? "Update Your Review" : "Rate Product"}</h3>
                                    
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-colors ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}>
                                                <FaStar/>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <textarea 
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[14px] font-bold focus:ring-2 focus:ring-slate-900 outline-none h-32 resize-none" 
                                        placeholder="Tell us about the product quality..."
                                    ></textarea>
                                    
                                    {!currentItem.is_reviewed && (
                                        <div className="space-y-3">
                                            <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Add Photos</p>
                                            <div className="flex flex-wrap gap-2">
                                                <div onClick={() => fileInputRef.current.click()} className="w-16 h-16 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                                                    <FaCamera size={20}/>
                                                </div>
                                                {reviewFiles.map((file, i) => (
                                                    <div key={i} className="relative w-16 h-16 group">
                                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-xl border border-slate-200" alt="upload" />
                                                        <button onClick={() => removeReviewFile(i)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><FaXmark size={10}/></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input type="file" multiple hidden ref={fileInputRef} onChange={handleReviewFileChange} accept="image/*" />
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={handleReviewSubmit} 
                                            disabled={isSubmitting} 
                                            className={`flex-1 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[12px] tracking-widest shadow-md transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                                        >
                                            {isSubmitting ? "Processing..." : currentItem.is_reviewed ? "Update Review" : "Submit Review"}
                                        </button>
                                        
                                        {currentItem.is_reviewed && (
                                            <button 
                                                onClick={handleDeleteReview} 
                                                disabled={isSubmitting}
                                                className="px-6 py-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center"
                                            >
                                                <FaTrashCan size={18}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeModal === 'return' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-slate-900">Return Item</h3>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Reason for Return</label>
                                        <div className="relative">
                                            <select 
                                                value={returnReason}
                                                onChange={(e) => setReturnReason(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[14px] font-bold outline-none appearance-none focus:ring-2 focus:ring-slate-900"
                                            >
                                                <option value="" disabled>Select an issue...</option>
                                                <option value="wrong_item">Wrong product received</option>
                                                <option value="damaged">Damaged or defective</option>
                                                <option value="quality">Quality not as expected</option>
                                                <option value="missing">Product is missing parts</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Comments (Optional)</label>
                                        <textarea 
                                            value={returnComments}
                                            onChange={(e) => setReturnComments(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[14px] font-bold focus:ring-2 focus:ring-slate-900 outline-none h-24 resize-none" 
                                            placeholder="Provide more details about the issue..."
                                        ></textarea>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Add Condition Photos</p>
                                        <div className="flex flex-wrap gap-2">
                                            <div onClick={() => returnFileInputRef.current.click()} className="w-16 h-16 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                                                <FaCamera size={20}/>
                                            </div>
                                            {returnFiles.map((file, i) => (
                                                <div key={i} className="relative w-16 h-16 group">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-xl border border-slate-200" alt="upload" />
                                                    <button onClick={() => removeReturnFile(i)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><FaXmark size={10}/></button>
                                                </div>
                                            ))}
                                        </div>
                                        <input type="file" multiple hidden ref={returnFileInputRef} onChange={handleReturnFileChange} accept="image/*" />
                                    </div>

                                    <button 
                                        onClick={handleReturnSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[12px] tracking-widest shadow-md mt-6 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                                    >
                                        {isSubmitting ? "Processing..." : "Initiate Return"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isImageOpen && (
                <div className="fixed inset-0 z-[4000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setIsImageOpen(false)}>
                    <button className="absolute top-6 right-6 text-white hover:text-slate-200 transition-colors bg-white/10 p-3 rounded-full backdrop-blur-sm"><FaXmark size={24}/></button>
                    <img src={currentItem.product_image} alt="" className="max-w-full max-h-full object-contain rounded-2xl" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};

export default OrderDetails;