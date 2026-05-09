import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const menuItems = [
  { id: "personal", label: "Personal Information", icon: <PersonOutlineIcon /> },
  { id: "address", label: "Manage Address", icon: <LocationOnOutlinedIcon /> },
  { id: "wallet", label: "My Wallet", icon: <AccountBalanceWalletOutlinedIcon /> },
  { id: "about", label: "About Us", icon: <InfoOutlinedIcon /> },
  { id: "privacy", label: "Privacy Policy", icon: <SecurityOutlinedIcon /> },
  { id: "terms", label: "Terms & Conditions", icon: <GavelOutlinedIcon /> },
  { id: "logout", label: "Logout", icon: <LogoutOutlinedIcon />, isDanger: true },
  { id: "delete", label: "Delete Account", icon: <DeleteOutlineIcon />, isDanger: true },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="p-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] flex flex-col gap-1.5 w-full h-fit">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        
        let btnClass = "group flex items-center gap-5 w-full px-6 py-4 rounded-[var(--radius-md)] font-bold text-lg transition-all duration-300 text-left border-l-[5px] ";
        let iconClass = "flex items-center justify-center transition-colors scale-125 ";

        if (item.isDanger) {
          if (isActive) {
            btnClass += "bg-[var(--danger)]/10 border-[var(--danger)] text-[var(--danger)]";
            iconClass += "text-[var(--danger)]";
          } else {
            btnClass += "border-transparent text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:border-[var(--danger)] hover:text-[var(--danger)]";
            iconClass += "text-[var(--danger)]/70 group-hover:text-[var(--danger)]";
          }
        } else {
          if (isActive) {
            btnClass += "bg-[var(--bg-soft)] border-[var(--primary)] text-[var(--primary)]";
            iconClass += "text-[var(--primary)]";
          } else {
            btnClass += "border-transparent text-[var(--text-main)] hover:bg-[var(--bg-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]";
            iconClass += "text-[var(--text-muted)] group-hover:text-[var(--primary)]";
          }
        }

        return (
          <button
            key={item.id}
            className={btnClass}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={iconClass}>
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