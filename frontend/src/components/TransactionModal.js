import React, { useEffect, useState } from 'react';
import '../login.css';

const expenseCategories = ['Food', 'Transportation', 'Healthcare', 'Shopping', 'Entertainment'];
const incomeCategories = ['Salary', 'Business', 'Investment', 'Other'];

function TransactionModal({ open, onClose, onSave }) {
  const [mode, setMode] = useState('expense');
  const [transaction, setTransaction] = useState({ text: '', amount: '', type: 'expense', category: '', date: '' });

  useEffect(() => {
    if (open) {
      setMode('expense');
      setTransaction({ text: '', amount: '', type: 'expense', category: '', date: '' });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!transaction.text || !transaction.amount || !transaction.date) return;
    if (mode === 'expense' && !transaction.category) return;
    onSave({ ...transaction, type: mode, amount: Number(transaction.amount) });
  };

  if (!open) return null;

  return (
    <div className='modal-overlay'>
      <div className='transaction-modal'>
        <div className='modal-header'>
          <div className='toggle-buttons'>
            <button className={mode === 'expense' ? 'active' : ''} onClick={() => setMode('expense')}>Expense</button>
            <button className={mode === 'income' ? 'active' : ''} onClick={() => setMode('income')}>Income</button>
          </div>
          <button className='close-button' onClick={onClose}>&times;</button>
        </div>
        <form className='transaction-form' onSubmit={handleSave}>
          <div className='form-group'>
            <label>Description</label>
            <input name='text' value={transaction.text} onChange={handleChange} placeholder='What is this for?' />
          </div>
          <div className='form-group'>
            <label>Amount</label>
            <input name='amount' type='number' value={transaction.amount} onChange={handleChange} placeholder='0.00' />
          </div>
          <div className='form-group'>
            <label>Date</label>
            <input name='date' type='date' value={transaction.date} onChange={handleChange} />
          </div>
          {mode === 'expense' && (
            <div className='form-group'>
              <label>Category</label>
              <select name='category' value={transaction.category} onChange={handleChange}>
                <option value=''>Select category</option>
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
          {mode === 'income' && (
            <div className='form-group'>
              <label>Category (optional)</label>
              <select name='category' value={transaction.category} onChange={handleChange}>
                <option value=''>Select category</option>
                {incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
          <button type='submit' className='login-button'>Save {mode === 'expense' ? 'Expense' : 'Income'}</button>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
