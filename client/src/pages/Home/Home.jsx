import './Home.css';
import Testimonials from '../../components/Testimonials/Testimonials';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <motion.div
      className="home-container max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl flex flex-col items-center relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
    >
      <motion.div
        className="w-full flex flex-col md:flex-row items-center gap-8 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <motion.img
          src="/hero-image.webp"
          alt="Learning Hero"
          className="w-full md:w-1/2 rounded-lg shadow-lg object-cover max-h-72 mb-4 md:mb-0"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        />
        <div className="flex-1 flex flex-col items-center md:items-start">
          <motion.h1
            className="home-title text-blue-700 text-3xl md:text-4xl font-extrabold mb-3 text-center md:text-left drop-shadow-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Welcome to E-Learning Platform, <span className="text-blue-500">Learnera</span>
          </motion.h1>
          <motion.p
            className="home-subtitle text-gray-600 text-lg md:text-xl mb-6 text-center md:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Get started by exploring our courses and enhancing your skills!
          </motion.p>
          <motion.button
            className="home-btn bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3 mx-auto text-lg shadow-md transition mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/courses')}
          >
            Get Started
          </motion.button>
          {user && user.role === 'admin' && (
            <motion.button
              className="home-btn admin-dashboard-btn bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-8 py-3 mx-auto text-lg shadow-md transition mt-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/adminDashboard')}
            >
              Go to Admin Dashboard
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.section
        className="home-section w-full mb-8 bg-blue-50 rounded-lg p-6 text-center shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Why Choose Learnera?</h2>
        <ul className="home-features list-none m-0 max-w-md mx-auto px-8">
          <motion.li className="text-gray-700 text-lg mb-3 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}> Expert Instructors & Quality Content</motion.li>
          <motion.li className="text-gray-700 text-lg mb-3 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}> Flexible Learning at Your Own Pace</motion.li>
          <motion.li className="text-gray-700 text-lg mb-3 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}> Interactive Quizzes & Assignments</motion.li>
          <motion.li className="text-gray-700 text-lg mb-3 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}> Certification on Completion</motion.li>
        </ul>
      </motion.section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="w-full">
        <Testimonials />
      </motion.div>
    </motion.div>
  );
}

export default Home;
