import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [user] = useAuthState(auth); // Firebase hook to get the current user
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  // Calculate total amount, sales tax, and grand total
  const totalAmount = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const salesTax = totalAmount * 0.1;
  const grandTotal = totalAmount + salesTax;

  // Fetch user data from Firestore when user is logged in
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]); // Fetch only when user changes

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place your order.");
      return;
    }

    try {
      alert("🎉 Order placed successfully!");
      setCart({}); // Clear the cart after placing the order
      navigate("/home"); // Redirect to home page instead of logging out
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className="checkout-container">
        <h1>🧾 Checkout</h1>

        <div className="checkout-grid">
          <div className="card">
            <h2>🧺 Order Summary</h2>
            {Object.entries(cart).map(([name, item], idx) => (
              <div key={idx} className="order-item">
                <span>{name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <p><strong>Subtotal:</strong> ₹{totalAmount.toFixed(2)}</p>
            <p><strong>Sales Tax (10%):</strong> ₹{salesTax.toFixed(2)}</p>
            <h3>Total: ₹{grandTotal.toFixed(2)}</h3>
          </div>

          <div className="card">
            <h2>👤 Verify Your Details</h2>
            {userData ? (
              <div className="details">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Gender:</strong> {userData.gender}</p>
                <p><strong>Mobile No.:</strong> {userData.mobile}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Roll No.:</strong> {userData.rollNo}</p>
                <p><strong>Hostel No.:</strong> {userData.hostelNo}</p>
                <p><strong>Address:</strong> {userData.address}</p>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          ✅ Place Order
        </button>
      </div>

      <style>{`
        .checkout-container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
          font-family: sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 0 8px rgba(0,0,0,0.05);
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }

        .details p {
          margin: 6px 0;
        }

        .place-order-btn {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .place-order-btn:hover {
          background-color: #45a049;
        }
      `}</style>
    </>
  );
};

export default Checkout;
