import React from 'react';
import './OrderBookCard.css';
import {Order, OrderBookData} from "../OrderBook";

interface OrderBookCardProps {
    orderBookData: OrderBookData;
}

const OrderBookCard: React.FC<OrderBookCardProps> = ({orderBookData}) => {

    const getBackgroundColor = (order: Order) => {
        if (order.UnderlyingAssetWillMove === "UP") {
            if (order.OrderSizeStrengthInPercentage < 25) {
                return "#FFFFFF"
            }
            if (order.OrderSizeStrengthInPercentage < 45) {
                return "#FFF7BC"
            }
            if (order.OrderSizeStrengthInPercentage < 65) {
                return "#C7DCA7"
            }
            if (order.OrderSizeStrengthInPercentage < 85) {
                return "#99B080"
            }
            return "#748E63"
        }
        if (order.UnderlyingAssetWillMove === "DOWN") {
            if (order.OrderSizeStrengthInPercentage < 25) {
                return "#FFFFFF"
            }
            if (order.OrderSizeStrengthInPercentage < 45) {
                return "#FFF7BC"
            }
            if (order.OrderSizeStrengthInPercentage < 65) {
                return "#FFAB76"
            }
            if (order.OrderSizeStrengthInPercentage < 85) {
                return "#FF7D7D"
            }
            return "#FF6969"
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
                        <th className="orders">Cnt</th>
                        <th className="text-right quantity">Size</th>
                        <th className="text-right quantity">Dir.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderBookData.buy_order_depth?.map((depthItem) => {
                        const bgColor = getBackgroundColor(depthItem)
                        return (
                            <tr>
                                <td className="rate">{depthItem.DepthItem.price}</td>
                                <td className="orders" style={{background: bgColor}}>{depthItem.DepthItem.orders}</td>
                                <td className={"text-right quantity"} style={{background: bgColor}}>{depthItem.OrderSizeStrengthInPercentage}%</td>
                                <td className={`text-right quantity`} style={{background: bgColor}}>{depthItem.UnderlyingAssetWillMove == "UP" ? '🟢' : '🟥'}</td>
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
                        <th className="orders">Cnt</th>
                        <th className="text-right quantity">Size</th>
                        <th className="text-right quantity">Dir.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderBookData.sell_order_depth?.map((depthItem) => {
                        const bgColor = getBackgroundColor(depthItem)
                        return (
                            <tr>
                                <td className="rate">{depthItem.DepthItem.price}</td>
                                <td className="orders" style={{background: bgColor}}>{depthItem.DepthItem.orders}</td>
                                <td className={"text-right quantity"} style={{background: bgColor}}>{depthItem.OrderSizeStrengthInPercentage}%</td>
                                <td className={`text-right quantity`} style={{background: bgColor}}>{depthItem.UnderlyingAssetWillMove == "UP" ? '🟢' : '🟥'}</td>
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
