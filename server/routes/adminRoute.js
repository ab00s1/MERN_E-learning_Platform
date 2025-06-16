const express = require('express');
const { isAdmin, authenticateToken } = require('../middlewares/authenticate.js');
const { addLectures, createCourse, deleteLecture, deleteCourse, getCompleteStatus } = require('../middlewares/admin.js');
const { upload } = require('../middlewares/multer.js');

const router = express.Router();

router.post('/course/new', authenticateToken, isAdmin, upload, createCourse);
router.post('/course/:courseId/addLecture', authenticateToken, isAdmin, upload, addLectures);
router.delete('/course/:courseId/deleteLecture/:lectureId', authenticateToken, isAdmin, deleteLecture);
router.delete('/course/:courseId/delete', authenticateToken, isAdmin, deleteCourse);
router.get('/getCompleteStatus', authenticateToken, isAdmin, getCompleteStatus);

module.exports = router;
