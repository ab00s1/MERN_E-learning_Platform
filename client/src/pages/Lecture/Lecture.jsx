import "./Lecture.css";
import { useCourses } from "../../context/CourseContext";
import { useUser } from "../../context/UserContext";
import { useAdmin } from "../../context/AdminContext";
import { useResolve } from "../../context/DoubtContext";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import DoubtSolver from "../../components/DoubtSolver/DoubtSolver";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Lecture = () => {
  const {
    getCourseById,
    getLectures,
    getLectureById,
    markLectureCompleted,
    getCourseProgress,
  } = useCourses();
  const { user } = useUser();
  const { deleteLecture } = useAdmin();
  const { resolveDoubt, getChatHistory } = useResolve();
  const { CourseId: courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allLectures, setAllLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchLectures = async () => {
      setLoading(true);
      setError("");
      const lectures = await getLectures(courseId, setLoading, setError);
      setAllLectures(lectures);
      if (lectures && lectures.length > 0) {
        setCurrentLecture(lectures[0]);
      }
      // Fetch course name
      const courseData = await getCourseById(courseId, setLoading, setError);
      setCourse(courseData);
      setLoading(false);
    };
    fetchLectures();
  }, [user, courseId, getLectures, getCourseById, navigate]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user && user.role !== "admin") {
        const data = await getCourseProgress(courseId, setLoading, setError);
        if (data) {
          setProgress(data.progress);
        }
      }
    };
    fetchProgress();
  }, [courseId, user]);

  const handleLectureClick = async (lectureId) => {
    setLoading(true);
    setError("");
    const lecture = await getLectureById(
      courseId,
      lectureId,
      setLoading,
      setError
    );
    setCurrentLecture(lecture);
    setLoading(false);
  };

  const handleVideoEnded = async () => {
    if (user && user.role !== "admin" && currentLecture) {
      const result = await markLectureCompleted(
        courseId,
        currentLecture._id,
        setLoading,
        setError
      );
      if (result) {
        toast.success("Lecture completed!");
        // Refresh progress
        const data = await getCourseProgress(courseId, setLoading, setError);
        if (data) {
          setProgress(data.progress);
        }
      }
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    setLoading(true);
    setError("");
    try {
      const result = await deleteLecture(
        courseId,
        lectureId,
        setLoading,
        setError
      );
      if (result && result.lecture) {
        // Remove deleted lecture from list
        const updatedLectures = allLectures.filter((l) => l._id !== lectureId);
        setAllLectures(updatedLectures);
        if (updatedLectures.length > 0) {
          setCurrentLecture(updatedLectures[0]);
        } else {
          setCurrentLecture(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="lecture-container">
        <Loading />
      </div>
    );
  if (error)
    return <div className="lecture-container lecture-error">{error}</div>;
  // if (!currentLecture) return null;

  return (
    <div className="lecture-container min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      {user && user.role === "admin" && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="lecture-admin-add-btn mb-4 shadow-lg transition-all duration-200"
          onClick={() => navigate(`/admin/course/${courseId}/addLecture`)}
        >
          + Add Lecture
        </motion.button>
      )}
      {course && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lecture-course-title text-3xl md:text-4xl font-bold text-blue-700 mb-6 tracking-tight text-center drop-shadow-lg"
        >
          Course: {course.title}
        </motion.div>
      )}
      <div className="lecture-main flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lecture-video-section flex-1 min-w-[320px] flex flex-col items-start gap-4 bg-white/90 rounded-xl shadow-xl p-6"
        >
          <video
            ref={videoRef}
            className="lecture-video w-full max-w-2xl h-64 md:h-80 rounded-lg bg-blue-50 shadow-md border border-blue-100"
            src={`http://localhost:5000/${currentLecture?.video.replace(
              /\\/g,
              "/"
            )}`}
            controls
            poster="/thumbnail.avif"
            onEnded={handleVideoEnded}
          />
          <h2 className="lecture-title text-xl md:text-2xl font-bold text-blue-700 mt-2 mb-1">
            {currentLecture?.title}
          </h2>
          <p className="lecture-description text-gray-600 text-base md:text-lg leading-relaxed">
            {currentLecture?.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lecture-list-section flex-1 min-w-[220px] bg-blue-50 rounded-xl shadow-lg p-4"
        >
          {user && user.role !== "admin" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="course-progress mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-gray-700">
                  Course Progress&nbsp;
                </span>
                <span className="text-sm font-extrabold text-green-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </motion.div>
          )}
          <h3 className="lecture-list-title text-lg font-semibold text-blue-700 mb-3">
            Lectures
          </h3>
          <ul className="lecture-list space-y-2">
            {allLectures.map((lecture, idx) => (
              <motion.li
                key={lecture._id}
                whileHover={{ scale: 1.03 }}
                className={`lecture-list-item flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-medium text-base ${
                  currentLecture._id === lecture._id
                    ? "active"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
                onClick={() => handleLectureClick(lecture._id)}
              >
                <span>
                  Lecture {idx + 1}: {lecture.title}
                </span>
                {user && user.role === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    className="lecture-admin-delete-btn ml-2 px-3 py-1 bg-red-600 text-white rounded-md text-xs font-semibold shadow-sm hover:bg-red-700 transition-all duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLecture(lecture._id);
                    }}
                  >
                    Delete
                  </motion.button>
                )}
              </motion.li>
            ))}
          </ul>
          <DoubtSolver
            resolveDoubt={resolveDoubt}
            getChatHistory={getChatHistory}
            course={course}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Lecture;
