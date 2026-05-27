import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

function DashboardLayout({
  children,
}: Props) {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
    // Close sidebar on navigation on mobile
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Navbar */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;