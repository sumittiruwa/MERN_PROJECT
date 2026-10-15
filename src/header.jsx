import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cross,
  ArrowRight,
  X,
  UserRound,
  LockKeyhole,
  Mail,
  Building2,
  LogOut,
} from "lucide-react";
import "./Header.css";

const API_URL = "http://localhost:5000/api";

export default function Header() {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("user");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pharmaUser")) || null;
    } catch {
      return null;
    }
  });

  function openModal(type) {
    setModal(type);
    setMessage("");
    setAccountType("user");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (modal === "signup" && accountType === "pharmacy") {
      setModal(null);
      navigate("/register-pharmacy");
      return;
    }

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const endpoint =
      modal === "signup" ? "/auth/register" : "/auth/login";

    if (modal === "signup") {
      payload.name = formData.get("name");
    } else {
      payload.role = accountType;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      localStorage.setItem("pharmaToken", data.token);
      localStorage.setItem("pharmaUser", JSON.stringify(data.user));

      setCurrentUser(data.user);
      setModal(null);
      setMessage("");

      if (data.user.role === "pharmacy") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage(
        "Cannot connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("pharmaToken");
    localStorage.removeItem("pharmaUser");

    setCurrentUser(null);
    setModal(null);
    setMessage("");

    navigate("/");
  }

  return (
    <>
      <header className="user-header">
        <Link to="/" className="user-brand" aria-label="Pharma home">
          <span className="user-brand-icon">
            <Cross size={25} strokeWidth={3} />
          </span>

          <span>
            pharma<span className="brand-dot">.</span>
            <small>YOUR HEALTH, OUR PRIORITY</small>
          </span>
        </Link>

        <nav className="user-nav" aria-label="Main navigation">
          <Link className="nav-current" to="/">
            Home
          </Link>

          <Link to="/#results">Find medicines</Link>
          <Link to="/#how-it-works">How it works</Link>
        </nav>

        <div className="user-header-actions">
          {currentUser?.role === "pharmacy" ? (
            <Link
              to="/dashboard"
              className="register-pharmacy-button"
            >
              <Building2 size={17} />
              Dashboard
            </Link>
          ) : !currentUser ? (
            <Link
              to="/register-pharmacy"
              className="register-pharmacy-button"
            >
              <Building2 size={17} />
              Register Pharmacy
            </Link>
          ) : null}

          {currentUser ? (
            <>
              <span className="header-user-name">
                <UserRound size={17} />
                {currentUser.name}
              </span>

              <button
                className="user-login-button"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="user-login-button"
                type="button"
                onClick={() => openModal("login")}
              >
                Login
              </button>

              <button
                className="user-signup-button"
                type="button"
                onClick={() => openModal("signup")}
              >
                Sign up <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      {modal && (
        <div
          className="auth-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              setModal(null);
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <button
              type="button"
              className="auth-modal-close"
              onClick={() => !loading && setModal(null)}
              aria-label="Close form"
              disabled={loading}
            >
              <X size={21} />
            </button>

            <div className="auth-modal-brand">
              <span className="user-brand-icon">
                <Cross size={23} strokeWidth={3} />
              </span>
            </div>

            <p className="auth-eyebrow">WELCOME TO PHARMA</p>

            <h2 id="auth-modal-title">
              {modal === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="auth-description">
              {modal === "login"
                ? "Log in to access your Pharma account."
                : "Create an account to save searches and manage reservations."}
            </p>

            <div className="auth-mode-switch">
              <button
                type="button"
                className={modal === "login" ? "selected" : ""}
                onClick={() => openModal("login")}
              >
                Login
              </button>

              <button
                type="button"
                className={modal === "signup" ? "selected" : ""}
                onClick={() => openModal("signup")}
              >
                Sign up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {modal === "signup" && (
                <label>
                  Full name
                  <span className="auth-input-wrap">
                    <UserRound size={17} />
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </span>
                </label>
              )}

              <label>
                Email address
                <span className="auth-input-wrap">
                  <Mail size={17} />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label>
                Password
                <span className="auth-input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    name="password"
                    type="password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    autoComplete={
                      modal === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    required
                  />
                </span>
              </label>

              <label>
                Account type
                <select
                  value={accountType}
                  onChange={(event) =>
                    setAccountType(event.target.value)
                  }
                  required
                >
                  <option value="user">Customer / Medicine finder</option>
                  <option value="pharmacy">Pharmacy owner</option>
                </select>
              </label>

              <button
                className="auth-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : modal === "login"
                    ? "Login to Pharma"
                    : accountType === "pharmacy"
                      ? "Continue to pharmacy registration"
                      : "Create account"}

                {!loading && <ArrowRight size={17} />}
              </button>

              {message && (
                <p className="auth-message" role="alert">
                  {message}
                </p>
              )}
            </form>

            <p className="auth-legal">
              By continuing, you agree to use accurate account information.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
