import "./CourseDescription.css";
import { useCourses } from "../../context/CourseContext";
import { useUser } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading"; 
import { useAdmin } from "../../context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";

const CourseDescription = () => {
  const { getCourseById, purchaseCourse } = useCourses();
  const { user } = useUser();
  const { deleteCourse } = useAdmin();
  const { CourseId: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaypalCreds, setShowPaypalCreds] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      const data = await getCourseById(courseId, setLoading, setError);
      setCourse(data);
      setLoading(false);
    };
    fetchCourse();
  }, [courseId, getCourseById]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;
    setLoading(true);
    setError("");
    const result = await deleteCourse(course._id, setLoading, setError);
    setLoading(false);
    if (result && result.message) {
      navigate("/courses");
    }
  };

  const handleBuy = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await purchaseCourse(
        course._id,
        course.price,
        setLoading,
        setError
      );
      if (result && result.approval_url) {
        window.location.href = result.approval_url;
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="course-desc-container">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="course-desc-container course-desc-error">{error}</div>
    );
  if (!course) return null;

  const isAdmin = user && user.role === "admin";
  const isSubscribed =
    user &&
    user.subscribedCourses &&
    user.subscribedCourses.includes(course._id);

  return (
    <div className="course-desc-container min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="course-desc-card flex flex-col md:flex-row gap-8 md:gap-12 w-full items-start justify-center bg-white/90 rounded-2xl shadow-2xl p-6 md:p-10 backdrop-blur-sm"
      >
        <motion.img
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          src={`http://localhost:5000/${course.image.replace(/\\/g, "/")}`}
          alt={course.title}
          className="course-desc-image w-full max-w-xs md:max-w-md h-48 md:h-56 object-cover rounded-xl shadow-lg border border-blue-100 bg-blue-50 hover:scale-[1.02] transition-transform duration-300"
        />
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="course-desc-content flex-1 min-w-[220px] flex flex-col gap-4"
        >
          <h1 className="course-desc-title text-2xl md:text-3xl font-bold text-blue-700 mb-2 tracking-tight drop-shadow-lg">
            {course.title}
          </h1>
          <div className="course-desc-meta flex flex-wrap gap-3 text-base mb-2">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="course-desc-category bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold"
            >
              {course.category}
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="course-desc-duration bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold"
            >
              {course.duration} weeks
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="course-desc-price bg-green-100 text-green-700 px-3 py-1 rounded font-semibold"
            >
              ${course.price}
            </motion.span>
          </div>
          <p className="course-desc-description text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            {course.description}
          </p>
          <div className="course-desc-footer flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="course-desc-author font-medium">
              By: {course.createdBy}
            </span>
            <span className="course-desc-date">
              Created: {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="course-desc-actions flex flex-col gap-3 mt-4">
            {isAdmin ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 12px rgba(45, 108, 223, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="course-desc-btn study bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition-all duration-200"
                  onClick={() => navigate(`/courses/${course._id}/lectures`)}
                >
                  Study
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="course-desc-btn delete bg-red-600 text-white font-bold shadow-md hover:bg-red-700 transition-all duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </motion.button>
              </>
            ) : isSubscribed ? (
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 4px 12px rgba(45, 108, 223, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="course-desc-btn study bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition-all duration-200"
                onClick={() => navigate(`/courses/${course._id}/lectures`)}
              >
                Study
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 12px rgba(56, 142, 60, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="course-desc-btn subscribe bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-all duration-200"
                  onClick={handleBuy}
                >
                  Buy Course
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="paypal-creds-toggle-btn bg-blue-700 text-white font-semibold shadow-sm hover:bg-blue-800 transition-all duration-200"
                  onClick={() => setShowPaypalCreds((v) => !v)}
                >
                  {!showPaypalCreds
                    ? "Need PayPal Sandbox Test Credentials?"
                    : "Hide Test Credentials"}
                </motion.button>
                <AnimatePresence>
                  {showPaypalCreds && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="paypal-test-credentials bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-700 text-sm max-w-xs shadow overflow-hidden"
                    >
                      <b className="text-blue-700">
                        PayPal Sandbox Test Credentials:
                      </b>
                      <br />
                      Email: sb-uy30m43249298@personal.example.com
                      <br />
                      Password: ak2%ztAt
                      <br />
                      <span className="text-xs text-gray-400">
                        Use these credentials if you do not have a PayPal sandbox
                        account for testing.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CourseDescription;
