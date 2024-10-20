import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { SERVER } from '../../Config/config';
// Set Modal default styles
Modal.setAppElement('#root'); // Important for accessibility

const InvestmentComponent = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [disabled, setDisabled] = useState({}); // Track disabled buttons

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
                const response = await axios.get(`${SERVER}/api/admin/investments`, {
                    headers: {
                        'x-auth-token': token,
                    },
                });

                console.log(response.data);

                setInvestments(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch investments');
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const openModal = (image) => {
        setModalImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalImage('');
    };

    // Function to approve an investment
    const approveInvestment = async (id) => {
        try {
            const token = localStorage.getItem('token');
            setDisabled((prevState) => ({ ...prevState, [id]: true })); // Disable button
            await axios.put(`http://localhost:5000/api/admin/investment/${id}/approve`, {}, {
                headers: {
                    'x-auth-token': token,
                },
            });
            alert('Investment approved!');
            window.location.reload(); // Reload the page after approval
        } catch (error) {
            setDisabled((prevState) => ({ ...prevState, [id]: false })); // Enable button in case of error
            alert('Failed to approve investment');
        }
    };

    // Function to reject an investment
    const rejectInvestment = async (id) => {
        try {
            const token = localStorage.getItem('token');
            setDisabled((prevState) => ({ ...prevState, [id]: true })); // Disable button
            await axios.put(`http://localhost:5000/api/admin/investment/${id}/reject`, {}, {
                headers: {
                    'x-auth-token': token,
                },
            });
            alert('Investment rejected!');
            window.location.reload(); // Reload the page after rejection
        } catch (error) {
            setDisabled((prevState) => ({ ...prevState, [id]: false })); // Enable button in case of error
            alert('Failed to reject investment');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Admin Investments</h1>
            <table className="table-auto w-full mb-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Screenshot</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {investments.map((investment) => (
                        <tr key={investment._id}>
                            <td className="border px-4 py-2"> ₹{investment.amount}</td>
                            <td className="border px-4 py-2">
                                {investment.screenshot ? (
                                    <div onClick={() => openModal(investment.screenshot)} className="bg-black text-center cursor-pointer text-white px-4 py-2 rounded mr-2">View Proof</div>
                                ) : (
                                    'No screenshot'
                                )}
                            </td>
                            <td className="border px-4 py-2">{new Date(investment.investmentDate).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">
                                {investment.status === 'Pending' ? (
                                    <>
                                        <button
                                            onClick={() => approveInvestment(investment._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                            disabled={disabled[investment._id]} // Disable when clicked
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => rejectInvestment(investment._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            disabled={disabled[investment._id]} // Disable when clicked
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <h1>No action</h1>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal to show the full screenshot */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Screenshot Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        height: '80%',
                    },
                }}
            >
                <img src={modalImage} alt="Full Screenshot" className="w-full" />
                <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">Close</button>
            </Modal>
        </div>
    );
};

export default InvestmentComponent;
