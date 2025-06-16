const { authenticateToken } = require('../middlewares/authenticate');
const { purchaseCourse } = require('../middlewares/course');
const { createPayment, executePayment, receipt } = require("../middlewares/paypal");
const express = require("express");
const router = express.Router();

router.post("/create-payment", authenticateToken, createPayment);
router.get("/execute-payment", executePayment);
router.post('/purchase/:id', authenticateToken, purchaseCourse);
router.get('/payment/:id', authenticateToken, receipt);

module.exports = router;