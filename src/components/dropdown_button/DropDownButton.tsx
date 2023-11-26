import React, { useState } from 'react';
import "./DropDownButton.css"

interface DropdownButtonProps {
    options: string[];
    defaultSelectedOption: string;
    handleSelectedOption: (option: string, index: number) => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({options, defaultSelectedOption, handleSelectedOption}) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelectedOption)

    const handleOptionChange = (option: string, index: number) => {
        setSelectedOption(option)
        handleSelectedOption(option, index);
    };

    return (
        <div>
            <div className="dropdown">
                <button className="dropbtn">{selectedOption || 'Select an option'}</button>
                <div className="dropdown-content">
                    {options.map((option, index) => (
                        <div key={index} onClick={() => handleOptionChange(option, index)}>
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DropdownButton;