import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaStar, FaRegClock, FaPhoneAlt, FaPlus, FaMinus } from "react-icons/fa";
import Navbar from "../components/Navbar";

const OutletDetail = ({ user }) => {
  const { outletName } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const docRef = doc(db, "outlets", outletName.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRestaurant(data);
          setMenu(data.menu || []);
        } else {
          console.log("❌ No such restaurant found!");
        }
      } catch (error) {
        console.error("🔥 Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [outletName]);

  const addToCart = (item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.name]: prevCart[item.name] ? prevCart[item.name] + 1 : 1,
    }));
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      if (!prevCart[item.name]) return prevCart;
      const updatedCart = { ...prevCart };
      if (updatedCart[item.name] === 1) {
        delete updatedCart[item.name];
      } else {
        updatedCart[item.name] -= 1;
      }
      return updatedCart;
    });
  };

  if (loading) return <p className="loading">⏳ Loading menu...</p>;
  if (!restaurant) return <p className="error">❌ No restaurant found!</p>;

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar user={user} />

      <div className="outlet-container">
        <div className="content">
          <div className="restaurant-header">
            <h1>{restaurant.name}</h1>
            <p><FaPhoneAlt /> {restaurant.contact}</p>
            <p><FaRegClock /> {restaurant.timing}</p>
            <div className="rating">
              <FaStar color="gold" /> {restaurant.rating} ({restaurant.reviews} Reviews)
            </div>
          </div>

          <h2 className="order-title">📌 Order Online</h2>

          <div className="menu-list">
            {menu.length > 0 ? (
              menu.map((category, categoryIndex) => (
                <div key={categoryIndex} className="menu-category">
                  <h2 className="category-title">{category.category}</h2>
                  <div className="category-items">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="menu-item">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                        />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p className="price">₹{item.price}</p>
                        <div className="cart-controls">
                          <button onClick={() => removeFromCart(item)}>
                            <FaMinus />
                          </button>
                          <span>{cart[item.name] || 0}</span>
                          <button onClick={() => addToCart(item)}>
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-menu">⚠️ No menu available for this restaurant.</p>
            )}
          </div>
        </div>

        {/* ✅ Updated CSS Styles */}
        <style>{`
          .outlet-container {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            min-height: 100vh;
            padding-bottom: 20px;
            margin-top: 80px; /* ✅ Fix: Pushes container below navbar */
          }
          .loading, .error {
            text-align: center;
            font-size: 18px;
            color: #ff5722;
            margin-top: 20px;
          }
          .content {
            padding: 20px;
          }
          .restaurant-header {
            text-align: center;
            padding: 15px;
            border-bottom: 2px solid #ddd;
            background-color: #fff;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            margin-top: 2900px;
          }
          .restaurant-header h1 {
            margin-bottom: 10px;
          }
          .rating {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            font-size: 16px;
          }
          .order-title {
            text-align: center;
            font-size: 22px;
            margin-bottom: 15px;
            color: #ff5722;
          }
          .menu-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }
          .menu-category {
            background-color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          }
          .category-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            padding-bottom: 10px;
            border-bottom: 2px solid #ddd;
          }
          .category-items {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            margin-top: 10px;
          }
          .menu-item {
            width: 250px;
            border: 1px solid #ddd;
            border-radius: 8px;
            text-align: center;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }
          .menu-item:hover {
            transform: scale(1.05);
          }
          .menu-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 5px;
          }
          .price {
            font-weight: bold;
            font-size: 16px;
            margin-top: 5px;
          }
          .cart-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
          }
          .cart-controls button {
            background-color: #ff5722;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
          }
          .cart-controls span {
            margin: 0 10px;
            font-size: 16px;
            font-weight: bold;
          }
          .no-menu {
            text-align: center;
            font-size: 18px;
            color: #777;
            margin-top: 20px;
          }
        `}</style>
      </div>
    </>
  );
};

export default OutletDetail;
