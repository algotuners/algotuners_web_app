import React, {useEffect, useState} from "react";
import DropdownButton from "../../../components/dropdown_button/DropDownButton";
import './OrderBook.css'
import OrderBookCard from "./order_book_card/OrderBookCard";
import WebSocketService from "../../../utils/WebSocketService";
import {BASE_URL, ROOT_URL} from "../../../api/auth";


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

type OrderBookDataMap = Record<string, Record<string, OrderBookData>>;
type OrderBookRequestMap = Record<string, OrderBookRequest>;

const OrderBook: React.FC<any> = ({}) => {
    const [webSocketServiceClient, setWebSocketClient] = useState<WebSocketService>()
    const options = ['BANK_NIFTY', 'NIFTY 50', "CRUDE_OIL"]
    const [minOrderSize, setMinOrderSize] = useState(1)
    const [selectedOption, setSelectedOption] = useState(options[0])
    const [minOrderQuantity, setMinOrderQuantity] = useState(1)
    const [breadth, setBreadth] = useState(1)
    const [indexOrderBookData, setIndexOrderBookData] = useState<OrderBookDataMap>({})
    const [userConfigs, setUserConfigs] = useState<OrderBookRequestMap>({})
    const handleSelectedOption = (option: string, index: number) => {
        setSelectedOption(option)
    }

    const handleOnOnConfigChange = () => {
        setIndexOrderBookData({})
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
                let existingData: Record<string, OrderBookData> = { ...prevState[parsedData.index_name] };
                let existingDataForInstrument: OrderBookData = existingData[parsedData.option_name];
                if (!existingDataForInstrument) {
                    existingDataForInstrument = parsedData;
                } else {
                    let buyOrders: Order[] = []
                    if (existingDataForInstrument.buy_order_depth) {
                        buyOrders = parsedData.buy_order_depth?.concat(...existingDataForInstrument.buy_order_depth)
                    }
                    let sellOrders: Order[] = []
                    if (existingDataForInstrument.sell_order_depth) {
                        sellOrders = parsedData.sell_order_depth?.concat(...existingDataForInstrument.sell_order_depth)
                    }
                    if (buyOrders && buyOrders.length > 5) {
                        buyOrders = buyOrders.slice(0, 5)
                    }
                    if (sellOrders && sellOrders.length > 5) {
                        sellOrders = sellOrders.slice(0, 5)
                    }
                    if (buyOrders) {
                        existingDataForInstrument.buy_order_depth = buyOrders
                    }
                    if (sellOrders) {
                        existingDataForInstrument.sell_order_depth = sellOrders
                    }
                }
                existingData[parsedData.option_name] = existingDataForInstrument;
                return {
                    ...prevState,
                    [parsedData.index_name]: existingData
                };
            });
        } catch (error) {
            console.error('Error parsing WebSocket data:', error);
        }
    };

    useEffect(() => {
        const webSocketService = new WebSocketService();
        const socketUrl = `wss://${ROOT_URL}/ws/iobs`;
        webSocketService.connect(socketUrl, onWebSocketMessage);
        setWebSocketClient(webSocketService)
        return () => {
            if (webSocketService?.socket?.readyState === 1) {
                webSocketService.close();
            }
        };
    }, []);

    const OrderBookCardItems = () => {
        let cards = []
        let key = 0
        if (indexOrderBookData && Object.prototype.hasOwnProperty.call(indexOrderBookData, selectedOption)) {
            for (const optionName in indexOrderBookData[selectedOption]) {
                const orderBookDataArray = indexOrderBookData[selectedOption][optionName];
                cards.push(<OrderBookCard key={key} orderBookData={orderBookDataArray} />)
                key +=1
            }
        }
        return (
            <div className={'grid-container'}>
                {cards}
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
                        <p>Min order count</p>
                        <input
                            type="text"
                            value={minOrderSize}
                            onChange={(e) => {
                                setMinOrderSize(Number(e.target.value))
                            }}
                            placeholder="Min order count"
                        />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Min avg order quantity</p>
                        <input
                            type="text"
                            value={minOrderQuantity}
                            onChange={(e) => {
                                setMinOrderQuantity(Number(e.target.value))
                            }}
                            placeholder="Min avg order quantity"
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