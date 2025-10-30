import { PanelLeft, X, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { items } from "../../utils/constants/menuBar";
import ConfirmModal from "../common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {(!isCollapsed || isMobile) && (
          <img src={logo} alt="Steam Karnival" className="w-30 h-20" />
        )}
        <button
          onClick={closeSidebar}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden md:block"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className={`flex-1 ${isCollapsed ? "p-2" : "p-4"}`}>
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors
                ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
                ${
                  isActive
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span
                  className={`transition-all duration-500 whitespace-nowrap ${
                    isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.title}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="py-4 px-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 w-full px-3 py-2 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {(isMobile || !isCollapsed) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md shadow-lg md:hidden"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`
          flex flex-col h-screen bg-primary dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          fixed md:relative z-50
          ${
            isMobile
              ? `w-64 transform transition-transform duration-300 ${
                  isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : isCollapsed
              ? "w-16"
              : "w-64"
          }
        `}
      >
        <SidebarContent />
      </div>
      {showLogoutConfirm && (
        <ConfirmModal
          message="Are you sure you want to log out?"
          btnName="Logout"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
}
