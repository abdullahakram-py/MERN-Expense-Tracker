import React, { useEffect, useState } from 'react';
import { APIUrl, handleError } from '../utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];

function Analytics() {
    const [daily, setDaily] = useState([]);
    const [weekly, setWeekly] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [category, setCategory] = useState([]);
    const [view, setView] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ total: 0, count: 0, topCategory: null });

    const buildSummary = (dailyData, categoryData) => {
        const total = dailyData.reduce((sum, item) => sum + (item.total || 0), 0);
        const count = dailyData.length;
        const topCategory = categoryData[0] || null;
        setSummary({ total, count, topCategory });
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const headers = { headers: { 'Authorization': localStorage.getItem('token') } };
            const [dailyRes, weeklyRes, monthlyRes, categoryRes] = await Promise.all([
                fetch(`${APIUrl}/analytics/daily`, headers),
                fetch(`${APIUrl}/analytics/weekly`, headers),
                fetch(`${APIUrl}/analytics/monthly`, headers),
                fetch(`${APIUrl}/analytics/category`, headers)
            ]);
            const [dailyJson, weeklyJson, monthlyJson, categoryJson] = await Promise.all([
                dailyRes.json(),
                weeklyRes.json(),
                monthlyRes.json(),
                categoryRes.json()
            ]);
            if (dailyJson?.data) setDaily(dailyJson.data.map(d => ({ date: d._id, total: d.total })));
            if (weeklyJson?.data) setWeekly(weeklyJson.data.map(d => ({ date: `${d._id.year}-W${String(d._id.week).padStart(2, '0')}`, total: d.total })));
            if (monthlyJson?.data) setMonthly(monthlyJson.data.map(d => ({ date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}`, total: d.total })));
            if (categoryJson?.data) setCategory(categoryJson.data.map(d => ({ name: d._id, value: d.total })));
            buildSummary(dailyJson?.data || [], categoryJson?.data || []);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const chartData = view === 'daily' ? daily : view === 'weekly' ? weekly : monthly;
    const selectedLabel = view === 'daily' ? 'Daily' : view === 'weekly' ? 'Weekly' : 'Monthly';

    return (
        <div className='panel analytics-panel'>
            <div className='panel-header'>
                <div>
                    <h2>Analytics</h2>
                    <p>Track your expense trends by day, week, and month.</p>
                </div>
                <div className='analytics-summary'>
                    <div>
                        <span>Total Spent</span>
                        <strong>Rs{summary.total}</strong>
                    </div>
                    <div>
                        <span>Records</span>
                        <strong>{summary.count}</strong>
                    </div>
                    <div>
                        <span>Top Category</span>
                        <strong>{summary.topCategory?.name || 'None'}</strong>
                    </div>
                </div>
            </div>

            <div className='analytics-controls'>
                {['daily', 'weekly', 'monthly'].map(option => (
                    <button
                        key={option}
                        className={`toggle-button ${view === option ? 'active' : ''}`}
                        onClick={() => setView(option)}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {loading && <div className='analytics-loading'>Loading analytics...</div>}

            <div className='analytics-grid'>
                <div className='chart-card'>
                    <h3>{selectedLabel} Expense Trend</h3>
                    <ResponsiveContainer width='100%' height={320}>
                        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray='4 4' stroke='#e2e8f0' />
                            <XAxis dataKey='date' tick={{ fill: '#4b5563' }} />
                            <YAxis tick={{ fill: '#4b5563' }} />
                            <Tooltip formatter={(value) => `Rs${value}`} />
                            <Line type='monotone' dataKey='total' stroke='#4338ca' strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className='chart-card'>
                    <h3>Expenses by Category</h3>
                    <ResponsiveContainer width='100%' height={320}>
                        <PieChart>
                            <Pie
                                data={category}
                                dataKey='value'
                                nameKey='name'
                                cx='50%'
                                cy='50%'
                                innerRadius={60}
                                outerRadius={100}
                                label
                            >
                                {category.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `Rs${value}`} />
                            <Legend verticalAlign='bottom' height={60} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Analytics;
