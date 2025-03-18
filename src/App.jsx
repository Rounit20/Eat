import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserData from "./pages/UserData";
import Outlets from "./pages/Outlets";
import OutletDetail from "./pages/OutletDetail";
import Cart from "./pages/Cart";  // ✅ Import Cart page
import PrivateRoute from "./components/PrivateRoute";  // ✅ Import PrivateRoute
import Navbar from "./components/Navbar";

function App() {
  const [user, loading] = useAuthState(auth);

  // ✅ Global cart state to persist cart data across pages
  const [cart, setCart] = useState({});

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar user={user} />

      {/* ✅ Main content wrapper */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/outlets" element={<Outlets />} />
          <Route 
            path="/outlets/:outletName" 
            element={<OutletDetail user={user} cart={cart} setCart={setCart} />} 
          />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />  {/* ✅ Public cart route */}

          {/* ✅ Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/user" element={<UserData />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
