import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formType, setFormType] = useState("login"); // 'login', 'signup', 'forgotPassword'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      notifyError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      notifyError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifySuccess("Login successful!");
      navigate("/home");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      notifyError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      notifyError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      notifySuccess(
        "Account created! Please check your email for verification."
      );
      setFormType("login");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      notifySuccess("Google sign-in successful!");
      navigate("/home");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      notifyError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      notifySuccess("Password reset email sent! Check your inbox.");
      setFormType("login");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (formType) {
      case "signup":
        return (
          <form onSubmit={handleSignup} className="auth-form">
            <h2>Sign Up</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => setFormType("login")} className="auth-link">
                Login
              </span>
            </p>
          </form>
        );

      case "forgotPassword":
        return (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h2>Reset Password</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
            <p className="auth-switch">
              Remember your password?{" "}
              <span onClick={() => setFormType("login")} className="auth-link">
                Login
              </span>
            </p>
          </form>
        );

      default:
        return (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="google-button"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>

            <p className="auth-switch">
              <span
                onClick={() => setFormType("forgotPassword")}
                className="auth-link"
              >
                Forgot Password?
              </span>
            </p>

            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => setFormType("signup")} className="auth-link">
                Sign Up
              </span>
            </p>
          </form>
        );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <h1>resumemaker</h1>
          <p>Welcome to your new app</p>
        </div>
        {renderForm()}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
