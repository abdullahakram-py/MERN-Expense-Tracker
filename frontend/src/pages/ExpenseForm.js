import React, { useState } from 'react'
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {

    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        category: '',
        date: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyExpenseInfo = { ...expenseInfo };
        copyExpenseInfo[name] = value;
        setExpenseInfo(copyExpenseInfo);
    }

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, category, date } = expenseInfo;
        if (!amount || !text || !category || !date) {
            handleError('Please fill all expense fields (name, amount, category, date)');
            return;
        }
        addTransaction({ ...expenseInfo, amount: Number(amount) });
        setExpenseInfo({ amount: '', text: '', category: '', date: '' })
    }

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='category'>Category</label>
                    <select name='category' value={expenseInfo.category} onChange={handleChange}>
                        <option value=''>Select category</option>
                        <option value='Food'>Food</option>
                        <option value='Transportation'>Transportation</option>
                        <option value='Healthcare'>Healthcare</option>
                        <option value='Shopping'>Shopping</option>
                        <option value='Entertainment'>Entertainment</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                        onChange={handleChange}
                        type='date'
                        name='date'
                        value={expenseInfo.date}
                    />
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    )
}

export default ExpenseForm