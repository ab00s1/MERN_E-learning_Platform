import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from "./UserContext.jsx";

const DoubtContext = createContext();

export const DoubtResolver = ({ children }) => {
  const { token } = useUser();
  // chatHistory: { [courseName]: [{ role: 'user'|'ai', message: string }] }
  const [chatHistory, setChatHistory] = useState({});

  // Send a doubt and update chat history for a course
  const resolveDoubt = async (courseName, doubt) => {
    if (!token) {
      toast.error("You must be logged in to ask doubts.");
      return;
    }
    if (!courseName || !doubt) {
      toast.error("Course and doubt are required.");
      return;
    }

    // Add user message to history
    setChatHistory(prev => ({
      ...prev,
      [courseName]: [
        ...(prev[courseName] || []),
        { role: 'user', message: doubt }
      ]
    }));

    try {
      const history = chatHistory[courseName] || [];
      const response = await axios.post(
        'http://localhost:5000/api/doubt/resolve',
        { course: courseName, doubt, history },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aiMessage = response.data.answer || "No answer generated.";

      // Add AI response to history
      setChatHistory(prev => ({
        ...prev,
        [courseName]: [
          ...(prev[courseName] || []),
          { role: 'ai', message: aiMessage }
        ]
      }));

      return aiMessage;
    } catch (error) {
      toast.error("Failed to resolve doubt.");
      // Optionally add error as AI message
      setChatHistory(prev => ({
        ...prev,
        [courseName]: [
          ...(prev[courseName] || []),
          { role: 'ai', message: "Failed to resolve doubt." }
        ]
      }));
      return null;
    }
  };

  // Get chat history for a course
  const getChatHistory = (courseName) => chatHistory[courseName] || [];

  return (
    <DoubtContext.Provider value={{ resolveDoubt, getChatHistory, chatHistory }}>
      {children}
    </DoubtContext.Provider>
  );
};

export const useResolve = () => {
  return useContext(DoubtContext);
};