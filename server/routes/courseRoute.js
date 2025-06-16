const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, getLectures, getLectureById, getMyCourses, markLectureCompleted, getCourseProgress } = require('../middlewares/course');
const { authenticateToken } = require('../middlewares/authenticate');

router.get('/all', authenticateToken, getAllCourses);
router.get('/my-courses', authenticateToken, getMyCourses);
router.get('/:id', authenticateToken, getCourseById);
router.get('/:id/lectures', authenticateToken, getLectures);
router.get('/:id/lecture/:lId', authenticateToken, getLectureById);
router.post('/:courseId/lecture/:lectureId/complete', authenticateToken, markLectureCompleted);
router.get('/:courseId/progress', authenticateToken, getCourseProgress);

module.exports = router;
