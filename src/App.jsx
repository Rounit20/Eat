import React from "react";
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
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar"; // ✅ Ensure Navbar gets user prop

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar user={user} /> {/* ✅ Pass user to Navbar */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/outlets" element={<Outlets />} /> 
        <Route path="/outlets/:outletName" element={<OutletDetail user={user} />} /> {/* ✅ Pass user to OutletDetail */}

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<UserData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
