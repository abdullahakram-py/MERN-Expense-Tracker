const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    daily: {
        type: Number,
        default: 0,
        min: 0
    },
    weekly: {
        type: Number,
        default: 0,
        min: 0
    },
    monthly: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BudgetModel = mongoose.model('budgets', BudgetSchema);
module.exports = BudgetModel;
