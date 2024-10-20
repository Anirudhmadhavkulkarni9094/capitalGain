import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { SERVER } from '../../Config/config';
const AdminUserReturns = () => {
    const { id } = useParams(); // Get userId from the URL
    const [returnsData, setReturnsData] = useState([]);
    const [totalReturns, setTotalReturns] = useState(0);

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`${SERVER}/admin/user/${id}/returns`, config);

                setReturnsData(res.data.dailyReturns);
                setTotalReturns(res.data.totalReturns);
            } catch (err) {
                console.error('Error fetching user returns:', err);
            }
        };

        fetchReturns();
    }, [id]);

    return (
        <div>
            <h2 className="text-xl font-semibold">User's Daily Returns</h2>
            <p>Total Returns: <strong>${totalReturns}</strong></p>
            
            {/* Display Daily Returns in Table */}
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Return Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {returnsData.map((ret, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{new Date(ret.date).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">${ret.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Display Daily Returns in Line Chart */}
            <div className="mt-8">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={returnsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminUserReturns;
