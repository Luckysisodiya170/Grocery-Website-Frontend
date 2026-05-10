import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, Link, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddIcon from "@mui/icons-material/Add";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

import { getProfileDetails } from "../../../utils/profileApi";
import { addAddress } from "../../../utils/addressApi";

function HeaderSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState("Select Location");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    
    // Naya state Live Indicator ke liye
    const [isLiveLocation, setIsLiveLocation] = useState(false);

    const token = localStorage.getItem("token") || localStorage.getItem("refreshToken");
    const isLoggedIn = !!token;

    const initialForm = { 
        address_name: "Home", contact_person_name: "", contact_phone: "", 
        address_line_1: "", city: "", state: "", pincode: "", country: "India" 
    };
    const [formData, setFormData] = useState(initialForm);

    // Geolocation options for exact GPS location
    const geoOptions = {
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
    };

    if (location.pathname === "/search") return null;

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserAddresses();
        } else {
            askInitialPermission();
        }
    }, [isLoggedIn]);

    const fetchUserAddresses = async () => {
        try {
            const res = await getProfileDetails();
            if (res?.success) {
                const addrs = res.data.addresses || [];
                setAddresses(addrs);
                const def = addrs.find(a => a.is_default) || addrs[0];
                if (def) {
                    setSelectedLocation(`${def.city}, ${def.pincode}`);
                    setIsLiveLocation(false); // Saved address hai, live nahi
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const askInitialPermission = () => {
        if (!navigator.geolocation) return;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchReverseGeocode(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setSelectedLocation("Select Location");
                setIsLiveLocation(false);
            },
            geoOptions // Pass high accuracy options
        );
    };

    const fetchReverseGeocode = async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            
            if (data && data.address) {
                const addr = data.address;
                const locName = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || addr.state || "Location Fetched";
                const pin = addr.postcode || "";
                setSelectedLocation(pin ? `${locName}, ${pin}` : locName);
                setIsLiveLocation(true); // Successfully fetched live location
            } else {
                setSelectedLocation("Location Fetched");
                setIsLiveLocation(true);
            }
        } catch (err) {
            setSelectedLocation("Location Fetched");
        }
    };

    const handleUseCurrent = () => {
        setIsLocating(true);

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchReverseGeocode(position.coords.latitude, position.coords.longitude);
                setIsLocating(false);
                setIsModalOpen(false);
            },
            (error) => {
                toast.error(error.message || "Failed to fetch live location");
                setIsLocating(false);
            },
            geoOptions // Exact GPS pin-point location ke liye
        );
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await addAddress(formData);
            if (res.success) {
                toast.success("Address Added");
                setShowAddForm(false);
                fetchUserAddresses();
            }
        } catch (err) {
            toast.error("Failed to add address");
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full animate-in fade-in">
                <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 p-1.5 pr-5 bg-[var(--bg)] border border-[var(--border)] rounded-full min-w-full lg:min-w-[280px] cursor-pointer hover:border-[var(--primary)] transition-all">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--secondary)] shrink-0 shadow-sm relative">
                        <LocationOnIcon fontSize="small" />
                        {/* Live Location Pulsing Dot */}
                        {isLiveLocation && (
                            <span className="absolute top-0 right-0 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white"></span>
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col items-start text-left overflow-hidden">
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                            {isLiveLocation ? "Live Location" : "Delivering to"}
                        </span>
                        <strong className="text-sm font-black text-[var(--primary)] truncate w-40">{selectedLocation}</strong>
                    </div>
                </div>

                <Link to="/search" className="flex-1 flex items-center gap-3 px-5 h-14 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] w-full group hover:border-[var(--primary)] transition-all decoration-none">
                    <SearchIcon className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                    <span className="text-[var(--text-muted)] font-medium">Search for groceries...</span>
                </Link>
            </div>

            {/* Modal Components Below remain mostly exactly the same */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" onClick={() => setIsModalOpen(false)}>
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>

                    <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 rounded-t-[40px]">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Select Location</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            <button onClick={handleUseCurrent} disabled={isLocating} className="w-full flex items-center gap-4 p-5 rounded-3xl bg-cyan-900 text-white hover:bg-cyan-950 shadow-lg shadow-cyan-900/20 transition-all shrink-0 disabled:opacity-70 relative overflow-hidden">
                                <MyLocationIcon className={isLocating ? "animate-spin" : ""} /> 
                                <span className="font-black text-sm uppercase tracking-widest text-left">
                                    {isLocating ? "Locating..." : "Use Live Location"}
                                </span>
                            </button>

                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Saved Addresses</h3>
                                {isLoggedIn ? (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} onClick={() => { setSelectedLocation(`${addr.city}, ${addr.pincode}`); setIsLiveLocation(false); setIsModalOpen(false); }} className="flex items-start gap-4 p-5 rounded-[28px] border border-slate-100 hover:border-cyan-900 hover:bg-slate-50 cursor-pointer transition-all group">
                                                <div className="mt-1 text-cyan-900 group-hover:scale-110 transition-transform">
                                                    {addr.address_name === "Home" ? <HomeOutlinedIcon /> : addr.address_name === "Office" ? <BusinessOutlinedIcon /> : <FmdGoodOutlinedIcon />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800 text-sm uppercase">{addr.address_name}</span>
                                                    <p className="text-xs font-bold text-slate-500 line-clamp-1">{addr.address_line_1}, {addr.city}</p>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {!showAddForm && (
                                            <button onClick={() => setShowAddForm(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-400 font-bold text-sm hover:border-cyan-900 hover:text-cyan-900 transition-all">
                                                + Add New Address
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold text-xs uppercase mb-4 tracking-tighter">Login to see saved addresses</p>
                                        <button onClick={() => { setIsModalOpen(false); setShowAuthModal(true); }} className="text-cyan-900 font-black text-sm underline">Login Now</button>
                                    </div>
                                )}
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddAddress} className="space-y-4 p-5 border border-slate-100 rounded-[32px] bg-slate-50 animate-in slide-in-from-top-4">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Address</span>
                                        <button type="button" onClick={() => setShowAddForm(false)} className="text-xs font-bold text-rose-500">Cancel</button>
                                    </div>
                                    <input placeholder="Receiver Name" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm" onChange={e => setFormData({...formData, contact_person_name: e.target.value})} required />
                                    <input placeholder="House / Street Name" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm" onChange={e => setFormData({...formData, address_line_1: e.target.value})} required />
                                    <div className="flex gap-2">
                                        <input placeholder="City" className="flex-1 p-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm" onChange={e => setFormData({...formData, city: e.target.value})} required />
                                        <input placeholder="Pin" className="w-24 p-4 bg-white rounded-2xl border border-slate-100 outline-none font-bold text-sm" onChange={e => setFormData({...formData, pincode: e.target.value})} required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Save & Deliver Here</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showAuthModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAuthModal(false)}>
                    <div className="bg-white rounded-[40px] p-8 max-w-[350px] w-full text-center shadow-2xl animate-in zoom-in-90" onClick={e => e.stopPropagation()}>
                        <div className="w-20 h-20 bg-cyan-900/10 text-cyan-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LocationOnIcon style={{ fontSize: '40px' }} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Login Required</h3>
                        <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed px-2">To save addresses and get live location tracking, please login to your account.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => navigate("/login")} className="w-full py-4 bg-cyan-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Login Now</button>
                            <button onClick={() => setShowAuthModal(false)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px]">Maybe Later</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default HeaderSearch;