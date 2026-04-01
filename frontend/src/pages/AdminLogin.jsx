import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token); // temp
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-mark">TB</div>
        <h2>Admin Login</h2>
        <p className="login-subtitle">Sign in to manage TravelBharat content</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@travelbharat.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div><br></br>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div><br></br>
          <button
            type="submit"
            className="btn btn-primary btn-full login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="login-backlink">
          <Link to="/" className="login-backlink-anchor">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
