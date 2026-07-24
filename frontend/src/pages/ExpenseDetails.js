import React from 'react'

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    return (
        <div>
            <div>
                Your Balance is Rs {incomeAmt - expenseAmt}
            </div>
            {/* Show Income & Expense amount */}
            <div className="amounts-container">
                Income
                <span className="income-amount">Rs{incomeAmt}</span>
                Expense
                <span className="expense-amount">Rs{expenseAmt}</span>
            </div>
        </div>
    )
}

export default ExpenseDetails