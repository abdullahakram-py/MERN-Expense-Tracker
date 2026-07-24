import React, { useEffect, useState } from 'react';
import { APIUrl, handleError } from '../utils';
import { useRefresh } from '../context/RefreshContext';

function Dashboard() {
  const { refreshKey } = useRefresh();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ dateWise: [], categoryWise: [] });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url = `${APIUrl}/expenses`;
      const response = await fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } });
      const result = await response.json();
      if (response.ok) {
        setTransactions(result.data);
      } else {
        handleError(result.message || 'Unable to fetch transactions');
      }
    } catch (err) {
      handleError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const buildSummary = (data) => {
    const dateWise = data.reduce((acc, tx) => {
      const date = tx.date ? new Date(tx.date).toLocaleDateString() : 'Unknown';
      acc[date] = (acc[date] || 0) + (tx.type === 'expense' ? tx.amount : 0);
      return acc;
    }, {});
    const categoryWise = data.reduce((acc, tx) => {
      if (tx.type !== 'expense') return acc;
      const category = tx.category || 'Other';
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {});
    const sortedDates = Object.entries(dateWise).map(([date, amount]) => ({ date, amount })).sort((a,b) => b.amount - a.amount);
    const sortedCategories = Object.entries(categoryWise).map(([category, amount]) => ({ category, amount })).sort((a,b) => b.amount - a.amount);
    setSummary({ dateWise: sortedDates, categoryWise: sortedCategories });
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  useEffect(() => {
    if (transactions.length) {
      buildSummary(transactions);
    } else {
      setSummary({ dateWise: [], categoryWise: [] });
    }
  }, [transactions]);

  return (
    <div className='panel'>
      <h2>Dashboard</h2>
      <div className='summary-grid'>
        <div className='summary-card'>
          <h3>Top Expense Date</h3>
          <p>{summary.dateWise[0]?.date || 'No data'}</p>
          <strong>Rs{summary.dateWise[0]?.amount || 0}</strong>
        </div>
        <div className='summary-card'>
          <h3>Top Category</h3>
          <p>{summary.categoryWise[0]?.category || 'No data'}</p>
          <strong>Rs{summary.categoryWise[0]?.amount || 0}</strong>
        </div>
      </div>
      <div className='dashboard-section'>
        <div className='dashboard-block'>
          <h4>Date-wise spend</h4>
          {summary.dateWise.length === 0 ? <p>No expenses yet.</p> : (
            <ul className='summary-list'>
              {summary.dateWise.map(item => (
                <li key={item.date}><span>{item.date}</span><strong>Rs{item.amount}</strong></li>
              ))}
            </ul>
          )}
        </div>
        <div className='dashboard-block'>
          <h4>Category spend</h4>
          {summary.categoryWise.length === 0 ? <p>No expense categories yet.</p> : (
            <ul className='summary-list'>
              {summary.categoryWise.map(item => (
                <li key={item.category}><span>{item.category}</span><strong>Rs{item.amount}</strong></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
