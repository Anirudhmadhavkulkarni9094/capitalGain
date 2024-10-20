import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { SERVER } from '../../Config/config';
const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState({
        totalUsers: 0,
        activeUsers: 0,
        dailyInvestments: 0,
        dailyWithdrawals: 0,
        totalInvestedMoney: 0,
        totalReturnsGenerated: 0,
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${SERVER}/analytics`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                });
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalytics();
    }, []);

    // Data for the bar chart (Total Investments and Total Returns)
    const barChartData = [
        { name: 'Total Invested', value: analyticsData.totalInvestedMoney },
        { name: 'Total Returns', value: analyticsData.totalReturnsGenerated }
    ];

    // Data for the pie chart (Total Users, Active Users, Daily Investments, Daily Withdrawals)
    const pieChartData = [
        { name: 'Total Users', value: analyticsData.totalUsers },
        { name: 'Active Users', value: analyticsData.activeUsers },
        { name: 'Daily Investments', value: analyticsData.dailyInvestments },
        { name: 'Daily Withdrawals', value: analyticsData.dailyWithdrawals }
    ];

    // Colors for the Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            <h2 className="text-3xl font-bold mb-8">Analytics Dashboard</h2>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar Chart for Total Investments and Total Returns */}
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Total Invested Money vs Total Returns</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {/* Assign different colors for each bar */}
                            <Bar dataKey="value">
                                {barChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart for Users, Active Users, Daily Investments, Daily Withdrawals */}
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Users and Daily Transactions</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                            >
                                {pieChartData.map((entry, index) => (
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
    );
};

export default AnalyticsDashboard;
