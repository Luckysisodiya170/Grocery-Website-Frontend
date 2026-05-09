import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { getProfileDetails } from "../../../utils/profileApi";

function HeaderSearch() {
    const location = useLocation();
    const [selectedLocation, setSelectedLocation] = useState("Select Location");

    if (location.pathname === "/search") {
        return null;
    }

    useEffect(() => {
        const fetchAddr = async () => {
            try {
                const res = await getProfileDetails();
                if (res?.success && res.data.addresses) {
                    const defaultAddr = res.data.addresses.find(a => a.is_default) || res.data.addresses[0];
                    if (defaultAddr) setSelectedLocation(`${defaultAddr.city}, ${defaultAddr.pincode}`);
                }
            } catch (err) {}
        };
        fetchAddr();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-1.5 pr-5 bg-[var(--bg)] border border-[var(--border)] rounded-full min-w-full lg:min-w-[280px]">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--secondary)] shrink-0 shadow-sm">
                    <LocationOnIcon fontSize="small" />
                </div>
                <div className="flex flex-col items-start text-left overflow-hidden">
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Delivering to</span>
                    <strong className="text-sm font-black text-[var(--primary)] truncate w-40">{selectedLocation}</strong>
                </div>
            </div>

            <Link 
                to="/search"
                className="flex-1 flex items-center gap-3 px-5 h-14 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] shadow-[var(--shadow-sm)] cursor-text w-full group hover:border-[var(--primary)] transition-all decoration-none"
            >
                <SearchIcon className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                <span className="text-[var(--text-muted)] font-medium">Search for fresh spinach, milk...</span>
            </Link>
        </div>
    );
}

export default HeaderSearch;