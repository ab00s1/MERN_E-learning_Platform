import { useCourses } from "../../context/CourseContext";
import "./Courses.css";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const Courses = () => {
  const { courses, getCourses } = useCourses();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  // Fetch courses when the component mounts
  useEffect(() => { 
    if (!user) {
      navigate("/login");
      return;
    } 
    getCourses(setLoading, setError);
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="courses-container min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      {loading && <Loading />}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="courses-title text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center tracking-tight"
      >
        Available Courses
      </motion.h1>
      
      {user && user.role === 'admin' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(45, 108, 223, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          className="add-course-admin-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          onClick={() => navigate('/admin/course/new')}
        >
          + Add New Course
        </motion.button>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="courses-error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="courses-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto"
      >
        <AnimatePresence>
          {courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course._id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 8px 24px rgba(44, 108, 223, 0.15)",
                  transition: { duration: 0.2 }
                }}
                className="course-card bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={`http://localhost:5000/${course.image.replace(/\\/g, '/')}`}
                  alt={course.title}
                  className="course-image w-full h-48 object-cover rounded-t-lg"
                />
                <div className="course-card-content p-6">
                  <motion.h2 
                    whileHover={{ color: "#1b4e9b" }}
                    className="course-title text-xl font-bold mb-3"
                  >
                    {course.title}
                  </motion.h2>
                  <p className="course-description text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="course-meta flex flex-wrap gap-2 mb-4">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="course-category bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {course.category}
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="course-duration bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {course.duration} weeks
                    </motion.span>
                  </div>
                  <div className="course-footer flex justify-between items-center">
                    <span className="course-author text-gray-500 text-sm">
                      By: {course.createdBy}
                    </span>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="course-price bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold"
                    >
                      ${course.price}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-courses text-gray-500 text-lg text-center col-span-full py-8"
            >
              No courses available at the moment.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Courses;
