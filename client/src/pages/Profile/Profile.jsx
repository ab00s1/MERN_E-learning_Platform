import './Profile.css';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { useCourses } from '../../context/CourseContext';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const fileInputRef = useRef();
  const { getProfile, uploadProfilePicture } = useUser();
  const { getMyCourses } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchUserAndCourses = async () => {
      const profile = await getProfile(setError, setLoading);
      if (profile) {
        setUser(profile);
        const courses = await getMyCourses(setLoading, setError);
        setMyCourses(courses);
      } else {
        setUser(false);
      }
      setLoading(false);
    };
    fetchUserAndCourses();
  }, [getProfile, getMyCourses]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;
    setError("");
    await uploadProfilePicture(image, setError, setLoading);
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const updatedProfile = await getProfile(setError, setLoading);
    if (updatedProfile) setUser(updatedProfile);
  };

  if (loading) return <div className="profile-container"><Loading /></div>;
  if (error) return <div className="profile-container profile-error">{error}</div>;
  if (!user) return null;

  return (
    <div className="profile-container min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="profile-title text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center tracking-tight"
      >
        My Profile
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="profile-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8"
      >
        <div className="profile-avatar-section">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={preview || `http://localhost:5000/${user.image?.replace(/\\/g, '/')}`}
            alt="Profile"
            className="profile-avatar w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-blue-500 shadow-lg"
          />
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="profile-upload-form mt-4"
            onSubmit={handleUpload}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="profile-upload-input hidden"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(45, 108, 223, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium mb-2 hover:bg-blue-200 transition-colors"
            >
              Choose Photo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(45, 108, 223, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!image}
              className={`profile-upload-btn w-full ${
                !image ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {image ? "Upload" : "Change Photo"}
            </motion.button>
          </motion.form>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="profile-info bg-blue-50/50 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">Name:</span>
            <span className="text-gray-700">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">Email:</span>
            <span className="text-gray-700">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">Role:</span>
            <span className="text-gray-700 capitalize">{user.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.isVerified 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="profile-courses bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mt-8"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Subscribed Courses</h2>
        <AnimatePresence>
          {myCourses && myCourses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="profile-no-courses text-gray-500 text-center py-8"
            >
              You have not subscribed to any courses yet.
            </motion.div>
          ) : (
            <motion.ul 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="profile-courses-list space-y-4"
            >
              {myCourses && myCourses.map((course) => (
                <motion.li
                  key={course._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(44, 108, 223, 0.1)"
                  }}
                  className="profile-course-item bg-white rounded-xl p-4 shadow-sm"
                >
                  <span className="profile-course-title block text-lg font-semibold mb-2">
                    {course.title}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="profile-course-category bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {course.category}
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="profile-course-duration bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {course.duration} weeks
                    </motion.span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;
