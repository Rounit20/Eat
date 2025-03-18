import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const Cart = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [salesTax, setSalesTax] = useState(0);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(savedCart);
  }, []);

  // ✅ Calculate total price and tax
  useEffect(() => {
    let subtotal = 0;
    Object.keys(cart).forEach((itemName) => {
      const item = cart[itemName];
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.1; // 10% sales tax
    setTotal(subtotal + tax);
    setSalesTax(tax);
  }, [cart]);

  // ✅ Handle cart operations and update localStorage
  const handleQuantityChange = (itemName, change) => {
    const newCart = { ...cart };

    if (newCart[itemName]) {
      newCart[itemName].quantity += change;

      if (newCart[itemName].quantity <= 0) {
        delete newCart[itemName];  // Remove item when quantity is 0
      }
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));  // ✅ Sync with localStorage
  };

  const handleCheckout = () => {
    alert("Proceeding to Checkout!");
    navigate("/checkout");
  };

  if (Object.keys(cart).length === 0) {
    return (
      <div className="empty-cart">
        <Navbar user={user} />
        <h2>Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />

      <div className="cart-container">
        <h1>Your Cart ({Object.keys(cart).length} items)</h1>

        <div className="cart-items">
          <div className="cart-header">
            <span>Item</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {Object.keys(cart).map((itemName, index) => {
            const item = cart[itemName];

            return (
              <div key={index} className="cart-item">
                <div className="item-info">
                  <img src={item.image || "https://via.placeholder.com/100"} alt={itemName} />
                  <div>
                    <h3>{itemName}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>

                <div className="item-price">₹{item.price.toFixed(2)}</div>

                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(itemName, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(itemName, 1)}>+</button>
                </div>

                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-details">
            <p>Subtotal: <span>₹{(total - salesTax).toFixed(2)}</span></p>
            <p>Sales Tax: <span>₹{salesTax.toFixed(2)}</span></p>
            <hr />
            <h2>Grand Total: <span>₹{total.toFixed(2)}</span></h2>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </div>

        {/* ✅ CSS Styling */}
        <style>{`
          .cart-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          h1 {
            text-align: center;
            font-size: 28px;
            margin-bottom: 30px;
          }

          .cart-items {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .cart-header {
            display: grid;
            grid-template-columns: 4fr 1fr 2fr 2fr;
            font-weight: bold;
            border-bottom: 2px solid #ddd;
            padding: 10px;
            color: #555;
          }

          .cart-item {
            display: grid;
            grid-template-columns: 4fr 1fr 2fr 2fr;
            align-items: center;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            transition: transform 0.3s;
          }

          .cart-item:hover {
            transform: translateY(-5px);
          }

          .item-info {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .item-info img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
          }

          .item-info h3 {
            margin: 0;
            font-size: 18px;
          }

          .item-info p {
            color: #555;
            font-size: 14px;
          }

          .item-price, .item-total {
            font-size: 16px;
            color: #333;
          }

          .quantity-control {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .quantity-control button {
            background: #ff5722;
            color: #fff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
          }

          .quantity-control span {
            font-size: 18px;
          }

          .cart-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 40px;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .summary-details p {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
          }

          .checkout-btn {
            background: #4caf50;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s;
          }

          .checkout-btn:hover {
            background: #45a049;
          }

          .empty-cart {
            text-align: center;
            margin-top: 100px;
          }

          .empty-cart h2 {
            font-size: 24px;
          }
        `}</style>
      </div>
    </>
  );
};

export default Cart;
