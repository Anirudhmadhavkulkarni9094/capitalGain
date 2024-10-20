import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar/Navbar";
import Dashboard from "./Component/Dashboard/Dashboard";
import Homepage from "./Component/Homepage";
import { AuthProvider } from "./Component/Auth/AuthProvider"; // Correct import
import UsersComponent from "./Component/Dashboard/AdminDashboard/UsersComponent";
import InvestmentsComponent from "./Component/Dashboard/AdminDashboard/InvestmentsComponent";
import WithdrawalsComponent from "./Component/Dashboard/AdminDashboard/WithdrawalsComponent";
import PaginatedInvestments from "./Component/Dashboard/UserDashboard/PaginatedInvestments";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import ResetPassword from "./Component/Auth/ResetPassword";
import Login from "./Component/Auth/Login";

function App() {
 

  return (
    <AuthProvider>
      <Router>
        <div className="font-mono">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Conditional routing based on user role */}
                <>
                  <Route path="users" element={<UsersComponent />} />
                  <Route path="investments" element={<InvestmentsComponent />} />
                  <Route path="withdrawals" element={<WithdrawalsComponent />} />
                </>
              
            </Route>

            {/* Redirect for unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/all-investments" element={<PaginatedInvestments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
