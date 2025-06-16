import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loading from "../../components/Loading/Loading";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    resetPassword(email, otp, newPassword, navigate, setError, setLoading);
  };

  return (
    <div className="auth-container">
      {loading && <Loading />}
      <h2>Reset Password</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reset-email">Email:</label>
          <input
            type="email"
            id="reset-email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reset-otp">OTP:</label>
          <input
            type="text"
            id="reset-otp"
            placeholder="Enter OTP sent to your email"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reset-password">New Password:</label>
          <input
            type="password"
            id="reset-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Reset;
