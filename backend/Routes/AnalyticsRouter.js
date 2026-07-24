const express = require('express');
const { dailyTotals, weeklyTotals, monthlyTotals, categoryTotals, summary } = require('../Controllers/AnalyticsController');
const router = express.Router();

router.get('/daily', dailyTotals);
router.get('/weekly', weeklyTotals);
router.get('/monthly', monthlyTotals);
router.get('/category', categoryTotals);
router.get('/summary', summary);

module.exports = router;
