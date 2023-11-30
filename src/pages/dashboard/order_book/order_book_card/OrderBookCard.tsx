import React from 'react';
import './OrderBookCard.css';
import {Order, OrderBookData} from "../OrderBook";

interface OrderBookCardProps {
    orderBookData: OrderBookData;
}

const OrderBookCard: React.FC<OrderBookCardProps> = ({orderBookData}) => {

    const getBackgroundColor = (order: Order) => {
        if (order.OrderCountStrengthInPercentage > 50 || order.OrderSizeStrengthInPercentage > 50) {
            if (order.UnderlyingAssetWillMove === "UP") {
                return "#B3FFAE"
            }
            if (order.UnderlyingAssetWillMove === "DOWN") {
                return "#FF9F9F"
            }
        }
        return "#FFFFFF"
    }

    return (
        <div className="order-book-card-depth-table">
            <h3>{orderBookData.option_name}</h3>
            <div className="row">
                <table className="six columns buy table-container">
                    <thead>
                    <tr>
                        <th className="order-price"><span>Bid</span></th>
                        <th className="orders">Orders</th>
                        <th className="text-right quantity">Qty.</th>
                        <th className="text-right quantity">Dir.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderBookData.buy_order_depth.map((depthItem) => {
                        return (
                            <tr>
                                <td className="rate">{depthItem.DepthItem.price}</td>
                                <td className="orders" style={{background: getBackgroundColor(depthItem)}}>{depthItem.OrderCountStrengthInPercentage}%</td>
                                <td className={"text-right quantity"} style={{background: getBackgroundColor(depthItem)}}>{depthItem.OrderSizeStrengthInPercentage}%</td>
                                <td className={`text-right quantity`} style={{background: getBackgroundColor(depthItem)}}>{depthItem.UnderlyingAssetWillMove == "UP" ? '🟢' : '🟥'}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    {/*<tfoot>*/}
                    {/*<tr>*/}
                    {/*    <td>Total</td>*/}
                    {/*    <td colSpan={2} className="text-right">4</td>*/}
                    {/*</tr>*/}
                    {/*</tfoot>*/}
                </table>

                <table className="six columns sell table-container">
                    <thead>
                    <tr>
                        <th className="order-price"><span>Offer</span></th>
                        <th className="orders">Orders</th>
                        <th className="text-right quantity">Qty.</th>
                        <th className="text-right quantity">Dir.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderBookData.sell_order_depth.map((depthItem) => {
                        return (
                            <tr>
                                <td className="rate">{depthItem.DepthItem.price}</td>
                                <td className="orders" style={{background: getBackgroundColor(depthItem)}}>{depthItem.OrderCountStrengthInPercentage}%</td>
                                <td className={"text-right quantity"} style={{background: getBackgroundColor(depthItem)}}>{depthItem.OrderSizeStrengthInPercentage}%</td>
                                <td className={`text-right quantity`} style={{background: getBackgroundColor(depthItem)}}>{depthItem.UnderlyingAssetWillMove == "UP" ? '🟢' : '🟥'}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    {/*<tfoot>*/}
                    {/*<tr>*/}
                    {/*    <td>Total</td>*/}
                    {/*    <td colSpan={2} className="text-right">3</td>*/}
                    {/*</tr>*/}
                    {/*</tfoot>*/}
                </table>
            </div>
        </div>
    );
};

export default OrderBookCard;
