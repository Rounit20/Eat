import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPopupVisible && !event.target.closest(".user-profile")) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupVisible]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "white",
        padding: "0 1rem",
        height: "75px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        zIndex: 1000,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <div className="navbar-brand" style={{ display: "flex", alignItems: "center" }}>
        <Link to="/home">
          <img
            src="/eatbit-logo-dark.png"
            alt="EatBit Logo"
            className="navbar-logo"
            style={{ height: "80px", width: "auto" }}
          />
        </Link>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="user-profile" style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <FaUserCircle
            size={40}
            color="#555"
            style={{ cursor: "pointer", marginRight: "40px" }}
            onClick={togglePopup}
          />

          {/* User Dropdown */}
          <div
            className="popup"
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              backgroundColor: "white",
              padding: "1rem",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              zIndex: 1000,
              minWidth: "200px",
              textAlign: "center",
              opacity: isPopupVisible ? 1 : 0,
              transform: isPopupVisible ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: isPopupVisible ? "auto" : "none",
            }}
          >
            <h6 style={{ margin: "0", color: "#555", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden" }}>
              {user.displayName || "User"}
            </h6>

            <p style={{ margin: "5px 0", fontSize: "12px", color: "#777" }}>{user.email}</p>

            <hr style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", margin: "10px 0" }} />

            {/* Profile Button */}
            <button
              onClick={() => navigate("/user")}
              style={{
                padding: "8px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: "8px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
