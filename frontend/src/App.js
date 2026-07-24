import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Statement from './pages/Statement';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Layout from './components/Layout';
import { RefreshProvider } from './context/RefreshContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />
  }

  return (
    <RefreshProvider>
      <div className="App">
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<PrivateRoute element={<Layout />} />}>
            <Route path='home' element={<Dashboard />} />
            <Route path='income' element={<Income />} />
            <Route path='expenses' element={<Expenses />} />
            <Route path='analytics' element={<Analytics />} />
            <Route path='statement' element={<Statement />} />
          </Route>
        </Routes>
      </div>
    </RefreshProvider>
  );
}

export default App;
