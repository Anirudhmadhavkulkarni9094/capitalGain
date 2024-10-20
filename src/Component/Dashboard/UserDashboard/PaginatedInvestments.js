import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER } from '../../Config/config';
const PaginatedInvestments = () => {
    const [investments, setInvestments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const investmentsPerPage = 10; // Number of investments per page

    useEffect(() => {
        const fetchInvestments = async () => {
            const res = await axios.get(`${SERVER}/api/investments/my-investments?page=${currentPage}&limit=${investmentsPerPage}`, {
                headers: {
                    "x-auth-token": localStorage.getItem("token")
                }
            });
            setInvestments(res.data.investments);
            setTotalPages(Math.ceil(res.data.totalInvestments / investmentsPerPage));
            setLoading(false);
        };

        fetchInvestments();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">All Investments</h2>
            <table className="table-auto w-full mb-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {investments.map((investment) => (
                        <tr key={investment._id}>
                            <td className="border px-4 py-2">₹{investment.amount}</td>
                            <td className="border px-4 py-2">{new Date(investment.investmentDate).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{investment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaginatedInvestments;
