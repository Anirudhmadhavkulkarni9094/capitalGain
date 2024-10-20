import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider'; // Adjust the path accordingly
import { SERVER } from '../Config/config';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [name, setName] = useState(''); // For registration
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const { login } = useContext(AuthContext); // Access login function from AuthContext

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${SERVER}/api/auth/login`, { email, password });
            const data = response.data;

            if (data?.token) {
                localStorage.setItem('token', data.token);
                login(data.user); // Set the user in the context
                window.location.href = '/dashboard/users'; // Redirect to dashboard
            } else {
                throw new Error('Invalid login response: Missing user or token');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await axios.post(`${SERVER}/api/auth/register`, { name, email, password });
            if (response.status === 201) {
                setSuccess(true);
                setIsLogin(true); // After registration, switch to login view
            } else {
                throw new Error('Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full backdrop-blur-lg absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>

                {isLogin ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {loading ? (
                            <button disabled className="w-full px-4 py-2 text-white bg-gray-400 rounded-md">
                                Loading...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                            >
                                Login
                            </button>
                        )}
                        <div className="mt-2">
                            <a href="/forgot-password" className="text-indigo-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-green-500 text-sm">Registration successful!</div>}
                        {loading ? (
                            <button disabled className="w-full px-4 py-2 text-white bg-gray-400 rounded-md">
                                Loading...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                            >
                                Register
                            </button>
                        )}
                    </form>
                )}

                <p className="text-center">
                    {isLogin ? (
                        <>
                            New to the platform?{' '}
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline"
                                onClick={() => setIsLogin(false)}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline"
                                onClick={() => setIsLogin(true)}
                            >
                                Log in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;
