import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, ChevronDown, Menu } from "lucide-react";
import { getCurrentUser } from "../api/authApi";

interface NavbarProps {
  toggleSidebar?: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-[80px] bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 hidden sm:block">
            Background Verification System
          </h1>
          <h1 className="text-xl font-bold text-gray-900 sm:hidden">
            BGV System
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
            Enterprise Verification Dashboard
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-5">
        {/* Mobile Search Button */}
        <button className="w-10 h-10 md:hidden bg-[#F5F7FB] border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
          <Search size={18} className="text-gray-600" />
        </button>

        {/* Notification */}
        <button className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F7FB] border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
          <Bell
            size={20}
            className="text-gray-600"
          />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 md:gap-3 hover:bg-gray-50 p-1 md:p-2 rounded-2xl transition-all outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-gray-900 font-semibold leading-tight">
                {currentUser?.full_name || currentUser?.username || "Admin User"}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Super Admin
              </p>
            </div>

            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#5B5FEF] flex items-center justify-center text-white font-bold shadow-sm">
              {(currentUser?.full_name || currentUser?.username || "A").charAt(0).toUpperCase()}
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50/50 transition-all text-left font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;