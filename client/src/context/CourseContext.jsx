import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "./UserContext";

const CourseContext = createContext();
export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const { setUser } = useUser();

  // getting all courses from DB
  const getCourses = async (setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/course/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses || []);
      toast.success("Courses loaded successfully!");
      if (setLoading) setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (setError) setError("Failed to load courses.");
      toast.error("Failed to load courses.");
      if (setLoading) setLoading(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  // get a single course by ID
  const getCourseById = async (courseId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.course;
    } catch (error) {
      console.error("Error fetching course:", error);
      if (setError) setError("Failed to load course.");
      toast.error("Failed to load course.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // get my subscribed courses
  const getMyCourses = async (setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/course/my-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.courses || [];
    } catch (error) {
      console.error("Error fetching my courses:", error);
      if (setError) setError("Failed to load your courses.");
      toast.error("Failed to load your courses.");
      return [];
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // get all lectures of a course
  const getLectures = async (courseId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}/lectures`,
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
      );
      return response.data.lectures || [];
    } catch (error) {
      console.error("Error fetching lectures:", error);
      if (setError) setError("Failed to load lectures.");
      toast.error("Failed to load lectures.");
      return [];
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // get a single lecture by ID
  const getLectureById = async (courseId, lectureId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}/lecture/${lectureId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.lecture;
    } catch (error) {
      console.error("Error fetching lecture:", error);
      if (setError) setError("Failed to load lecture.");
      toast.error("Failed to load lecture.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // to purchase the course
  const purchaseCourse = async (courseId, amount, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/paypal/create-payment`,
        {
          courseId,
          amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error purchasing course:", error);
      if (setError) setError("Failed to purchase course.");
      toast.error("Failed to purchase course.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // to add the course to user's subscribed courses
  const addCourseToUser = async (courseId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/paypal/purchase/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course purchased successfully!");
      // After successful purchase
      const profile = await axios.get("http://localhost:5000/api/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profile) {
        localStorage.setItem("user", JSON.stringify(profile.data.user));
        setUser(profile.data.user); // <-- update context as well
      }
      return response.data;
    } catch (error) {
      console.error("Error adding course to user:", error);
      if (setError) setError("Failed to add course to your account.");
      toast.error("Failed to add course to your account.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // to get the receipt of a payment
  const getPaymentReceipt = async (paymentId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/paypal/payment/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.payment;
    } catch (error) {
      console.error("Error fetching payment receipt:", error);
      if (setError) setError("Failed to fetch payment receipt.");
      toast.error("Failed to fetch payment receipt.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // Mark lecture as completed
  const markLectureCompleted = async (courseId, lectureId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try { 
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/course/${courseId}/lecture/${lectureId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
      if (setError) setError("Failed to mark lecture as completed.");
      toast.error("Failed to mark lecture as completed.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // Get course progress
  const getCourseProgress = async (courseId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/course/${courseId}/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course progress:", error);
      if (setError) setError("Failed to fetch course progress.");
      toast.error("Failed to fetch course progress.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        getCourses,
        getCourseById,
        getMyCourses,
        getLectures,
        getLectureById,
        purchaseCourse,
        addCourseToUser,
        getPaymentReceipt,
        markLectureCompleted,
        getCourseProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  return useContext(CourseContext);
};
