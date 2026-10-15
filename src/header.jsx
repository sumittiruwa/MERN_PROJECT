import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cross,
  ArrowRight,
  X,
  UserRound,
  LockKeyhole,
  Mail,
  Building2,
} from "lucide-react";
import "./Header.css";

export default function Header() {
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");

  function openModal(type) {
    setModal(type);
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      modal === "login"
        ? "Login submitted. Backend authentication is not connected yet."
        : "Signup submitted. Backend registration is not connected yet."
    );
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
          <Link
            to="/register-pharmacy"
            className="register-pharmacy-button"
          >
            <Building2 size={17} />
            Register Pharmacy
          </Link>

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
        </div>
      </header>

      {modal && (
        <div
          className="auth-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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
              onClick={() => setModal(null)}
              aria-label="Close form"
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
                ? "Log in to manage your medicine searches and reservations."
                : "Sign up to save your searches and manage medicine reservations."}
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
                    required
                  />
                </span>
              </label>

              {modal === "signup" && (
                <label>
                  Account type
                  <select name="role" defaultValue="user" required>
                    <option value="user">
                      Medicine finder / Customer
                    </option>
                    <option value="pharmacy">
                      Pharmacy owner
                    </option>
                  </select>
                </label>
              )}

              <button className="auth-submit-button" type="submit">
                {modal === "login"
                  ? "Login to Pharma"
                  : "Create account"}
                <ArrowRight size={17} />
              </button>

              {message && (
                <p className="auth-message" role="status">
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