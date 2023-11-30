import React, {useEffect, useState} from "react";
import DropdownButton from "../../../components/dropdown_button/DropDownButton";
import './OrderBook.css'
import OrderBookCard from "./order_book_card/OrderBookCard";
import WebSocketService from "../../../utils/WebSocketService";


export interface DepthItem {
    price: number;
    quantity: number;
    orders: number;
}

export interface Order {
    DepthItem: DepthItem;
    OrderSizeStrengthInPercentage: number;
    OrderCountStrengthInPercentage: number;
    UnderlyingAssetWillMove: 'UP' | 'DOWN';
}

export interface OrderBookData {
    index_name: string;
    option_name: string;
    buy_order_depth: Order[];
    sell_order_depth: Order[];
}

interface OrderBookRequest {
    index_name: string,
    min_order_size: number,
    min_order_quantity: number,
    option_chain_breadth: number,
}

type OrderBookDataMap = Record<string, OrderBookData[]>;
type OrderBookRequestMap = Record<string, OrderBookRequest>;

const OrderBook: React.FC<any> = ({}) => {
    const [webSocketServiceClient, setWebSocketClient] = useState<WebSocketService>()
    const options = ['BANK_NIFTY', 'NIFTY 50', "CRUDE_OIL"]
    const [minOrderSize, setMinOrderSize] = useState(0)
    const [selectedOption, setSelectedOption] = useState(options[0])
    const [minOrderQuantity, setMinOrderQuantity] = useState(0)
    const [breadth, setBreadth] = useState(1)
    const [indexOrderBookData, setIndexOrderBookData] = useState<OrderBookDataMap>({})
    const [userConfigs, setUserConfigs] = useState<OrderBookRequestMap>({})
    const handleSelectedOption = (option: string, index: number) => {
        setSelectedOption(option)
    }

    const handleOnOnConfigChange = () => {
        setUserConfigs((prevState) => {
            const newConfig = {
                index_name: selectedOption,
                min_order_size: minOrderSize,
                min_order_quantity: minOrderQuantity,
                option_chain_breadth: breadth,
            };
            if (
                prevState[selectedOption] === undefined || prevState[selectedOption]?.min_order_size !== minOrderSize ||
                prevState[selectedOption]?.min_order_quantity !== minOrderQuantity ||
                prevState[selectedOption]?.option_chain_breadth !== breadth
            ) {
                webSocketServiceClient?.sendMessage({
                    indexes_config: {
                        ...prevState,
                        [selectedOption]: newConfig,
                    },
                });
            }

            return {
                ...prevState,
                [selectedOption]: newConfig,
            };
        })
    }

    const onWebSocketMessage = (event: MessageEvent<any>) => {
        try {
            const parsedData: OrderBookData = JSON.parse(event.data);
            setIndexOrderBookData((prevState) => {
                let existingData: OrderBookData[] = prevState[parsedData.index_name]
                if (existingData == null) {
                    existingData = [parsedData]
                } else {
                    existingData?.unshift(parsedData)
                }
                if (existingData.length > 5) { existingData.pop() }
                return {
                    ...prevState,
                    [parsedData.index_name]: existingData
                }
            });
        } catch (error) {
            console.error('Error parsing WebSocket data:', error);
        }
    };

    useEffect(() => {
        const webSocketService = new WebSocketService();
        const socketUrl = 'ws://localhost:8090/ws/iobs';
        webSocketService.connect(socketUrl, onWebSocketMessage);
        setWebSocketClient(webSocketService)
        return () => {
            if (webSocketService?.socket?.readyState === 1) { // <-- This is important
                webSocketService.close();
            }
        };
    }, []);

    const OrderBookCardItems = () => {
        return (
            <div className={'grid-container'}>
                {indexOrderBookData[selectedOption]?.map((order, index) => (
                    <OrderBookCard key={index} orderBookData={order} />
                ))}
            </div>
        )
    };

    return (
        <div className='page-container'>
            <div className='strategy-config-container'>
                <h3>Set Configuration</h3>
                <div className='strategy-config-child-container'>
                    <div className='strategy-config-input-container'>
                        <p>Index</p>
                        <DropdownButton options={options} defaultSelectedOption={selectedOption}
                                        handleSelectedOption={handleSelectedOption}/>
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Min Order Size</p>
                        <input
                            type="text"
                            value={minOrderSize}
                            onChange={(e) => {
                                setMinOrderSize(Number(e.target.value))
                            }}
                            placeholder="Min order size"
                        />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Min Order Quantity</p>
                        <input
                            type="text"
                            value={minOrderQuantity}
                            onChange={(e) => {
                                setMinOrderQuantity(Number(e.target.value))
                            }}
                            placeholder="Min order quantity"
                        />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Breadth</p>
                        <input
                            type="text"
                            style={{width: '40px'}}
                            value={breadth}
                            onChange={(e) => {
                                setBreadth(Number(e.target.value))
                            }}
                            placeholder="Breadth"
                        />
                    </div>
                    <button onClick={handleOnOnConfigChange}>Submit Request</button>
                </div>
            </div>
            <div className='divider'></div>
            <OrderBookCardItems />
        </div>
    );
};

export default OrderBook;