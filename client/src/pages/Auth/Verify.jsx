import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loading from "../../components/Loading/Loading";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    verifyOTP(email, otp, navigate, setError, setLoading);
  };

  const handleResend = async (e) => {
    e.preventDefault();
    resendOTP(email, setError, setLoading);
  };

  return (
    <div className="auth-container">
      {loading && <Loading />}
      <h2>Verify Your Account</h2>
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
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <p className="auth-footer">
        Didn't receive the OTP?{" "}
        <a
          href="#"
          onClick={handleResend}
          style={{ color: resent ? "green" : undefined }}
        >
          {resent ? "OTP Sent!" : "Resend OTP"}
        </a>
      </p>
    </div>
  );
};

export default Verify;
