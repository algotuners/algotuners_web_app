import React, {useState} from 'react';
import "./TopBar.css"

interface TopBarProps {
    selectedTab: number;
    setSelectedTab: (index: number) => void;
    handleLogout: () => void;
}
const TabsBar: React.FC<TopBarProps> = ({selectedTab, setSelectedTab, handleLogout}) => {
    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    return (
        <div className="top-bar">
            <div className="tabs-container">
                <div
                    className={`tab ${selectedTab === 0 ? 'active' : ''}`}
                    onClick={() => handleTabClick(0)}
                >
                    Index Order Book
                </div>
                {/*<div*/}
                {/*    className={`tab ${selectedTab === 1 ? 'active' : ''}`}*/}
                {/*    onClick={() => handleTabClick(1)}*/}
                {/*>*/}
                {/*    Tab 2*/}
                {/*</div>*/}
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
    </div>
    );
};

export default TabsBar;
