import './About.css';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      className="about-container max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl flex flex-col items-center relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
    >
      <div className="w-full flex flex-col md:flex-row items-center gap-8 mb-8">
        <motion.img
          src="/about-img.png"
          alt="About Learnera"
          className="w-full md:w-1/2 rounded-lg shadow-lg object-contain max-h-72 mb-4 md:mb-0"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        />
        <div className="flex-1 flex flex-col items-center md:items-start">
          <motion.h1
            className="about-title text-blue-700 text-3xl md:text-4xl font-extrabold mb-3 text-center md:text-left drop-shadow-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            About Learnera
          </motion.h1>
          <motion.p
            className="about-intro text-gray-600 text-lg md:text-xl mb-6 text-center md:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Learnera is a modern e-learning platform dedicated to empowering learners and professionals with high-quality, accessible, and interactive online education.
          </motion.p>
        </div>
      </div>
      <motion.section
        className="about-section w-full mb-6 bg-blue-50 rounded-lg p-6 text-center shadow"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-700 text-lg">We are a passionate team of educators, technologists, and industry experts committed to making learning engaging and effective for everyone. Our platform brings together expert instructors and innovative technology to deliver a seamless learning experience.</p>
      </motion.section>
      <motion.section
        className="about-section w-full mb-6 bg-blue-50 rounded-lg p-6 text-center shadow"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-blue-600 text-2xl font-bold mb-4">What We Do</h2>
        <p className="text-gray-700 text-lg">We offer a wide range of courses, from technology and business to creative arts and personal development. Our interactive content, real-world projects, and community support help learners achieve their goals at their own pace.</p>
      </motion.section>
      <motion.section
        className="about-section about-goals w-full mb-6 bg-blue-50 rounded-lg p-6 text-center shadow"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg">To democratize education by providing affordable, flexible, and high-quality learning opportunities for all.</p>
      </motion.section>
      <motion.section
        className="about-section about-vision w-full mb-2 bg-blue-50 rounded-lg p-6 text-center shadow"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Our Vision</h2>
        <p className="text-gray-700 text-lg">To become the most trusted platform for lifelong learning, helping millions unlock their potential and succeed in a rapidly changing world.</p>
      </motion.section>
    </motion.div>
  )
}

export default About
