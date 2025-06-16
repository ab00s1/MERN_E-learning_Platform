import "./Payment.css";
import { useCourses } from "../../context/CourseContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const PaymentSuccess = () => {
  const { addCourseToUser, getPaymentReceipt } = useCourses();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get("courseId");
  const paymentId = searchParams.get("paymentId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const subscribeCourse = async () => {
      setLoading(true);
      setError("");
      const result = await addCourseToUser(courseId, setLoading, setError);
      if (result && result.message) {
        setSuccess(true);
        // Fetch payment receipt after successful course addition
        if (paymentId) {
          const paymentReceipt = await getPaymentReceipt(
            paymentId,
            setLoading,
            setError
          );
          setReceipt(paymentReceipt);
        }
      } else {
        setError("Failed to add course to your account.");
      }
      setLoading(false);
    };
    if (courseId) subscribeCourse();
    else {
      setError("Invalid course information.");
      setLoading(false);
    }
  }, [courseId, paymentId]);

  const handleGoToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Payment Receipt", 14, 20);

    doc.setFontSize(12);
    doc.text(`Course ID: ${courseId}`, 14, 35);
    doc.text(`Payment ID: ${paymentId}`, 14, 45);
    doc.text(
      `Amount: ${receipt.receipt.transactions[0].amount.total} ${receipt.receipt.transactions[0].amount.currency}`,
      14,
      55
    );
    doc.text(`Status: ${receipt.paymentState}`, 14, 65);
    doc.text(
      `Date: ${
        receipt.createdAt ? new Date(receipt.createdAt).toLocaleString() : "N/A"
      }`,
      14,
      75
    );
    doc.text(`Payer Email: ${receipt.receipt.payer.payer_info.email}`, 14, 85);

    doc.save(`payment_receipt_${paymentId}.pdf`);
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-icon">✅</div>
      <div className="payment-success-title">Payment Successful!</div>
      <div className="payment-success-message">
        {loading && "Finalizing your purchase..."}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {success && "Your course has been added to your account."}
      </div>
      <div className="payment-success-details">
        <span>
          <b>Course ID:</b> {courseId}
        </span>
        <span>
          <b>Payment ID:</b> {paymentId}
        </span>
        {receipt && (
          <>
            <span>
              <b>Amount:</b> {receipt.receipt.transactions[0].amount.total}{" "}
              {receipt.receipt.transactions[0].amount.currency}
            </span>
            <span>
              <b>Status:</b> {receipt.paymentState}
            </span>
            <span>
              <b>Date:</b>{" "}
              {receipt.createdAt
                ? new Date(receipt.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </>
        )}
      </div>
      <button
        className="payment-success-btn"
        onClick={handleGoToCourse}
        disabled={loading || !!error}
      >
        Go to Course
      </button>
      {receipt && (
        <button
          className="payment-success-btn payment-success-download"
          onClick={handleDownloadReceipt}
          disabled={loading || !!error}
        >
          Download Receipt
        </button>
      )}
    </div>
  );
};

export default PaymentSuccess;
