import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Home,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LogOut,
    User,
    FolderOpen,
} from "lucide-react";
import useUserProfile from "./userprofilehookup";

export default function Sidebar({ collapsed, setCollapsed }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isOpen, setIsOpen] = useState(false);
    const { userData, loading, clearUserData } = useUserProfile();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        clearUserData();
        navigate("/");
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-full shadow-lg text-white hover:bg-blue-500"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            <motion.aside
                initial={{ x: isMobile ? "-100%" : 0, width: "16rem" }}
                animate={{
                    x: isMobile && !isOpen ? "-100%" : 0,
                    width: collapsed ? "6rem" : "16rem",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`fixed h-full bg-gradient-to-b from-gray-900 to-gray-800 text-gray-50 flex flex-col p-4 shadow-xl border-r border-gray-700 backdrop-blur-lg
                ${isMobile ? "z-40" : ""}`}
            >
                {!isMobile && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute top-5 right-[-15px] transition-all duration-300 bg-gray-700 hover:bg-blue-500 text-gray-50 p-2 rounded-full shadow-lg"
                    >
                        {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                    </button>
                )}

                <nav className="w-full">
                    <NavItem
                        icon={<Home size={22} />}
                        text="Home"
                        path="/"
                        collapsed={collapsed && !isMobile}
                    />
                    <NavItem
                        icon={<User size={22} />}
                        text="Profile"
                        path="/dashboard/userprofile"
                        collapsed={collapsed && !isMobile}
                    />
                    <NavItem
                        icon={<FolderOpen  size={22} />}
                        text="Feed"
                        path="/dashboard/own-feed"
                        collapsed={collapsed && !isMobile}
                    />
                </nav>

                <div className="mt-auto w-full">
                    {loading ? (
                        <p className="text-sm text-gray-300">Loading...</p>
                    ) : userData ? (
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-blue-500 hover:text-gray-50
                            ${collapsed && !isMobile ? "justify-center w-12 h-12" : "w-full"}`}
                        >
                            <motion.div className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-gray-50">
                                <LogOut size={22} />
                            </motion.div>
                            <motion.span
                                animate={{ opacity: collapsed && !isMobile ? 0 : 1, width: collapsed && !isMobile ? 0 : "auto" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className={`whitespace-nowrap overflow-hidden ${collapsed && !isMobile ? "hidden" : "block"}`}
                            >
                                Log Out
                            </motion.span>
                        </button>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-blue-400">
                            Log in &rarr;
                        </Link>
                    )}
                </div>
            </motion.aside>

            {isMobile && isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
            )}
        </>
    );
}

function NavItem({ icon, text, path, collapsed }) {
    return (
        <Link
            to={path}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-blue-500 hover:text-gray-50
                ${collapsed ? "justify-center w-12 h-12" : "w-full"}`}
        >
            <motion.div className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-gray-50">
                {icon}
            </motion.div>
            <motion.span
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`whitespace-nowrap overflow-hidden ${collapsed ? "hidden" : "block"}`}
            >
                {text}
            </motion.span>
        </Link>
    );
}