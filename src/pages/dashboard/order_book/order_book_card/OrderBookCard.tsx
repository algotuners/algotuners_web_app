import React from 'react';
import './OrderBookCard.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';

interface Order {
    symbol: string;
    price: number;
    orderSize: string;
    orderQuantity: number;
    direction: string;
}

interface OrderBookCardProps {
    // You can define any necessary props here
}

const OrderBookCard: React.FC<OrderBookCardProps> = () => {
    // Sample data for demonstration purposes
    const data: Record<string, Order[]> = {
        ITM: [
            { symbol: 'AAPL', price: 150, orderSize: 'Buy', orderQuantity: 10, direction: 'Buy' },
            // Add more rows as needed
        ],
        ATM: [
            { symbol: 'GOOGL', price: 2800, orderSize: 'Sell', orderQuantity: 5, direction: 'Buy' },
            // Add more rows as needed
        ],
        OTM: [
            { symbol: 'MSFT', price: 300, orderSize: 'Buy', orderQuantity: 8, direction: 'Sell' },
            // Add more rows as needed
        ],
    };

    return (
        <div className="table-card">
            HI
        </div>
    );
};

export default OrderBookCard;
