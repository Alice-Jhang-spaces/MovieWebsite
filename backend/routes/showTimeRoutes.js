const express = require('express');
const showTimeController = require('../controllers/showTimeController');

const router = express.Router();

router.get('/', showTimeController.getAllShowTimes);
router.post('/', showTimeController.createShowTimes);

module.exports = router;
