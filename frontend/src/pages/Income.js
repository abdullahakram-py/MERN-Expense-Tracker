import React, { useEffect, useState } from 'react';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { useRefresh } from '../context/RefreshContext';

function Income() {
  const { refreshKey } = useRefresh();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const url = `${APIUrl}/expenses`;
      const response = await fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } });
      const result = await response.json();
      if (response.ok) {
        setIncomes(result.data.filter(tx => tx.type === 'income'));
      } else {
        handleError(result.message || 'Unable to fetch income');
      }
    } catch (err) {
      handleError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const response = await fetch(url, { method: 'DELETE', headers: { 'Authorization': localStorage.getItem('token') } });
      const result = await response.json();
      if (response.ok) {
        handleSuccess(result.message || 'Deleted successfully');
        setIncomes(result.data.filter(tx => tx.type === 'income'));
      } else {
        handleError(result.message || 'Unable to delete income');
      }
    } catch (err) {
      handleError(err.message || err);
    }
  };

  useEffect(() => { fetchIncomes(); }, [refreshKey]);

  return (
    <div className='panel'>
      <h2>Income</h2>
      {loading ? <p>Loading incomes...</p> : (
        incomes.length === 0 ? <p>No income records yet.</p> : (
          <div className='transaction-list'>
            {incomes.map(tx => (
              <div className='transaction-card' key={tx._id || tx.date + tx.amount}>
                <div>
                  <h3>{tx.text}</h3>
                  <p>{tx.category || 'Income'}</p>
                </div>
                <div>
                  <span className='income-amount'>+ Rs{tx.amount}</span>
                  <button className='delete-button' onClick={() => deleteIncome(tx._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Income;
