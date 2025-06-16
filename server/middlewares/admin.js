const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const User = require("../models/User");
const { rm } = require("fs");
const fs = require("fs");

// to create new course and add lectures to it
const createCourse = async (req, res) => {
  try {
    const { title, description, createdBy, duration, price, category } = req.body;
    const image = req.file;

    // Validate required fields
    if (!title || !description || !image || !duration || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new course
    const newCourse = new Course({
      title,
      description,
      image: image?.path,
      duration,
      price,
      category,
      createdBy,
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to add lectures to a course
const addLectures = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, description } = req.body;
    const file = req.file;

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: courseId,
    });

    res.status(201).json({ message: "Lecture added successfully", lecture });
  } catch (error) {
    console.error("Error adding lecture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//to delete lecture from a course
const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the lecture by ID and remove it
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    rm(lecture.video, (err) => {
      if (err) {
        console.error("Error deleting lecture video file:", err);
      }
    });

    res.status(200).json({ message: "Lecture deleted successfully", lecture });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//to delete a course
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find the course by ID
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove all lecture video files
    const lectures = await Lecture.find({ course: courseId });
    lectures.forEach((lecture) => {
      rm(lecture.video, (err) => {
        if (err) {
          console.error("Error deleting lecture video file:", err);
        }
      });
    });

    // Delete all lectures associated with the course
    await Lecture.deleteMany({ course: courseId });


    // Remove the course image file
    rm(course.image, (err) => {
      if (err) {
        console.error("Error deleting course image file:", err);
      }
    });

    // Remove the course from all users' subscribed courses
    await User.updateMany(
      { subscribedCourses: courseId },
      { $pull: { subscribedCourses: courseId } }
    );

    res.status(200).json({ message: "Course and associated lectures deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//to get complete status of Users, Course and Lectures
const getCompleteStatus = async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
    const lectures = await Lecture.find().populate('course', 'title');
    const users = await User.find({}, '-password');

    res.status(200).json({
      message: "Status fetched successfully",
      courses,
      lectures,
      users
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { addLectures, createCourse, deleteLecture, deleteCourse, getCompleteStatus };