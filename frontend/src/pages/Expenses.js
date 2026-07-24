import React, { useEffect, useState } from 'react';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { useRefresh } from '../context/RefreshContext';

function Expenses() {
  const { refreshKey } = useRefresh();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const url = `${APIUrl}/expenses`;
      const response = await fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } });
      const result = await response.json();
      if (response.ok) {
        setExpenses(result.data.filter(tx => tx.type === 'expense'));
      } else {
        handleError(result.message || 'Unable to fetch expenses');
      }
    } catch (err) {
      handleError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const response = await fetch(url, { method: 'DELETE', headers: { 'Authorization': localStorage.getItem('token') } });
      const result = await response.json();
      if (response.ok) {
        handleSuccess(result.message || 'Deleted successfully');
        setExpenses(result.data.filter(tx => tx.type === 'expense'));
      } else {
        handleError(result.message || 'Unable to delete expense');
      }
    } catch (err) {
      handleError(err.message || err);
    }
  };

  useEffect(() => { fetchExpenses(); }, [refreshKey]);

  return (
    <div className='panel'>
      <h2>Expenses</h2>
      {loading ? <p>Loading expenses...</p> : (
        expenses.length === 0 ? <p>No expenses yet.</p> : (
          <div className='transaction-list'>
            {expenses.map(tx => (
              <div className='transaction-card' key={tx._id || tx.date + tx.amount}>
                <div>
                  <h3>{tx.text}</h3>
                  <p>{tx.category}</p>
                </div>
                <div>
                  <span className='expense-amount'>- Rs{tx.amount}</span>
                  <button className='delete-button' onClick={() => deleteExpense(tx._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Expenses;
