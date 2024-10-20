import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Get the reset token from the URL
    console.log(token)

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.msg);
        } catch (err) {
            setMessage('Error resetting password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
                    >
                        Reset Password
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
