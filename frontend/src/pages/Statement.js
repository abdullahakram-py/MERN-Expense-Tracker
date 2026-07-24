import React, { useEffect, useState } from 'react';
import { APIUrl, handleError } from '../utils';
import { useRefresh } from '../context/RefreshContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Statement() {
  const { refreshKey } = useRefresh();
  const [transactions, setTransactions] = useState([]);
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
        handleError(result.message || 'Unable to fetch statement');
      }
    } catch (err) {
      handleError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Account Statement', 14, 22);
    const tableData = transactions.map(tx => [
      tx.date ? new Date(tx.date).toLocaleDateString() : '',
      tx.text,
      tx.type,
      tx.category || '-',
      tx.amount
    ]);
    doc.autoTable({
      head: [['Date', 'Description', 'Type', 'Category', 'Amount']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 }
    });
    doc.save('account-statement.pdf');
  };

  useEffect(() => { fetchTransactions(); }, [refreshKey]);

  return (
    <div className='panel'>
      <div className='panel-header'>
        <h2>Account Statement</h2>
        <button className='login-button' onClick={downloadPDF}>Export PDF</button>
      </div>
      {loading ? <p>Loading statement...</p> : (
        transactions.length === 0 ? <p>No transactions yet.</p> : (
          <div className='statement-table'>
            <div className='table-row header'>
              <span>Date</span><span>Description</span><span>Type</span><span>Category</span><span>Amount</span>
            </div>
            {transactions.map(tx => (
              <div className='table-row' key={tx._id || tx.date + tx.amount}>
                <span>{tx.date ? new Date(tx.date).toLocaleDateString() : ''}</span>
                <span>{tx.text}</span>
                <span>{tx.type}</span>
                <span>{tx.category || '-'}</span>
                <span>{tx.type === 'expense' ? '- Rs' + tx.amount : '+ Rs' + tx.amount}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Statement;
