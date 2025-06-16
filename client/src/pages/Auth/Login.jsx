import "./Auth.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loading from "../../components/Loading/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, forgotPassword } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password, navigate, setError, setLoading);
  };

  const handleForgotPassword = async () => {
    forgotPassword(email, navigate, setError, setLoading);
  };

  return (
    <div className="auth-container">
      {loading && <Loading />}
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        type="button"
        className="auth-link-button"
        style={{ marginTop: 8, marginBottom: 8 }}
        onClick={handleForgotPassword}
        disabled={loading}
      >
        Forgot Password?
      </button>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
