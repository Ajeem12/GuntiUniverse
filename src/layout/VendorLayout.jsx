import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../newspay/components/vendor/Sidebar";
import Topbar from "../newspay/components/vendor/Topbar";
import ScrollToTop from "../components/ScrollToTop";

const VendorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) setCollapsed(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <ScrollToTop />
      <Topbar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative  left-0 h-[calc(100vh-4rem)] 
            transition-all duration-300 z-30 bg-white
            ${collapsed ? "w-20" : "w-64"} 
            ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"}
            shadow-lg lg:shadow-none
          `}
        >
          <Sidebar
            collapsed={collapsed}
            onToggle={toggleSidebar}
            onMenuItemClick={closeSidebarOnMobile}
          />
        </aside>

        {/* Main content area */}
        <main
          className={`
            flex-1 overflow-auto transition-all duration-300 p-2
            bg-gray-50
          `}
        >
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  );
};

export default VendorLayout;