import React, {useEffect, useState} from 'react';
import './OrderBookQuadrantsTable.css';
import {Order, OrderBookData} from "../OrderBook";

const OrderBookQuadrantsTable: React.FC<{newOrderBookData: OrderBookData | undefined}> = ({newOrderBookData}) => {
    const [callBuyTableData, setCallBuyTableData] = useState<string[][]>([])
    const [callSellTableData, setCallSellTableData] = useState<string[][]>([])
    const [putBuyTableData, setPutBuyTableData] = useState<string[][]>([])
    const [putSellTableData, setPutSellTableData] = useState<string[][]>([])
    const getTableData = (orderDepth: Order[], timeStamp: string, symbol: string) => {
        return orderDepth?.map((order) => {
            return [timeStamp, symbol, order.DepthItem.price.toString(), order.OrderCountStrengthInPercentage.toString(), order.OrderSizeStrengthInPercentage.toString()]
        })
    }

    const deleteOldTableData = (tableData: string[][]): string[][] => {
        if (tableData.length > 15) {
            tableData = tableData.slice(0, 15)
        }
        return tableData
    }

    useEffect(() => {
        if (newOrderBookData !== undefined) {
            const timeStamp = newOrderBookData.timestamp.slice(11, 19)
            const symbol = newOrderBookData.option_name
            const buyOrderDepth = newOrderBookData.buy_order_depth
            const sellOrderDepth = newOrderBookData.sell_order_depth
            const buyTableData = getTableData(buyOrderDepth, timeStamp, symbol)
            const sellTableData = getTableData(sellOrderDepth, timeStamp, symbol)
            if (buyOrderDepth !== null && buyOrderDepth.length > 0 && buyOrderDepth[0].UnderlyingAssetWillMove == "UP" && buyTableData.length > 0) {
                const newTableData = deleteOldTableData(buyTableData.concat(callBuyTableData))
                setCallBuyTableData(newTableData)
            }
            if (buyOrderDepth !== null && buyOrderDepth.length > 0 && buyOrderDepth[0].UnderlyingAssetWillMove == "DOWN" && buyTableData.length > 0) {
                const newTableData = deleteOldTableData(buyTableData.concat(putBuyTableData))
                setPutBuyTableData(newTableData)
            }
            if (sellOrderDepth !== null && sellOrderDepth.length > 0 && sellOrderDepth[0].UnderlyingAssetWillMove == "UP" && sellTableData.length > 0) {
                const newTableData = deleteOldTableData(sellTableData.concat(putSellTableData))
                setPutSellTableData(newTableData)
            }
            if (sellOrderDepth !== null && sellOrderDepth.length > 0 && sellOrderDepth[0].UnderlyingAssetWillMove == "DOWN" && sellTableData.length > 0) {
                const newTableData = deleteOldTableData(sellTableData.concat(callSellTableData))
                setCallSellTableData(newTableData)
            }
        }
    }, [newOrderBookData])


    const tableHeaders = ['Time', 'Symbol', 'Price', 'Ord Count', 'Ord. Size']
    return (
        <div className="quadrant-layout">
            <div className="quadrant">
                <h3>CALL BUY</h3>
                <Table columns={4} tableData={callBuyTableData} headers={tableHeaders} isBullish={true}/>
            </div>
            <div className="quadrant">
                <h3>Call SELL</h3>
                <Table columns={4} tableData={callSellTableData} headers={tableHeaders} isBullish={false}/>
            </div>
            <div className="quadrant">
                <h3>PUT SELL</h3>
                <Table columns={4} tableData={putSellTableData} headers={tableHeaders} isBullish={true}/>
            </div>
            <div className="quadrant">
                <h3>PUT BUY</h3>
                <Table columns={4} tableData={putBuyTableData} headers={tableHeaders} isBullish={false}/>
            </div>
        </div>
    );
};

const Table: React.FC<{ columns: number,  tableData: string[][], headers: string[], isBullish: boolean}> = ({ columns, tableData ,headers, isBullish}) => {
    const columnWidths: string[] = ['25%', '25%', '10%', '20%', '20%'] // Add an array of column widths
    const getColumnBackgroundColor = (cellIndex: number, perc: string) => {
        if (cellIndex === 3 || cellIndex === 4) {
            const percentage = Math.min(100, Math.max(0, parseInt(perc)));
            if (!isBullish) {
                return `linear-gradient(90deg, #FF6969 ${percentage}%, white ${percentage}%)`;
            }
            return `linear-gradient(90deg, #99B080 ${percentage}%, white ${percentage}%)`;
        }
        return 'transparent';
    };

    return (
        <table>
            <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index} style={{ width: columnWidths[index] }}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ width: columnWidths[cellIndex], background: getColumnBackgroundColor(cellIndex, cell)}}>{cell}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OrderBookQuadrantsTable;
