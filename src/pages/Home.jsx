import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div>
      <h1>Welcome to EatBit</h1>
      <p>This is the home page.</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/user")}>Profile</button>
    </div>
  );
};

export default Home;
