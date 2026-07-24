const mongoose = require('mongoose');
const UserModel = require('../Models/User');

// Helper to parse date range
const parseRange = (query) => {
    const { start, end } = query;
    const startDate = start ? new Date(start) : new Date('1970-01-01');
    const endDate = end ? new Date(end) : new Date();
    return { startDate, endDate };
}

const dailyTotals = async (req, res) => {
    try {
        const { _id } = req.user;
        const { startDate, endDate } = parseRange(req.query);
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$transactions.date' } }, total: { $sum: '$transactions.amount' } } },
            { $sort: { '_id': 1 } }
        ];
        const result = await UserModel.aggregate(pipeline);
        return res.status(200).json({ message: 'Daily totals', success: true, data: result });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const weeklyTotals = async (req, res) => {
    try {
        const { _id } = req.user;
        const { startDate, endDate } = parseRange(req.query);
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { year: { $isoWeekYear: '$transactions.date' }, week: { $isoWeek: '$transactions.date' } }, total: { $sum: '$transactions.amount' } } },
            { $sort: { '_id.year': 1, '_id.week': 1 } }
        ];
        const result = await UserModel.aggregate(pipeline);
        return res.status(200).json({ message: 'Weekly totals', success: true, data: result });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const monthlyTotals = async (req, res) => {
    try {
        const { _id } = req.user;
        const { startDate, endDate } = parseRange(req.query);
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { year: { $year: '$transactions.date' }, month: { $month: '$transactions.date' } }, total: { $sum: '$transactions.amount' } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ];
        const result = await UserModel.aggregate(pipeline);
        return res.status(200).json({ message: 'Monthly totals', success: true, data: result });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const categoryTotals = async (req, res) => {
    try {
        const { _id } = req.user;
        const { startDate, endDate } = parseRange(req.query);
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$transactions.category', total: { $sum: '$transactions.amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ];
        const result = await UserModel.aggregate(pipeline);
        return res.status(200).json({ message: 'Category totals', success: true, data: result });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

const summary = async (req, res) => {
    try {
        const { _id } = req.user;
        const { startDate, endDate } = parseRange(req.query);
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, totalExpenses: { $sum: '$transactions.amount' }, txCount: { $sum: 1 } } }
        ];
        const res1 = await UserModel.aggregate(pipeline);
        const categoryPipeline = [
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            { $unwind: '$transactions' },
            { $match: { 'transactions.type': 'expense', 'transactions.date': { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$transactions.category', total: { $sum: '$transactions.amount' } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ];
        const topCat = await UserModel.aggregate(categoryPipeline);
        return res.status(200).json({ message: 'Summary', success: true, data: { totals: res1[0] || { totalExpenses: 0, txCount: 0 }, topCategory: topCat[0] || null } });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err, success: false });
    }
}

module.exports = {
    dailyTotals,
    weeklyTotals,
    monthlyTotals,
    categoryTotals,
    summary
}
