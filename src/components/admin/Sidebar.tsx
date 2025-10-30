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
        setIsCollapsed(true);
        setIsMobileOpen(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setIsMobileOpen(!isMobileOpen);
    else setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleNavClick = () => {
    if (isMobile) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <img src={logo} alt="Steam Karnival" className="w-30 h-20" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobile ? <X /> : <PanelLeft />}
        </button>
      </div>
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              onClick={handleNavClick}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors
                ${isCollapsed && !isMobile ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-primary-light text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`transition-opacity whitespace-nowrap ${
                  isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 w-full px-3 py-2 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      <div
        className={`flex flex-col h-screen bg-primary border-r transition-all duration-300
        fixed md:relative z-50
        ${
          isMobile
            ? `transform transition-transform duration-300 ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              } w-64`
            : isCollapsed
            ? "w-16"
            : "w-64"
        }`}
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
