const express = require('express');
const { authenticateToken } = require('../middlewares/authenticate');
const { resolveDoubt } = require('../middlewares/resolveDoubt');

const router = express.Router();

router.post('/resolve', authenticateToken, resolveDoubt);

module.exports = router;
