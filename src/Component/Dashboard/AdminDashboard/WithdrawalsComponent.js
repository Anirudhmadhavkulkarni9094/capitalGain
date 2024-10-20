import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER } from '../../Config/config';
const WithdrawalsComponent = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const withdrawalsRes = await axios.get(`${SERVER}/api/admin/withdrawal-requests`, config);
                setWithdrawals(withdrawalsRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch withdrawals');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`${SERVER}/api/admin/withdrawal-requests/${id}/${action}`, {}, config);
            setWithdrawals((prevWithdrawals) => 
                prevWithdrawals.map((withdrawal) => 
                    withdrawal._id === id ? { ...withdrawal, status: action === 'approve' ? 'Approved' : 'Rejected' } : withdrawal
                )
            );
        } catch (err) {
            console.error('Faisled to update withdrawal request:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Withdrawal Requests</h2>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className='px-4 py-2'>Status</th>
                        <th className='px-4 py-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                            <td className="border px-4 py-2">{withdrawal.userId.name}</td>
                            <td className="border px-4 py-2">₹{withdrawal.amount}</td>
                            <td className="border px-4 py-2">{withdrawal.status}</td>
                            <td className="border px-4 py-2 text-center">
                                {withdrawal.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(withdrawal._id, 'approve')}
                                            className="mr-2 bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(withdrawal._id, 'reject')}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ): <button className="mr-2 bg-black text-white px-3 py-1 rounded cursor-not-allowed">No actions</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WithdrawalsComponent;
