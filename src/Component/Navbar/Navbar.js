import React, { useState, useContext } from 'react';
import Login from '../Auth/Login';
import {AuthContext} from '../Auth/AuthProvider'; // Adjust path according to your project structure
import { Link } from 'react-router-dom';

function Navbar() {
    const [loginForm, setLoginForm] = useState(false);
    const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        setLoginForm(false); // Close login form if it's open
        window.location.href = "/";
    };

    return (
        <>
            <div className="bg-white flex justify-between items-center px-2 py-2 shadow-lg fixed top-0 w-full z-10 backdrop-blur-lg">
                {/* Logo */}
                <Link to="/">
                    <img src={require('../Assets/Logo.png')} alt="logo" className="w-12" />
                </Link>

                {/* Navigation Links */}
                {user?.isAdmin && <nav className="flex space-x-4">
                    <Link to="/dashboard/users" className="text-gray-700 hover:text-gray-900 font-semibold">
                        Users
                    </Link>
                    <Link to="/dashboard/investments" className="text-gray-700 hover:text-gray-900 font-semibold">
                        Investments
                    </Link>
                    <Link to="/dashboard/withdrawals" className="text-gray-700 hover:text-gray-900 font-semibold">
                        Withdrawals
                    </Link>
                </nav>}

                {/* Login/Logout Button */}
                <div>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => setLoginForm(!loginForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Show Login form only when the login button is clicked and user is not logged in */}
            {!user && loginForm && (
                
                        <Login />
  
            )}
        </>
    );
}

export default Navbar;
