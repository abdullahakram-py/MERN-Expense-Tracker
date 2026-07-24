const express = require('express');
const { createOrUpdateBudget, getBudget, deleteBudget } = require('../Controllers/BudgetController');
const router = express.Router();

router.get('/', getBudget);
router.post('/', createOrUpdateBudget);
router.delete('/', deleteBudget);

module.exports = router;
