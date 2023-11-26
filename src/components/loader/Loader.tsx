import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loader