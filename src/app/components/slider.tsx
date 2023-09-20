import React, { useState, useRef, useEffect } from 'react';

function Slider() {
    const [inputWidth, setInputWidth] = useState('auto');
    const numberInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = () => {
        if (numberInputRef.current) {
            setInputWidth(`${numberInputRef.current.scrollWidth}px`);
        }
    };

    useEffect(() => {
        handleInputChange();
    }, []);

    return (
        <div className='flex items-center mt-3 gap-5 w-full'>
            <div className='w-1/2 bg-zinc-800 p-5 rounded-lg'>
                <h1 className='text-2xl font-bold'><span className='text-unibot font-bold'>Transactions</span> Fees In 24 Hours</h1>
                <input 
                    type="number" 
                    ref={numberInputRef}
                    onChange={handleInputChange}
                    style={{ width: inputWidth }}
                    className="bg-transparent border-none outline-none text-xl font-bold" 
                    defaultValue="121" 
                />
                <span className='font-bold text-xl'>ETH</span>
                <input type="range" min="0" max="99999" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
        </div>
    );
}

export default Slider;
