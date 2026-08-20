import {
  LayoutDashboard,
  Users,
  FileCheck,
  Upload,
  FileText,
  ShieldAlert,
  Settings,
  BarChart3,
  Bell,
  UserCog,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../assets/logo.png";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    if (path === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/";
    }
    
    // Verification Center + all verification modules
    if (path === "/verification") {
      return (
        currentPath.startsWith("/verification") &&
        !currentPath.startsWith("/verification/queue")
      );
    }
    
    // For candidates (includes add-candidate / profile details)
    if (path === "/candidates") {
      return currentPath.startsWith("/candidates") || currentPath.startsWith("/add-candidate");
    }
    
    return currentPath.startsWith(path);
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Candidates", path: "/candidates", icon: Users },
    { label: "Uploads", path: "/uploads", icon: Upload },
    { label: "Verification Queue", path: "/verification/queue", icon: FileCheck },
    { label: "Verification Center", path: "/verification", icon: FileCheck },
    
    { label: "Reports", path: "/reports", icon: FileText },
    { label: "Fraud Center", path: "/fraud-center", icon: ShieldAlert },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
    { label: "Audit Logs", path: "/audit-logs", icon: ShieldAlert },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "User Management", path: "/user-management", icon: UserCog },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 md:relative w-[280px] bg-[#0B1220] border-r border-[#1E293B] flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain flex-shrink-0" />
              <h1 className="text-white text-2xl font-bold whitespace-nowrap">BGV System</h1>
            </div>
            {/* Close Button on Mobile */}
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsOpen?.(false)}
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-400 mt-2 text-[13px] pl-7 md:pl-1">Enterprise Verification Platform</p>
        </div>

        {/* Navigation */}
        <div className="p-5 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  active
                    ? "bg-[#5B5FEF] text-white shadow-lg shadow-[#5B5FEF]/10"
                    : "text-gray-300 hover:bg-[#111827] hover:text-white"
                }`}
              >
                <Icon size={22} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
    </>
  );
}

export default Sidebar;