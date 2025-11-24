import React, { useState } from "react";
import UserDashboardroute from "./usedashbordroute";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react"; // or any icon library you're using

const UserComponents = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`
                    fixed z-30 inset-y-0 left-0 transform 
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:relative md:z-auto md:flex 
                    ${collapsed ? "w-20" : "w-64"}
                `}
            >
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    onMobileClose={() => setMobileOpen(false)} // add this to Sidebar for mobile close
                />
            </div>

            {/* Overlay when sidebar is open in mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-opacity-30 z-20 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar with Mobile Menu Button */}
                <div className="md:hidden p-4 flex items-center justify-between">
                    <button onClick={() => setMobileOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Dashboard Route Content */}
                <main
                    className={`
                        flex-1 overflow-y-auto transition-all duration-300 
                        p-6
                        ${collapsed ? "md:ml-20" : ""}
                    `}
                >
                    <UserDashboardroute />
                </main>
            </div>
        </div>
    );
};

export default UserComponents;
