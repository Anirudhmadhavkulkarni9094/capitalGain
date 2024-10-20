import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER } from '../../Config/config';

const Transactions = () => {
    const [transactions, setTransactions] = useState({
        investments: [],
        withdrawals: [],
        user: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`${SERVER}/api/investments/my-transactions`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                setTransactions(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return <p className="text-center text-lg">Loading transactions...</p>;
    }

    // Determine if percentage gain/loss should be red or green
    const percentageClass = transactions.user.percentageGainLoss >= 0 ? 'text-green-500' : 'text-red-500';

    return (
        <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">My Transactions</h2>

            {/* User Summary */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold mb-4">Account Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><strong>Name:</strong> {transactions.user.name}</p>
                    <p><strong>Email:</strong> {transactions.user.email}</p>
                    <p><strong>Total Investment:</strong> ₹{transactions.user.totalInvestment}</p>
                    <p><strong>Total Returns:</strong> ₹{transactions.user.totalReturns} </p>
                    <p className={`font-bold ${percentageClass}`}>
                        <strong>Percentage Gain/Loss:</strong> {transactions.user.percentageGainLoss}%
                    </p>
                </div>
            </div>

            {/* Investment Table */}
            <h3 className="text-xl font-semibold mb-4">Investments</h3>
            {transactions.investments.length > 0 ? (
                <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden mb-8">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.investments.map((investment) => (
                            <tr key={investment._id} className="border-b">
                                <td className="px-4 py-2">₹{investment.amount}</td>
                                <td className="px-4 py-2">{new Date(investment.investmentDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{investment.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No investments found</p>
            )}

            {/* Withdrawal Table */}
            <h3 className="text-xl font-semibold mb-4">Withdrawals</h3>
            {transactions.withdrawals.length > 0 ? (
                <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.withdrawals.map((withdrawal) => (
                            <tr key={withdrawal._id} className="border-b">
                                {console.log(withdrawal)}
                                <td className="px-4 py-2">₹{withdrawal.amount}</td>
                                <td className="px-4 py-2">{new Date(withdrawal.requestDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{withdrawal.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No withdrawals found</p>
            )}
        </div>
    );
};

export default Transactions;
