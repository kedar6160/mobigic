import React from "react";
import "../styles/LoginForm.css";

const LoginForm = ({ username, setUsername, password, setPassword, registerUser, loginUser }) => (
  <>
    <h4 className="text-white">Login</h4>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="form-control mb-3"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="form-control mb-3"
    />
    <div className="d-flex gap-2">
    <button onClick={loginUser} className="btn btn-success btn-block  border border-dark">Login</button>
    <button onClick={registerUser} className="btn btn-primary btn-block  border border-dark">Register</button>
    </div>
  </>
);

export default LoginForm;
