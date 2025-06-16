import "./DoubtSolver.css";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const DoubtSolver = ({ resolveDoubt, getChatHistory, course }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="doubt-solver"
          >
            <div className="chat-interface bg-white/90 rounded-xl shadow-lg p-4 w-[350px] h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-700">Ask Your Doubt</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div className="chat-history mb-3 h-[calc(90vh-120px)] overflow-y-auto border rounded p-2 bg-blue-50">
                {getChatHistory(course.title).length === 0 && (
                  <div className="text-gray-400 text-sm">
                    No doubts yet. Start the conversation!
                  </div>
                )}
                {getChatHistory(course.title).map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-2 flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const doubt = e.target.doubt.value.trim();
                  if (!doubt) return;
                  await resolveDoubt(course.title, doubt);
                  e.target.doubt.value = "";
                }}
              >
                <input
                  name="doubt"
                  type="text"
                  placeholder="Type your doubt..."
                  className="flex-1 border rounded px-2 py-1"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
            }}
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <IoChatbubbleEllipses size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoubtSolver;
