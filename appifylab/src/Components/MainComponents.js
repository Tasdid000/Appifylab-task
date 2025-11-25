import React from "react";
import Body from "./Body/Body";
import { useLocation } from "react-router-dom";
import Navbar from "./header/NavigationBar";

const MainComponents = () => {
  const location = useLocation();

  // Hide NavigationBar on /dashboard, /login, or /register
  const shouldHideNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Body />
    </div>
  );
};

export default MainComponents;

