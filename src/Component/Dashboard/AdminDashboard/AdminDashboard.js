import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsersComponent from './UsersComponent';
import InvestmentsComponent from './InvestmentsComponent';
import WithdrawalsComponent from './WithdrawalsComponent';

const AdminDashboard = () => {
    return (

            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
                <Routes>
                    {/* Use element instead of component for React Router v6 */}
                    <Route path="/dashboard/users" element={<UsersComponent />} />
                    <Route path="/dashboard/investments" element={<InvestmentsComponent />} />
                    <Route path="/dashboard/withdrawals" element={<WithdrawalsComponent />} />
                </Routes>
            </div>
  
    );
};

export default AdminDashboard;
