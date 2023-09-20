'use client'

import { useState, useEffect } from 'react';
import numeral from 'numeral';
export const revalidate = 0;


interface Calculation {
    usd: string;
    eth: string;
    unibot: string;
}

interface ApiData {
    hourlyCalculation: Calculation;
    dailyCalculation: Calculation;
    weeklyCalculation: Calculation;
    monthlyCalculation: Calculation;
    yearlyCalculation: Calculation;
}


interface ApiResponse {
    data: ApiData;
}

const initialData: ApiData = {
    hourlyCalculation: { usd: '0.00', eth: '0.00', unibot: '0.00' },
    dailyCalculation: { usd: '0.00', eth: '0.00', unibot: '0.00' },
    weeklyCalculation: { usd: '0.00', eth: '0.00', unibot: '0.00' },
    monthlyCalculation: { usd: '0.00', eth: '0.00', unibot: '0.00' },
    yearlyCalculation: { usd: '0.00', eth: '0.00', unibot: '0.00' },
};

interface StatisticsData {
    annualizedCombinedAPY: number;
    annualizedCombinedAPR: number;
    botFees24hETH: number;
    botFeesHolderRevenue24hETH: number;
    botFeesHolderRevenue30dETH: number;
    revShareRevenue24hETH: number;
    revShareRevenue30dETH: number;
    unibotMarketcapEligibleForRevshareETH: number;
    ethereumPriceNumeral: string;
    unibotPriceNumeral: string;
    ethereumPrice: number;
    unibotPrice: number;
}


const getData = async (): Promise<StatisticsData> => {
    const res = await fetch('/api/getData?prediction=1', {
        next: { revalidate: 0 }
    });
    const { data }: { data: StatisticsData } = await res.json();
    return data;
};




