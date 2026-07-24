import React, { useEffect, useState } from 'react';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Budget() {
    const [budget, setBudget] = useState({ daily: 0, weekly: 0, monthly: 0 });
    const [loading, setLoading] = useState(false);

    const fetchBudget = async () => {
        try {
            setLoading(true);
            const url = `${APIUrl}/budgets`;
            const headers = { headers: { 'Authorization': localStorage.getItem('token') } };
            const res = await fetch(url, headers);
            const result = await res.json();
            if (result?.data) setBudget(result.data);
        } catch (err) {
            handleError(err);
        } finally { setLoading(false); }
    }

    useEffect(() => { fetchBudget(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBudget(prev => ({ ...prev, [name]: value }));
    }

    const save = async () => {
        try {
            const url = `${APIUrl}/budgets`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ daily: Number(budget.daily), weekly: Number(budget.weekly), monthly: Number(budget.monthly) })
            };
            const res = await fetch(url, headers);
            const result = await res.json();
            if (res.ok) {
                handleSuccess(result.message);
                setBudget(result.data);
            } else {
                handleError(result.message || 'Failed to save budget');
            }
        } catch (err) {
            handleError(err);
        }
    }

    const remove = async () => {
        try {
            const url = `${APIUrl}/budgets`;
            const headers = { headers: { 'Authorization': localStorage.getItem('token') }, method: 'DELETE' };
            const res = await fetch(url, headers);
            const result = await res.json();
            if (res.ok) {
                handleSuccess(result.message);
                setBudget({ daily: 0, weekly: 0, monthly: 0 });
            } else {
                handleError(result.message || 'Failed to delete budget');
            }
        } catch (err) { handleError(err); }
    }

    return (
        <div className='container'>
            <h2>Budget</h2>
            {loading ? <div>Loading...</div> : (
                <div>
                    <div>
                        <label>Daily Budget</label>
                        <input type='number' name='daily' value={budget.daily} onChange={handleChange} min={0} />
                    </div>
                    <div>
                        <label>Weekly Budget</label>
                        <input type='number' name='weekly' value={budget.weekly} onChange={handleChange} min={0} />
                    </div>
                    <div>
                        <label>Monthly Budget</label>
                        <input type='number' name='monthly' value={budget.monthly} onChange={handleChange} min={0} />
                    </div>
                    <button onClick={save}>Save Budget</button>
                    <button onClick={remove}>Delete Budget</button>
                </div>
            )}
        </div>
    )
}

export default Budget;
