import React, { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts components
import { AuthContext } from '../../Auth/AuthProvider';
import axios from 'axios'; // Import axios for making API requests
import { Link } from 'react-router-dom'; // For navigation to the paginated table page
import Transactions from './Transactions';
import { SERVER } from '../../Config/config';
const UserDashboard = () => {
    const { user } = useContext(AuthContext); // Get user from AuthContext
    const [investments, setInvestments] = useState([]); // State to store investments
    const [totalInvestment, setTotalInvestment] = useState(0); // State for total investment
    const [totalReturns, setTotalReturns] = useState(0); // State for total returns
    const [loading, setLoading] = useState(true); // Loading state for initial data fetching
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
    const [investmentAmount, setInvestmentAmount] = useState(''); // State for the investment form input
    const [transactionDetails, setTransactionDetails] = useState(''); // State for transaction details
    const [screenshot, setScreenshot] = useState(null); // State to store the image file
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility for investing
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false); // State to manage modal visibility for withdrawing
    const [withdrawalAmount, setWithdrawalAmount] = useState(''); // State for the withdrawal amount

    useEffect(() => {
        axios.get(`${SERVER}/api/investments/my-investments`, {
            headers: {
                "x-auth-token": localStorage.getItem("token")
            }
        }).then(res => {
            setInvestments(res.data.investments);
            setTotalInvestment(res.data.totalInvestment);
            setTotalReturns(res.data.totalReturns);
            setLoading(false);
        });
    }, [user]);

    const confirmWithdraw = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${SERVER}/api/withdrawals/withdraw`, {
                amount: withdrawalAmount,
            }, {
                headers: {
                    'x-auth-token': localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                }
            });
            alert('Withdrawal request submitted');
            setWithdrawModalOpen(false); // Close the modal
            setWithdrawalAmount(''); // Reset withdrawal amount
        } catch (error) {
            console.error("Error withdrawing money:", error);
            alert("Withdrawal failed");
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }
    };

    // Data for the Pie chart
    const pieChartData = [
        { name: 'Total Investment', value: totalInvestment },
        { name: 'Total Returns', value: totalReturns },
    ];

    const COLORS = ['#4A90E2', '#7ED321'];

    // Handle form submission for investing more
    const handleInvestMore = async (e) => {
        e.preventDefault();

        setIsSubmitting(true); // Disable the button during submission

        const formData = new FormData();
        formData.append('amount', investmentAmount);
        formData.append('transactionDetails', transactionDetails);
        if (screenshot) {
            formData.append('screenshot', screenshot); // Add the file to the FormData
        }

        try {
            const res = await axios.post(`${SERVER}/api/investments/invest`, formData, {
                headers: {
                    'x-auth-token': localStorage.getItem("token"),
                    'Content-Type': 'multipart/form-data', // Use multipart form-data
                }
            });
            alert('Investment successful');
            console.log(res.data);

            // Optionally, update the dashboard with the new investment
            setInvestments([...investments, res.data.investment]);
            setTotalInvestment(totalInvestment + parseFloat(investmentAmount));
            setIsModalOpen(false); // Close the modal on success
        } catch (error) {
            console.error("Error investing more:", error);
            alert("Investment failed");
        } finally {
            setIsSubmitting(false); // Re-enable the button after submission is finished
        }
    };

    const handleScreenshotChange = (e) => {
        setScreenshot(e.target.files[0]); // Update the state with the selected file
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openWithdrawModal = () => {
        setWithdrawModalOpen(true);
    };

    const closeWithdrawModal = () => {
        setWithdrawModalOpen(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const latestInvestments = investments.slice(0, 5);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Welcome, {user?.name}! - balance : {totalReturns+totalInvestment}
                </h1>

                <div className="flex flex-wrap items-center justify-around">
                    {/* Investments Section */}
                    <div className="mb-6 w-full md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Latest 5 Investments</h2>
                        {latestInvestments.length > 0 ? (
                            <ul className="space-y-4">
                                {latestInvestments.map((investment) => (
                                    <li key={investment._id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Amount: ₹{investment?.amount}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Date: {new Date(investment.investmentDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p>{investment.status}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No investments found</p>
                        )}
                        {/* Link to the paginated transactions page */}
                        <div className="mt-4">
                            <Link to="/all-investments" className="text-blue-500 hover:underline">
                                View All Transactions
                            </Link>
                        </div>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="mb-6 w-full md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Investment Summary</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
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

                {/* Withdraw and Invest Buttons */}
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={openModal}
                        className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
                    >
                        Invest More
                    </button>
                    <button
                        onClick={openWithdrawModal}
                        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                    >
                        Withdraw Money
                    </button>
                </div>
            </div>
            <Transactions />

            {/* Modal for Investing More */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Invest More</h2>
                        <form onSubmit={handleInvestMore}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                                <input
                                    type="number"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Transaction Details</label>
                                <input
                                    type="text"
                                    value={transactionDetails}
                                    onChange={(e) => setTransactionDetails(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Upload Screenshot</label>
                                <input
                                    type="file"
                                    onChange={handleScreenshotChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
                                    disabled={isSubmitting} // Disable button while submitting
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Withdrawing */}
            {withdrawModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Withdraw Money</h2>
                        <form onSubmit={confirmWithdraw}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Withdrawal Amount</label>
                                <input
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeWithdrawModal}
                                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                                    disabled={isSubmitting} // Disable button while submitting
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
