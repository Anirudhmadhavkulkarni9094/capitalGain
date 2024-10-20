import React, { useState } from 'react';
import axios from 'axios';
import { SERVER } from '../Config/config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${SERVER}/api/auth/forgot-password`, { email });
            setMessage(response.data.msg);
        } catch (err) {
            setMessage('Error sending reset email');
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Forgot Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300"
                    >
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="text-sm text-green-500 mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
