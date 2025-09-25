import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, removeAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdNotificationsActive } from "react-icons/md";
import { setNotificationBox, setProfileDetail } from "../redux/slices/conditionSlice";
import axios from "axios";
import { toast } from "react-toastify";

const navMenu = [
  { name: "Home", path: "/", alwaysVisible: true },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Notes", path: "/notes" },
  { name: "Groups", path: "/groups" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const user = useSelector((store) => store.auth);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleLogoutToggle = () => setShowLogout(!showLogout);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(removeAuth());
        localStorage.removeItem("user");
        navigate("/signin");
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed!");
    }
  };

  const handleNotification = () => {
    dispatch(setNotificationBox(true));
  };

  const handleProfileDetail = () => {
    dispatch(setProfileDetail(true));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <Link to="/" onClick={handleScrollTop} className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl font-bold text-white">Campus Connect</span>
        </Link>

        {/* Desktop Nav Menu */}
        <nav className="hidden md:flex gap-6">
          {navMenu
            .filter((item) => item.alwaysVisible || user) // Home always visible, others only if logged in
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleScrollTop}
                className={`hover:text-blue-400 font-medium ${
                  location.pathname === item.path ? "text-blue-400" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 relative">
              {/* Notification Button */}
              <button
                onClick={handleNotification}
                className="text-white hover:text-blue-400"
                title="Notifications"
              >
                <MdNotificationsActive size={24} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleLogoutToggle}
                  className="flex items-center gap-2 text-white"
                >
                  <img
                    src={user?.profilePic || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-700"
                  />
                  {showLogout ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
                </button>

                {showLogout && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
                    <button
                      onClick={handleProfileDetail}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/signin"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={handleMenuToggle} className="md:hidden text-white">
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 p-4 flex flex-col gap-2">
          {navMenu
            .filter((item) => item.alwaysVisible || user)
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setMenuOpen(false);
                  handleScrollTop();
                }}
                className={`block py-2 hover:text-blue-400 ${
                  location.pathname === item.path ? "text-blue-400" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </header>
  );
};

export default Header;
