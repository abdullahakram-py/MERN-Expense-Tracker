const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const { text, amount, category, date, type } = req.body;
        const allowedCategories = ['Food', 'Transportation', 'Healthcare', 'Shopping', 'Entertainment'];
        const allowedTypes = ['expense', 'income'];
        if (!text || amount === undefined || !type || !date) {
            return res.status(400).json({ message: 'Missing required transaction fields', success: false });
        }
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid transaction type', success: false });
        }
        if (type === 'expense' && !category) {
            return res.status(400).json({ message: 'Category is required for expenses', success: false });
        }
        if (category && type === 'expense' && !allowedCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category', success: false });
        }
        const parsedAmount = Number(amount);
        if (Number.isNaN(parsedAmount)) {
            return res.status(400).json({ message: 'Invalid amount', success: false });
        }
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date', success: false });
        }

        const transaction = {
            text,
            amount: parsedAmount,
            type,
            category: category || '',
            date: parsedDate
        }

        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { transactions: transaction } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Transaction added successfully",
                success: true,
                data: userData?.transactions
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findById(_id).select('transactions');
        res.status(200)
            .json({
                message: "Fetched transactions successfully",
                success: true,
                data: userData?.transactions
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const transactionId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { transactions: { _id: transactionId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Transaction deleted successfully",
                success: true,
                data: userData?.transactions
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
}