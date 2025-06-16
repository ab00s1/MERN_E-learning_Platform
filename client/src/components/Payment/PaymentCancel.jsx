import './Payment.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    const timer = setTimeout(() => {
        navigate(`/courses/${courseId}`);
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate, courseId]);

  return (
    <div className="payment-cancel-container">
      <div className="payment-cancel-icon">❌</div>
      <div className="payment-cancel-title">Payment Cancelled</div>
      <div className="payment-cancel-message">
        Your payment was cancelled. You have not been charged.<br/>
        Redirecting you back to the course page...
      </div>
    </div>
  );
}

export default PaymentCancel;
