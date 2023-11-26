import React, {useState} from "react";
import DropdownButton from "../../../components/dropdown_button/DropDownButton";
import './OrderBook.css'
import OrderBookCard from "./order_book_card/OrderBookCard";
const OrderBook: React.FC<any> = ({}) => {
    const options = ['Bank-Nifty', 'Nifty', 'Sensex', "Fin-Nifty"]
    const [minOrderSize, setMinOrderSize] = useState(0)
    const [minOrderQuantity, setMinOrderQuantity] = useState(0)
    const [breadth, setBreadth] = useState(0)

    const handleSelectedOption = (option: string, index: number) => {
        console.log(option, index)
    }

    const handleOnOnConfigChange = () => {

    }

    return (
        <div className='page-container'>
            <div className='strategy-config-container'>
                <h3>Set Configuration</h3>
                <div className='strategy-config-child-container'>
                    <div className='strategy-config-input-container'>
                        <p>Index</p>
                        <DropdownButton options={options} defaultSelectedOption='Bank-Nifty' handleSelectedOption={handleSelectedOption} />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Min Order Size</p>
                        <input
                            type="text"
                            value={minOrderSize}
                            onChange={(e) => {setMinOrderSize(Number(e.target.value))}}
                            placeholder="Min order size"
                        />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Min Order Quantity</p>
                        <input
                            type="text"
                            value={minOrderQuantity}
                            onChange={(e) => {setMinOrderQuantity(Number(e.target.value))}}
                            placeholder="Min order quantity"
                        />
                    </div>
                    <div className='strategy-config-input-container'>
                        <p>Breadth</p>
                        <input
                            type="text"
                            style={{width: '40px'}}
                            value={minOrderSize}
                            onChange={(e) => {setBreadth(Number(e.target.value))}}
                            placeholder="Min order quantity"
                        />
                    </div>
                    <button onClick={handleOnOnConfigChange}>Submit Request</button>
                </div>
            </div>
            <div className='divider'></div>
            <OrderBookCard />
        </div>
    );
};

export default OrderBook;