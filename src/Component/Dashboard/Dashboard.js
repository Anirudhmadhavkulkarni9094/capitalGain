import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import { AuthContext } from '../Auth/AuthProvider';
import UserDashboard from './UserDashboard/UserDashboard';


const Dashboard = () => {

    const {user}   = useContext(AuthContext);


    useEffect(()=>{

        console.log("Mounted")
    })
      return (
        <div className=" mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
        
            {/* This is where the nested route components will be rendered */}
            
           {user?.isAdmin ? <Outlet /> : <UserDashboard/>}
        </div>
    );
};

export default Dashboard;
