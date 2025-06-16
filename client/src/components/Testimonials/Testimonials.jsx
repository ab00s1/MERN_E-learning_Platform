import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import './Testimonials.css';

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Software Engineer",
    text: "Learnera helped me upskill quickly and land my dream job. The courses are well-structured and the instructors are top-notch!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya Verma",
    role: "Student",
    text: "The interactive quizzes and assignments made learning fun and effective. Highly recommend Learnera to anyone!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Rahul Singh",
    role: "Data Analyst",
    text: "I loved the flexibility to learn at my own pace. The certification helped boost my resume.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    name: "Sara Khan",
    role: "Web Developer",
    text: "The platform is user-friendly and the support team is always ready to help. Great experience!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "Vikram Patel",
    role: "Marketing Specialist",
    text: "Learnera's courses are practical and up-to-date. I could apply what I learned immediately.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg"
  }
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prev) => {
      if (newDirection === 1) {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      }
    });
  };

  const t = testimonials[index];

  return (
    <section className="testimonials-section w-full flex flex-col items-center">
      <h2 className="testimonials-title text-2xl font-bold mb-6 text-blue-700">What Our Learners Say</h2>
      <div className="relative w-full max-w-md flex items-center justify-center">
        <button
          aria-label="Previous"
          onClick={() => paginate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 cursor-pointer shadow transition z-10"
        >
          <FaChevronLeft size={20} />
        </button>
        <div className="w-full flex items-center justify-center min-h-[320px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="testimonial-card bg-white rounded-xl shadow-lg px-6 py-8 flex flex-col items-center mx-10 transition-all duration-300"
              style={{ position: 'absolute', width: '100%' }}
            >
              <img src={t.avatar} alt={t.name} className="testimonial-avatar w-16 h-16 rounded-full mb-4 object-cover border-2 border-blue-200" />
              <p className="testimonial-text text-gray-700 italic mb-4 px-4 text-center">"{t.text}"</p>
              <div className="testimonial-user flex flex-col items-center">
                <span className="testimonial-name font-semibold text-blue-700">{t.name}</span>
                <span className="testimonial-role text-sm text-blue-400">{t.role}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          aria-label="Next"
          onClick={() => paginate(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 cursor-pointer shadow transition z-10"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-blue-600" : "bg-blue-200"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
