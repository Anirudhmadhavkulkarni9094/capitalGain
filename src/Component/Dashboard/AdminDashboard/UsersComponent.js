import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER } from '../../Config/config';
const UsersComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [returns, setReturns] = useState({}); // Track the return values for users

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const usersRes = await axios.get(`${SERVER}/api/admin/users`, config);
                setUsers(usersRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateUserStatus = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`${SERVER}/api/admin/user/${userId}/status`, { joinRequestStatus: 'Approved' }, config);
            const usersRes = await axios.get(`${SERVER}/api/admin/users`, config);
            setUsers(usersRes.data);
            alert('User status updated to Approved');
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const updateUserReturns = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`${SERVER}/api/admin/investment/${userId}/returns`, { generatedReturns: returns[userId] }, config);
            alert('User returns updated successfully');
        } catch (err) {
            alert('Failed to update user returns');
        }
    };

    const handleReturnChange = (userId, value) => {
        setReturns((prevReturns) => ({
            ...prevReturns,
            [userId]: value,
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <table className="table-auto w-full mb-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Returns</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.joinRequestStatus}</td>
                            <td className="border px-4 py-2">
                                <input
                                    type="number"
                                    value={returns[user._id] || ''}
                                    onChange={(e) => handleReturnChange(user._id, e.target.value)}
                                    className="border p-2"
                                    placeholder="Enter returns"
                                />
                                <button
                                    onClick={() => updateUserReturns(user._id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                >
                                    Update Returns
                                </button>
                            </td>
                            <td className="border px-4 py-2">
                                {user.joinRequestStatus !== 'Approved' ? (
                                    <button
                                        onClick={() => updateUserStatus(user._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Approve
                                    </button>
                                ) : (
                                    <button className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed">
                                        Approved
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersComponent;
