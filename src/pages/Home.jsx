import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Default user icon

const Home = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [isPopupVisible, setPopupVisible] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

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

  const faqs = [
    { question: "What is your return policy?", answer: "You can return any item within 30 days of purchase." },
    { question: "How do I track my order?", answer: "You can track your order through the 'My Orders' section." },
    { question: "Do you offer international shipping?", answer: "Yes, we ship to most countries worldwide." },
  ];

  return (
    <>
      <div
        className="app-container"
        style={{
          backgroundColor: "white",
          paddingTop: "75px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
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

          {/* User Profile */}
          {user && (
            <div className="user-profile" style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <FaUserCircle
                size={40}
                color="#555"
                style={{ cursor: "pointer", marginRight: "40px" }} 
                onClick={togglePopup}
              />

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

        <div style={{ flexGrow: 1 }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "900",
              position: "absolute",
              margin: "20px 3%",
              top: "10%",
              left: "20px",
            }}
          >
            Existing Outlets
          </h1>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "900",
              position: "absolute",
              margin: "20px 3%",
              top: "50%",
              left: "20px",
            }}
          >
            Popular Categories
          </h1>

          <div
            className="faqs"
            style={{
              position: "absolute",
              backgroundColor: "rgb(8, 2, 57)",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              width: "60%",
              color: "white",
              top: "80%",
              left: "50%",
              transform: "translateX(-50%)",
              height: "200px",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Frequently Asked Questions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ fontWeight: "bold" }}>Questions</div>
              <div style={{ fontWeight: "bold" }}>Answers</div>
              {faqs.map((faq, index) => (
                <React.Fragment key={index}>
                  <div>{faq.question}</div>
                  <div>{faq.answer}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
