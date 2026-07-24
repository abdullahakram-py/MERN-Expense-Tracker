import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRefresh } from '../context/RefreshContext';
import TransactionModal from './TransactionModal';
import { APIUrl, handleError, handleSuccess } from '../utils';
import '../login.css';

const navItems = [
  { label: 'Dashboard', path: '/home' },
  { label: 'Income', path: '/income' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Statement', path: '/statement' }
];

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { requestRefresh } = useRefresh();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out');
    navigate('/login');
  };

  const handleSave = async (transaction) => {
    try {
      const url = `${APIUrl}/expenses`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(transaction)
      });
      const result = await response.json();
      if (response.ok) {
        handleSuccess(result.message || 'Transaction saved');
        requestRefresh();
        setModalOpen(false);
      } else {
        handleError(result.message || 'Failed to save transaction');
      }
    } catch (err) {
      handleError(err.message || 'Unable to save transaction');
    }
  };

  return (
    <div className='app-shell'>
      <div className='login-background'></div>
      <aside className='sidebar layout-sidebar'>
        <div className='sidebar-brand'>
          <h2>SpendMate</h2>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='sidebar-footer'>
          <button className='sidebar-add' onClick={() => setModalOpen(true)}>+</button>
          <div className='user-avatar'>AB</div>
          <button className='logout-button' onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className='layout-main'>
        <div className='layout-header'>
          <div>
            <h1>{navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}</h1>
            <p>Track your account activity smoothly.</p>
          </div>
          <button className='header-add' onClick={() => setModalOpen(true)}>+ New</button>
        </div>
        <Outlet />
      </main>
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}

export default Layout;
