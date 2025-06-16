import { createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminContext = createContext();
export const AdminProvider = ({ children }) => {
  // Create a new course api call
  const createCourse = async (courseData, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/course/new",
        courseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      if (setError) setError("Failed to create course.");
      toast.error("Failed to create course.");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // api call to delete a course
  const deleteCourse = async (courseId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/admin/course/${courseId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("Error deleting course:", error);
      if (setError) setError("Failed to delete course.");
      toast.error("Failed to delete course.");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // to add lectures to a course
  const addLectures = async (courseId, lectureData, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/admin/course/${courseId}/addLecture`,
        lectureData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Lecture added successfully!");
      return response.data;
    } catch (error) {
      console.error("Error adding lecture:", error);
      if (setError) setError("Failed to add lecture.");
      toast.error("Failed to add lecture.");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // api call to delete a lecture from a course
  const deleteLecture = async (courseId, lectureId, setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/admin/course/${courseId}/deleteLecture/${lectureId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Lecture deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("Error deleting lecture:", error);
      if (setError) setError("Failed to delete lecture.");
      toast.error("Failed to delete lecture.");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // api call to get complete stats for Admin Dashboard
  const getCompleteStatus = async (setLoading, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/getCompleteStatus",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching complete status:", error);
      if (setError) setError("Failed to fetch complete status.");
      toast.error("Failed to fetch complete status.");
      return null;
    } finally {
      if (setLoading) setLoading(false);
    }
  }

  return (
    <AdminContext.Provider value={{ createCourse, deleteCourse, addLectures, deleteLecture, getCompleteStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
