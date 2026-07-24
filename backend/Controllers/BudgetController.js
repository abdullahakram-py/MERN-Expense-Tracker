const BudgetModel = require('../Models/Budget');
const UserModel = require('../Models/User');

const createOrUpdateBudget = async (req, res) => {
    try {
        const { _id } = req.user;
        const { daily, weekly, monthly } = req.body;
        if (daily < 0 || weekly < 0 || monthly < 0) {
            return res.status(400).json({ message: 'Budget values cannot be negative', success: false });
        }
        let budget = await BudgetModel.findOne({ user: _id });
        if (!budget) {
            budget = new BudgetModel({ user: _id, daily, weekly, monthly });
            await budget.save();
        } else {
            budget.daily = daily;
            budget.weekly = weekly;
            budget.monthly = monthly;
            await budget.save();
        }
        return res.status(200).json({ message: 'Budget saved', success: true, data: budget });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const getBudget = async (req, res) => {
    try {
        const { _id } = req.user;
        const budget = await BudgetModel.findOne({ user: _id });
        return res.status(200).json({ message: 'Budget fetched', success: true, data: budget });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const deleteBudget = async (req, res) => {
    try {
        const { _id } = req.user;
        await BudgetModel.findOneAndDelete({ user: _id });
        return res.status(200).json({ message: 'Budget deleted', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

module.exports = {
    createOrUpdateBudget,
    getBudget,
    deleteBudget
}
