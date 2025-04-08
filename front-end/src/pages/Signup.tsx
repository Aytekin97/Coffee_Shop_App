import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { SignupRequest } from "../services/authService"; // Import the correct type
import "../styles/Auth.css";

const Signup: React.FC = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Properly typed event handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const signupData: SignupRequest = { first_name, last_name, email, password };
      await authService.signup(signupData); // Pass an object as required
      navigate("/login"); // Navigate to login on successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Signup</button>
        </form>
        <p className="auth-link">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="link-button">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
