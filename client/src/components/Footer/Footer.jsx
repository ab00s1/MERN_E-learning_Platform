import { FaBook, FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';
 
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className="footer bg-blue-600 text-white shadow-lg mt-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
      viewport={{ once: true }}
    >
      <div className="footer-content max-w-5xl mx-auto flex flex-col items-center gap-3 px-4">
        <motion.span
          className="footer-logo flex items-center gap-2 text-lg md:text-2xl font-bold tracking-wider mb-1"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaBook size={22} className="footer-logo-icon text-white" />Learnera
        </motion.span>
        <motion.div
          className="footer-contact flex gap-6 flex-wrap justify-center text-base mb-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="footer-contact-item flex items-center gap-2">
            <FaEnvelope className="text-blue-100" /> <span className="hover:underline">support@learnera.com</span>
          </div>
          <div className="footer-contact-item flex items-center gap-2">
            <FaPhone className="text-blue-100" /> <span className="hover:underline">+91 8765 4320</span>
          </div>
        </motion.div>
        <motion.div
          className="footer-social flex gap-5 mb-1"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-200 transition-transform hover:scale-110" whileHover={{ scale: 1.15 }}><FaLinkedin /></motion.a>
          <motion.a href="https://X.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-200 transition-transform hover:scale-110" whileHover={{ scale: 1.15 }}><FaTwitter /></motion.a>
          <motion.a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blue-200 transition-transform hover:scale-110" whileHover={{ scale: 1.15 }}><FaInstagram /></motion.a>
        </motion.div>
        <motion.div
          className="footer-copy text-blue-100 text-sm mt-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          &copy; {year} Learnera. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
