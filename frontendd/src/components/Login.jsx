import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ✅ Read response as text for debugging
      const text = await response.text();
      console.log("Server Response:", text);

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // ✅ Redirect to Budget Planner
      navigate("/budget");

    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>} {/* Show error if any */}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
