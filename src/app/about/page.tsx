import { useEffect } from 'react';
import { useRouter } from 'next/navigation'


export default function About() {
    
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined' && window.location.host !== 'unibot-revenue-calculator.com') {
        router.push('https://unibot-revenue-calculator.com/about');}
    }, []);
    return (
        <div className='mt-10 flex-grow'>
            <h1 className='text-4xl uppercase font-bold'>About the <span className='text-unibot'>Unibot</span> Revenue Calculator</h1>
            <div className="text-lg w-1/2 text-justify max-sm:w-full">
                <p>
                    Welcome to the <span className='text-unibot font-bold'>Unibot</span> Revenue Calculator, a tool designed for everyone who is interested in the <span className='text-unibot font-bold'>Unibot</span> revenue rewards. 
                    This platform provides a means to estimate the potential earnings one could make from holding the <span className='text-unibot font-bold'>$UNIBOT</span>.
                </p>
            </div>

            <h1 className='text-4xl uppercase font-bold mt-5'>Why the <span className='text-unibot'>Unibot</span> Revenue Calculator</h1>
            <div className="text-lg w-1/2 text-justify max-sm:w-full">
                <p>
                    This calculator has been designed to help prospective and current holders estimate the potential earnings from <span className='text-unibot font-bold'>Unibot</span>. It allows you to input the amount of <span className='text-unibot font-bold'>Unibot</span> you hold (or plan to hold) and provides an estimate of your revenue in various timeframes - hourly, daily, weekly, monthly, and yearly.
                </p>
                <p>
                    It&apos;s important to remember that the results generated are estimations and may not perfectly represent the exact revenues to be obtained. They are dependent on real-time data and market conditions, which can be unpredictable.
                </p>
            </div>

            <h1 className='text-4xl uppercase font-bold mt-5'>Where Does the <span className='text-unibot'>Data</span> Come From?</h1>
            <div className="text-lg w-1/2 text-justify max-sm:w-full">
                <p>
                    Price data such as <span className='text-unibot font-bold'>$UNIBOT</span> and Ethereum prices are sourced directly from <a href="https://coingecko.com/" target="blank" className='text-sky-500 hover:text-sky-400 hover:underline'>CoinGecko</a>. Meanwhile, the information regarding <span className='text-unibot font-bold'>Unibot</span> revenue and other statistics are from <a href="https://dune.com/whale_hunter/unibot-revenue" target="blank" className='text-sky-500 hover:text-sky-400 hover:underline'>@Whale_hunter&apos;s dune dashboard</a>.
                </p>
            </div>

            <h1 className='text-4xl uppercase font-bold mt-5'>Future Features<span className='text-unibot'> &</span> Updates</h1>
            <div className="text-lg w-1/2 text-justify max-sm:w-full">
                <p>
                    Atleast two more features will be added in a future update: 
                </p>
                <p>
                <span className='text-unibot font-bold'>Unibot revenue prediction</span> tool and a <span className='text-unibot font-bold'>Wallet checker</span>. 
                </p>
            </div>
        </div>
    );
}