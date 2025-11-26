import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>resumemaker Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="welcome-section">
          <h2>Welcome to resumemaker!</h2>
          <p>
            Your authentication is working perfectly. You are now logged in.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure Authentication</h3>
            <p>
              Firebase Authentication with email/password and Google sign-in
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Dashboard</h3>
            <p>Your personalized dashboard to manage your app data</p>
          </div>

          <div className="feature-card">
            <h3>☁️ Cloud Storage</h3>
            <p>Integrated with Firebase Firestore for real-time data</p>
          </div>

          <div className="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>Works seamlessly across desktop, tablet, and mobile devices</p>
          </div>
        </div>

        <div className="user-details">
          <h3>User Information</h3>
          <div className="user-detail-item">
            <strong>Email:</strong> {currentUser?.email}
          </div>
          <div className="user-detail-item">
            <strong>User ID:</strong> {currentUser?.uid}
          </div>
          <div className="user-detail-item">
            <strong>Email Verified:</strong>{" "}
            {currentUser?.emailVerified ? "Yes" : "No"}
          </div>
          <div className="user-detail-item">
            <strong>Account Created:</strong>{" "}
            {currentUser?.metadata.creationTime}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