export default function Prediction() {
    const [data, setData] = useState<ApiData>(initialData);
    const [unibotAmount, setUnibotAmount] = useState(0);

    const [unibotPrice, setUnibotPrice] = useState(0);
    const [ethereumPrice, setEthereumPrice] = useState(0);

    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [transactionFees24h, setTransactionFees24h] = useState<number | string>(0);
    const [transactionFees24hWidth, setTransactionFees24hWidth] = useState(getInputWidth('1'));
    const [tradedVolume24h, setTradedVolume24h] = useState<number | string>(0);
    const [tradedVolume24hWidth, setTradedVolume24hWidth] = useState(getInputWidth('1'));

    const [transactionFees30d, setTransactionFees30d] = useState<number | string>(0);
    const [transactionFees30dWidth, setTransactionFees30dWidth] = useState(getInputWidth('1'));
    const [tradedVolume30d, setTradedVolume30d] = useState<number | string>(0);
    const [tradedVolume30dWidth, setTradedVolume30dWidth] = useState(getInputWidth('1'));

    const [unibotMarketCapETH, setUnibotMarketCapETH] = useState(0);

    const [apr24h, setApr24h] = useState(0);
    const [apy24h, setApy24h] = useState(0);

    const [apr30d, setApr30d] = useState(0);
    const [apy30d, setApy30d] = useState(0);

    const [activePeriod, setActivePeriod] = useState('30d');



    useEffect(() => {
        getData().then((data) => {
            setStatistics(data);

            setUnibotMarketCapETH(data.unibotMarketcapEligibleForRevshareETH);

            setTransactionFees24h(parseFloat(data.botFees24hETH.toFixed(3)));
            setTransactionFees24hWidth(getInputWidth(parseFloat(data.botFees24hETH.toFixed(3)).toString()));

            const botFees30dETH = (data.botFeesHolderRevenue30dETH * 100) / 40

            setTransactionFees30d(botFees30dETH.toFixed(3));
            setTransactionFees30dWidth(getInputWidth(botFees30dETH.toFixed(3).toString()));

            const tradedVolume24h = (data.revShareRevenue24hETH / 2) * 100;
            setTradedVolume24h(parseFloat(tradedVolume24h.toFixed(3)));
            setTradedVolume24hWidth(getInputWidth(parseFloat(tradedVolume24h.toFixed(3)).toString()));

            const tradedVolume30d = (data.revShareRevenue30dETH / 2) * 100;
            setTradedVolume30d(parseFloat(tradedVolume30d.toFixed(3)));
            setTradedVolume30dWidth(getInputWidth(parseFloat(tradedVolume30d.toFixed(3)).toString()));

            setApr24h(data.annualizedCombinedAPR);
            setApy24h(data.annualizedCombinedAPY);

            setApr30d(data.annualizedCombinedAPR);
            setApy30d(data.annualizedCombinedAPY);

            setUnibotPrice(data.unibotPrice);
            setEthereumPrice(data.ethereumPrice);

        });
    }, []);

    useEffect(() => {
        if (unibotAmount >= 10 && statistics) {
            calculatePotentionalRevenue(activePeriod);
        } else {
            setData(initialData);
        }
    }, [unibotAmount, statistics]);

    function getInputWidth(value: string): number {
        return value.length * 11 + 8;
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, fees: boolean, period: boolean) {
        const value = e.target.value;

        const isEmptyOrNaN = value === '' || isNaN(Number(value));

        if (isEmptyOrNaN) {
            if (fees) {
                setTransactionFees24h('');
                setTransactionFees24hWidth(getInputWidth('1'));
            } else {
                setTradedVolume24h('');
                setTradedVolume24hWidth(getInputWidth('1'));
            }
            return;
        }

        if (period) {
            if (fees) {
                setTransactionFees24h(parseFloat(value));
                if (Number(value) > 0 && statistics) {
                    calculateAPR(parseFloat(value), true, true);
                    calculateAPY(parseFloat(value), true, true);
                }
                if (parseFloat(value) >= 1) setTransactionFees24hWidth(getInputWidth(value));
            } else {
                setTradedVolume24h(parseFloat(value));
                if (Number(value) > 0 && statistics) {
                    calculateAPR(parseFloat(value), false, true);
                    calculateAPY(parseFloat(value), false, true);
                }
                if (parseFloat(value) >= 1) setTradedVolume24hWidth(getInputWidth(value));
            }
        } else {
            if (fees) {
                setTransactionFees30d(parseFloat(value));
                if (Number(value) > 0 && statistics) {
                    calculateAPR(parseFloat(value), true, false);
                    calculateAPY(parseFloat(value), true, false);
                }
                if (parseFloat(value) >= 1) setTransactionFees30dWidth(getInputWidth(value));
            } else {
                setTradedVolume30d(parseFloat(value));
                if (Number(value) > 0 && statistics) {
                    calculateAPR(parseFloat(value), false, false);
                    calculateAPY(parseFloat(value), false, false);
                }
                if (parseFloat(value) >= 1) setTradedVolume30dWidth(getInputWidth(value));
            }
        }

    }


    function calculateAPR(value: number, fees: boolean, period: boolean) {
        if (period) {
            if (fees) {
                const combinedHolderRevenue24h = (value * 0.4) + (tradedVolume24h as number * 0.02)
                const dailyCombinedAPR = (combinedHolderRevenue24h / unibotMarketCapETH) * 100;
                const annualizedCombinedAPR = dailyCombinedAPR * 365;
                setApr24h(annualizedCombinedAPR);
            } else {
                const combinedHolderRevenue24h = (transactionFees24h as number * 0.4) + (value * 0.02)
                const dailyCombinedAPR = (combinedHolderRevenue24h / unibotMarketCapETH) * 100;
                const annualizedCombinedAPR = dailyCombinedAPR * 365;
                setApr24h(annualizedCombinedAPR);
            }
            calculatePotentionalRevenue('24h');
        } else {
            if (fees) {
                const combinedHolderRevenue30d = (value * 0.4) + (tradedVolume30d as number * 0.02)
                const combinedHolderRevenue30dMA = (combinedHolderRevenue30d / 30)
                const dailyCombinedAPR = (combinedHolderRevenue30dMA / unibotMarketCapETH) * 100;
                const annualizedCombinedAPR = dailyCombinedAPR * 365;
                setApr30d(annualizedCombinedAPR);
            } else {
                const combinedHolderRevenue30d = (transactionFees30d as number * 0.4) + (value * 0.02)
                const combinedHolderRevenue30dMA = (combinedHolderRevenue30d / 30)
                const dailyCombinedAPR = (combinedHolderRevenue30dMA / unibotMarketCapETH) * 100;
                const annualizedCombinedAPR = dailyCombinedAPR * 365;
                setApr30d(annualizedCombinedAPR);
            }
            calculatePotentionalRevenue('30d');
        }
    }

    function calculateAPY(value: number, fees: boolean, period: boolean) {
        if (period) {
            if (fees) {
                const combinedHolderRevenue24h = (value * 0.4) + (tradedVolume24h as number * 0.02)
                const annualizedCombinedApy = ((1 + (combinedHolderRevenue24h) / unibotMarketCapETH) ** 365 - 1) * 100
                setApy24h(annualizedCombinedApy);
            } else {
                const combinedHolderRevenue24h = (transactionFees24h as number * 0.4) + (value * 0.02)
                const annualizedCombinedApy = ((1 + (combinedHolderRevenue24h) / unibotMarketCapETH) ** 365 - 1) * 100
                setApy24h(annualizedCombinedApy)
            }
            calculatePotentionalRevenue('24h');
        } else {
            if (fees) {
                const combinedHolderRevenue30d = (value * 0.4) + (tradedVolume30d as number * 0.02)
                const annualizedCombinedApy = ((1 + (combinedHolderRevenue30d / 30) / unibotMarketCapETH) ** 365 - 1) * 100
                setApy30d(annualizedCombinedApy);
            } else {
                const combinedHolderRevenue30d = (transactionFees30d as number * 0.4) + (value * 0.02)
                const annualizedCombinedApy = ((1 + (combinedHolderRevenue30d / 30) / unibotMarketCapETH) ** 365 - 1) * 100
                setApy30d(annualizedCombinedApy)
            }
            calculatePotentionalRevenue('30d');
        }

    }

    function calculatePotentionalRevenue(period: string) {

        const apy = period === '24h' ? apy24h : apy30d;

        const hourlyCalculation = ((apy / 100) * unibotAmount * unibotPrice) / 8760
        const dailyCalculation = ((apy / 100) * unibotAmount * unibotPrice) / 365
        const weeklyCalculation = ((apy / 100) * unibotAmount * unibotPrice) / 52
        const monthlyCalculation = ((apy / 100) * unibotAmount * unibotPrice) / 12
        const yearlyCalculation = ((apy / 100) * unibotAmount * unibotPrice)

        const data = {
            hourlyCalculation: {
                usd: numeral(hourlyCalculation).format('0,0.00000'),
                eth: numeral(hourlyCalculation / ethereumPrice).format('0,0.00000'),
                unibot: numeral(hourlyCalculation / unibotPrice).format('0,0.00000')
            },
            dailyCalculation: {
                usd: numeral(dailyCalculation).format('0,0.00'),
                eth: numeral(dailyCalculation / ethereumPrice).format('0,0.00000'),
                unibot: numeral(dailyCalculation / unibotPrice).format('0,0.00000')
            },
            weeklyCalculation: {
                usd: numeral(weeklyCalculation).format('0,0.00'),
                eth: numeral(weeklyCalculation / ethereumPrice).format('0,0.00000'),
                unibot: numeral(weeklyCalculation / unibotPrice).format('0,0.00000')
            },
            monthlyCalculation: {
                usd: numeral(monthlyCalculation).format('0,0.00'),
                eth: numeral(monthlyCalculation / ethereumPrice).format('0,0.00000'),
                unibot: numeral(monthlyCalculation / unibotPrice).format('0,0.00000')
            },
            yearlyCalculation: {
                usd: numeral(yearlyCalculation).format('0,0.00'),
                eth: numeral(yearlyCalculation / ethereumPrice).format('0,0.00000'),
                unibot: numeral(yearlyCalculation / unibotPrice).format('0,0.00000')
            }
        }
        setData(data)
    }



    return (
        <div className='mt-10 flex-grow'>
            <h1 className='text-4xl uppercase font-bold'><span className='text-unibot'>Unibot</span> Revenue Prediction Tool</h1>
            <h3 className='text-xl'>Predict your future <span className='text-unibot font-bold'>$UNIBOT</span> revenue</h3>

            <div className='flex flex-col mt-10'>
                <div className='flex items-start flex-col flex-wrap'>
                    <p>
                        <span className='text-unibot font-bold'>$UNIBOT</span> Revenue is calculated using
                        <span className='text-unibot font-bold'> 40 %</span> of transaction fees and
                        <span className='text-unibot font-bold'> 2 %</span> of the total
                        <span className='text-unibot font-bold'> $UNIBOT</span> traded volume
                    </p>
                    <p>
                        This knowledge allows us to play with the data and make our own <span className='text-unibot font-bold'>predictions.</span>
                    </p>
                    <p className='mt-2'>
                        Use the slider below to adjust the DATA or simply <span className='text-unibot font-bold'>rewrite current statistics</span> with your own numbers
                    </p>
                    <p className='mb-4'>
                        and see how much <span className='text-unibot font-bold'>$UNIBOT</span> you can earn!
                    </p>
                    <p>
                        You can choose between two data sets: <span className='text-unibot font-bold'>24 hours</span> and <span className='text-unibot font-bold'>30 days</span>
                    </p>
                    <p className='mb-4'>
                        <span className='text-unibot font-bold'>30 days</span> data set might be <span className='text-unibot font-bold'>more accurate</span> because it is calculating an <span className='text-unibot font-bold'>APR</span> and <span className='text-unibot font-bold'>APY</span> with 30 days <span className='text-unibot font-bold'>moving average.</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-start mb-4">
                <button
                    onClick={() => setActivePeriod('24h')}
                    className={`px-4 py-2 rounded-lg ${activePeriod === '24h' ? 'bg-unibot text-white' : 'bg-zinc-800'}`}
                >
                    24 Hours
                </button>
                <button
                    onClick={() => setActivePeriod('30d')}
                    className={`px-4 py-2 rounded-lg ml-4 ${activePeriod === '30d' ? 'bg-unibot text-white' : 'bg-zinc-800'}`}
                >
                    30 Days
                </button>
            </div>

            <div className='flex flex-wrap md:flex-nowrap items-center mt-3 gap-5 w-full'>
                <div className='w-full md:w-1/2 bg-zinc-800 p-5 rounded-lg'>
                    <h1 className='text-2xl font-bold'>
                        <span className='text-unibot font-bold'>Transactions</span> Fees In {activePeriod === '24h' ? '24 Hours' : '30 Days'}
                    </h1>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={activePeriod === '24h' ? transactionFees24h : transactionFees30d}
                            onChange={activePeriod === '24h' ? (e) => handleInputChange(e, true, true) : (e) => handleInputChange(e, true, false)}
                            style={{ width: `${activePeriod === '24h' ? transactionFees24hWidth : transactionFees30dWidth}px` }}
                            className="font-bold text-xl bg-transparent border-none outline-none mr-1"
                        />
                        <span className='font-bold text-xl'>ETH</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={activePeriod === '24h' ? "100" : "3000"}
                        value={activePeriod === '24h' ? transactionFees24h : transactionFees30d}
                        onChange={activePeriod === '24h' ? (e) => handleInputChange(e, true, true) : (e) => handleInputChange(e, true, false)}
                        step={activePeriod === '24h' ? "1" : "10"}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>

                <div className='w-full md:w-1/2 bg-zinc-800 p-5 rounded-lg'>
                    <h1 className='text-2xl font-bold'>
                        Total <span className='text-unibot font-bold'>$UNIBOT</span> Volume In {activePeriod === '24h' ? '24 Hours' : '30 Days'}
                    </h1>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={activePeriod === '24h' ? tradedVolume24h : tradedVolume30d}
                            onChange={activePeriod === '24h' ? (e) => handleInputChange(e, false, true) : (e) => handleInputChange(e, false, false)}
                            style={{ width: `${activePeriod === '24h' ? tradedVolume24hWidth : tradedVolume30dWidth}px` }}
                            className="font-bold text-xl bg-transparent border-none outline-none mr-1"
                        />
                        <span className='font-bold text-xl'>ETH</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={activePeriod === '24h' ? "10000" : "100000"}
                        value={activePeriod === '24h' ? tradedVolume24h : tradedVolume30d}
                        onChange={activePeriod === '24h' ? (e) => handleInputChange(e, false, true) : (e) => handleInputChange(e, false, false)}
                        step="10"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>
            </div>



            <div className='flex items-center mt-3 gap-5 w-full justify-center'>
                <div className='w-1/2 md:w-1/6 bg-zinc-800 p-5 rounded-lg text-right'>
                    <h1 className='text-2xl font-bold'><span className='text-unibot font-bold'>APR</span></h1>
                    <span className='font-bold text-xl'>{activePeriod === '24h' ? apr24h.toFixed(3) : apr30d.toFixed(3)} %</span>
                </div>

                <div className='w-1/2 md:w-1/6 bg-zinc-800 p-5 rounded-lg'>
                    <h1 className='text-2xl font-bold'><span className='text-unibot font-bold'>APY</span></h1>
                    <span className='font-bold text-xl'>{activePeriod === '24h' ? apy24h.toFixed(3) : apy30d.toFixed(3)} %</span>
                </div>
            </div>

            <div className='flex items-start mt-3 flex-col flex-wrap'>
                <p><span className='text-unibot font-bold text-xl'>$UNIBOT</span> amount: </p>

                <input
                    type='number'
                    className='border-2 border-zinc-600 bg-transparent w-30 px-2 py-1'
                    placeholder='1337'
                    onChange={e => setUnibotAmount(parseFloat(e.target.value))}
                ></input>

                <div className='overflow-auto border border-zinc-700 mt-5 w-full'>
                    <table className='w-full'>
                        <thead className='border-b border-zinc-700'>
                            <tr className='flex'>
                                <th className='flex w-1/4 items-center p-4 text-left font-semibold tracking-wide'>Timeframe</th>
                                <th className='flex w-1/4 items-center p-4 text-left font-semibold tracking-wide'>UNIBOT Revenue </th>
                                <th className='flex w-1/4 items-center p-4 text-left font-semibold tracking-wide'>ETH Revenue</th>
                                <th className='flex w-1/4 items-center p-4 text-left font-semibold tracking-wide'>USD Revenue</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-zinc-700'>
                            {data && (
                                <>
                                    <tr className='flex'>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>Hourly</td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.hourlyCalculation.unibot} <span className='text-unibot font-bold'>$UNIBOT</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.hourlyCalculation.eth} <span className='text-unibot font-bold'>ETH</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.hourlyCalculation.usd}<span className='text-unibot font-bold'>$</span></td>
                                    </tr>
                                    <tr className='flex'>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>Daily</td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.dailyCalculation.unibot} <span className='text-unibot font-bold'>$UNIBOT</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.dailyCalculation.eth} <span className='text-unibot font-bold'>ETH</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.dailyCalculation.usd}<span className='text-unibot font-bold'>$</span></td>
                                    </tr>
                                    <tr className='flex'>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>Weekly</td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.weeklyCalculation.unibot} <span className='text-unibot font-bold'>$UNIBOT</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.weeklyCalculation.eth} <span className='text-unibot font-bold'>ETH</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.weeklyCalculation.usd}<span className='text-unibot font-bold'>$</span></td>
                                    </tr>
                                    <tr className='flex'>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>Monthly</td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.monthlyCalculation.unibot}<span className='text-unibot font-bold'>$UNIBOT</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.monthlyCalculation.eth} <span className='text-unibot font-bold'>ETH</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.monthlyCalculation.usd} <span className='text-unibot font-bold'>$</span></td>
                                    </tr>
                                    <tr className='flex'>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>Yearly</td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.yearlyCalculation.unibot}<span className='text-unibot font-bold'>$UNIBOT</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.yearlyCalculation.eth} <span className='text-unibot font-bold'>ETH</span></td>
                                        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.yearlyCalculation.usd} <span className='text-unibot font-bold'>$</span></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='mt-10 flex flex-col'>
                <h1 className='text-2xl uppercase font-bold'>
                    Live <span className='text-unibot'>Unibot</span> Statistics
                </h1>

                {statistics && (
                    <>
                        <div className='flex flex-col md:flex-row gap-5 mt-5'>
                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'>Current APY</h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.annualizedCombinedAPY).format('0,0.00')} %</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'>Current APR</h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.annualizedCombinedAPR).format('0,0.00')} %</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'>Bot Fees in <span className='text-unibot'>24 Hours</span></h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.botFees24hETH).format('0,0.00')} ETH</p>
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row gap-5 mt-5'>

                            
                        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'><span className='text-unibot'>$UNIBOT</span> Market Cap <span className='text-unibot'>Eligible</span> for Revenue Share</h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.unibotMarketcapEligibleForRevshareETH).format('0,0.00')} ETH</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'>Holder Revenue From Bot Fees in <span className='text-unibot'>30 Days</span></h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.botFeesHolderRevenue30dETH).format('0,0.00')} ETH</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'><span className='text-unibot'>$UNIBOT</span> Trading Volume Revenue in <span className='text-unibot'>24 Hours</span></h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.revShareRevenue24hETH).format('0,0.00')} ETH</p>
                            </div>
                        </div>


                        <div className='flex flex-col md:flex-row gap-5 mt-5'>
                        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'><span className='text-unibot'>$UNIBOT</span> Trading Volume Revenue in <span className='text-unibot'>30 Days</span></h1>
                                <p className='text-2xl font-bold'>{numeral(statistics.revShareRevenue30dETH).format('0,0.00')} ETH</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'><span className='text-unibot'>Ethereum</span> Price</h1>
                                <p className='text-2xl font-bold'>{statistics.ethereumPriceNumeral} $</p>
                            </div>

                            <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
                                <h1 className='text-xl font-bold'><span className='text-unibot'>$UNIBOT</span> Price</h1>
                                <p className='text-2xl font-bold'>{statistics.unibotPriceNumeral} $</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}