import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";
import TabsBar from "./top_bar/TopBar";
import OrderBook from "./order_book/OrderBook";
import './Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);
    const { isAuthenticated, logoutAuthProvider } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated])

    const logout = async () => {
        await logoutAuthProvider()
    };

    return (
        <div className='dashboard-container'>
            <TabsBar selectedTab={selectedTab} setSelectedTab = {setSelectedTab} handleLogout={logout}/>
            <OrderBook />
        </div>
    );
};

export default Dashboard;
