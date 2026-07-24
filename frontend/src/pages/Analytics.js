import React, { useEffect, useState } from 'react';
import { APIUrl, handleError } from '../utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];

function Analytics() {
    const [daily, setDaily] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDaily = async () => {
        try {
            setLoading(true);
            const url = `${APIUrl}/analytics/daily`;
            const headers = { headers: { 'Authorization': localStorage.getItem('token') } };
            const res = await fetch(url, headers);
            const result = await res.json();
            if (result?.data) setDaily(result.data.map(d => ({ date: d._id, total: d.total })));
        } catch (err) { handleError(err); } finally { setLoading(false); }
    }
    const fetchCategory = async () => {
        try {
            const url = `${APIUrl}/analytics/category`;
            const headers = { headers: { 'Authorization': localStorage.getItem('token') } };
            const res = await fetch(url, headers);
            const result = await res.json();
            if (result?.data) setCategory(result.data.map(d => ({ name: d._id, value: d.total })));
        } catch (err) { handleError(err); }
    }

    useEffect(() => { fetchDaily(); fetchCategory(); }, []);

    return (
        <div className='container'>
            <h2>Analytics</h2>
            {loading && <div>Loading...</div>}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                    <h4>Monthly Expense Trend (daily points)</h4>
                    <ResponsiveContainer width='100%' height={250}>
                        <LineChart data={daily}>
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip />
                            <Line type='monotone' dataKey='total' stroke='#8884d8' />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ width: 350, height: 300 }}>
                    <h4>Expenses by Category</h4>
                    <ResponsiveContainer width='100%' height={250}>
                        <PieChart>
                            <Pie data={category} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80} label>
                                {category.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Analytics;
