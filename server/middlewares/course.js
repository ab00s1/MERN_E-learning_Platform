const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const User = require("../models/User");
const CompletedLecture = require("../models/CompletedLecture");

//to get list of all courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ message: "Courses fetched successfully", courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//to get a single course by id
const getCourseById = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.status(200).json({ message: "Course fetched successfully", course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//to get all lectures of a course
const getLectures = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const lectures = await Lecture.find({ course: courseId });
    if (!lectures || lectures.length === 0) {
      return res.status(200).json({ message: "No lectures found for this course", lectures: [] });
    }

    // Check if user is admin or subscribed
    const userId = req.userId; // set by authenticateToken middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // If admin, allow all lectures
    if (user.role === "admin") {
      return res.status(200).json({ message: "Lectures fetched successfully", lectures });
    }

    // If user have a subscription, check here:
    if (!user.subscribedCourses || !user.subscribedCourses.includes(courseId)) {
      return res.status(403).json({ message: "Access denied: Not subscribed to this course" });
    }

    return res.status(200).json({ message: "Lectures fetched successfully", lectures });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//to get a single lecture by id
const getLectureById = async (req, res, next) => {
  try {
    const lectureId = req.params.lId;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }
    // Check if user is admin or subscribed
    const userId = req.userId; // set by authenticateToken middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // If admin, allow all lectures
    if (user.role === "admin") {
      return res.status(200).json({ message: "Lecture fetched successfully", lecture });
    }
    // If user have a subscription, check here:
    if (!user.subscribedCourses || !user.subscribedCourses.includes(lecture.course)) {
      return res.status(403).json({ message: "Access denied: Not subscribed to this course" });
    }
    return res.status(200).json({ message: "Lecture fetched successfully", lecture });
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//to get subscribed courses of a user
const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.userId; // set by authenticateToken middleware
    const user = await User.findById(userId).populate('subscribedCourses');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      // Admin: return all courses
      const allCourses = await Course.find();
      return res.status(200).json({ message: "All courses fetched for admin", courses: allCourses });
    }
    if (!user.subscribedCourses) {
      return res.status(404).json({ message: "No subscribed courses found" });
    }
    res.status(200).json({ message: "Subscribed courses fetched successfully", courses: user.subscribedCourses });
  }
  catch (error) {
    console.error("Error fetching subscribed courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//purchase the subscription of a course 
const purchaseCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId; // set by authenticateToken middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if the user is already subscribed to the course
    if (user.subscribedCourses && user.subscribedCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already subscribed to this course" });
    }

    // Add the course to user's subscribed courses
    user.subscribedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Course purchased successfully", courseId });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Mark a lecture as completed
const markLectureCompleted = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.userId;

    // Check if user is subscribed to the course
    const user = await User.findById(userId);
    if (!user.subscribedCourses.includes(courseId)) {
      return res.status(403).json({ message: "Not subscribed to this course" });
    }

    // Create completed lecture record
    const completedLecture = await CompletedLecture.create({
      user: userId,
      course: courseId,
      lecture: lectureId,
    });

    res.status(200).json({ message: "Lecture marked as completed", completedLecture });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - lecture already completed
      return res.status(200).json({ message: "Lecture already completed" });
    }
    console.error("Error marking lecture as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get course progress
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Get total lectures in course
    const totalLectures = await Lecture.countDocuments({ course: courseId });

    // Get completed lectures
    const completedLectures = await CompletedLecture.countDocuments({
      user: userId,
      course: courseId,
    });

    const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

    res.status(200).json({
      message: "Progress fetched successfully",
      progress: Math.round(progress),
      completedLectures,
      totalLectures,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getLectures,
  getLectureById,
  getMyCourses,
  purchaseCourse,
  markLectureCompleted,
  getCourseProgress
};