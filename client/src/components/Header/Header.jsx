import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBook, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  const { token, setToken, user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
  };
  const navItem = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <motion.header
      className="header bg-white shadow-md border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      <motion.div className="logo flex items-center" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <Link to="/" style={{textDecoration: "none"}}>
          <motion.h1 className="flex items-center gap-2 text-blue-600 font-extrabold tracking-wide text-xl md:text-2xl" whileHover={{ scale: 1.05 }}>
            <FaBook size={28} className="book text-blue-600" />
            Learnera
          </motion.h1>
        </Link>
      </motion.div>
      <motion.nav className="nav flex items-center gap-4 md:gap-6" variants={navVariants} initial="hidden" animate="visible">
        <motion.div variants={navItem}>
          <Link to="/" className="nav-link text-gray-800 font-medium px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-150">
            Home
          </Link>
        </motion.div>
        <motion.div variants={navItem}>
          <Link to="/about" className="nav-link text-gray-800 font-medium px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-150">
            About
          </Link>
        </motion.div>
        <motion.div variants={navItem}>
          <Link to="/courses" className="nav-link text-gray-800 font-medium px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-150">
            Courses
          </Link>
        </motion.div>
        <motion.div variants={navItem} className="profile-dropdown relative group">
          <span className="nav-link profile-icon flex items-center cursor-pointer px-2 py-2 rounded-full hover:bg-blue-50 focus:bg-blue-100 transition" tabIndex={0}>
            {user && user.image ? (
              <motion.img
                src={`http://localhost:5000/${user.image.replace(/\\/g, '/')}`}
                alt="Profile"
                className="header-avatar w-8 h-8 rounded-full object-cover border-2 border-blue-100 bg-white shadow"
                width={28}
                whileHover={{ scale: 1.08 }}
              />
            ) : (
              <motion.span whileHover={{ scale: 1.08 }}>
                <FaUserCircle size={28} className="text-gray-500" />
              </motion.span>
            )}
          </span>
          <motion.div
            className="dropdown-content absolute right-0 top-12 bg-white min-w-[140px] shadow-lg rounded-lg z-50 flex-col py-2 hidden group-focus-within:flex group-hover:flex"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!token ? (
              <>
                <Link to="/login" className="dropdown-link block px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition rounded">Login</Link>
                <Link to="/signup" className="dropdown-link block px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition rounded">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="dropdown-link block px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition rounded">My Profile</Link>
                <button
                  className="dropdown-link w-full flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition rounded bg-transparent border-none text-left"
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: 'inherit' }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.nav>
    </motion.header>
  )
}

export default Header
