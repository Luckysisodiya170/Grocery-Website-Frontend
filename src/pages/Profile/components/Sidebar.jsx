import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const menuItems = [
  { id: "personal", label: "Personal Information", icon: <PersonOutlineIcon /> },
  { id: "address", label: "Manage Address", icon: <LocationOnOutlinedIcon /> },
  { id: "wallet", label: "My Wallet", icon: <AccountBalanceWalletOutlinedIcon /> },
  { id: "password", label: "Password Manager", icon: <LockOutlinedIcon /> },
  { id: "about", label: "About Us", icon: <InfoOutlinedIcon /> },
  { id: "privacy", label: "Privacy Policy", icon: <SecurityOutlinedIcon /> },
  { id: "terms", label: "Terms & Conditions", icon: <GavelOutlinedIcon /> },
  { id: "logout", label: "Logout", icon: <LogoutOutlinedIcon /> },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="p-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] flex flex-col gap-1.5 w-full min-h-[500px]">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`group flex items-center gap-5 w-full px-6 py-4 rounded-[var(--radius-md)] font-bold text-lg transition-all duration-300 text-left border-l-[5px] ${
              isActive 
                ? "bg-[var(--bg-soft)] border-[var(--primary)] text-[var(--primary)]" 
                : "border-transparent text-[var(--text-main)] hover:bg-[var(--bg-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={`flex items-center justify-center transition-colors scale-125 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default Sidebar;