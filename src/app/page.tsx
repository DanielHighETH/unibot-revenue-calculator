'use client'

import { useState, useEffect } from 'react';


interface Calculation {
  usd: number;
  eth: number;
  unibot: number;
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
  hourlyCalculation: { usd: 0.00, eth: 0.00, unibot: 0.00 },
  dailyCalculation: { usd: 0.00, eth: 0.00, unibot: 0.00 },
  weeklyCalculation: { usd: 0.00, eth: 0.00, unibot: 0.00 },
  monthlyCalculation: { usd: 0.00, eth: 0.00, unibot: 0.00 },
  yearlyCalculation: { usd: 0.00, eth: 0.00, unibot: 0.00 },
};

interface StatisticsData {
  annualizedCombinedAPY: string;
  annualizedCombinedAPR: string;
  dailyHolderRevenue: string;
  averageDailyVolumeUSD: string;
  unibotMarketcapETH: string;
  totalNumberOfTransactions: string;
  totalNumberOfUsers: string;
  ethereumPriceNumeral: string;
  unibotPriceNumeral: string;
  ethereumPrice: string;
  unibotPrice: string;
}


const calculateRevenue = async (unibotAmount: number, ethereumPrice: string, unibotPrice: string) => {
  const res = await fetch(`/api/calculate/${unibotAmount}?ethereumPrice=${ethereumPrice}&unibotPrice=${unibotPrice}`, {
    next: { revalidate: 0 }
  });
  const { data }: ApiResponse = await res.json();
  return data;
};


const getData = async (): Promise<StatisticsData> => {
  const res = await fetch('/api/getData', {
    next: { revalidate: 0 }
  });
  const { data }: { data: StatisticsData } = await res.json();
  return data;
};



export default function Home() {
  const [unibotAmount, setUnibotAmount] = useState<number>(0);
  const [data, setData] = useState<ApiData>(initialData);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  useEffect(() => {
    if (unibotAmount >= 50 && statistics) {
      calculateRevenue(unibotAmount, statistics.ethereumPrice, statistics.unibotPrice).then(setData);
    } else {
      setData(initialData);
    }
  }, [unibotAmount, statistics]);


  useEffect(() => {
    getData().then(setStatistics);
  }, []);

  return (
    <div className='mt-10 flex-grow'>
      <h1 className='text-4xl uppercase font-bold'><span className='text-unibot'>Unibot</span> Revenue calculator</h1>
      <h3 className='text-xl'>Calculate your estimated revenue from <span className='text-unibot font-bold'>$UNIBOT</span> easier than ever!</h3>

      <div className='flex flex-col mt-10'>
        <div className='flex items-start flex-col flex-wrap'>
          <p></p>
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
        <td className='flex w-1/4 flex-wrap items-center gap-x-4 p-4'>{data.hourlyCalculation.unibot}<span className='text-unibot font-bold'>$</span></td>
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
          <p className='text-2xl font-bold'>{statistics.annualizedCombinedAPY} %</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Current APR</h1>
          <p className='text-2xl font-bold'>{statistics.annualizedCombinedAPR} %</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Daily Holder Revenue</h1>
          <p className='text-2xl font-bold'>{statistics.dailyHolderRevenue} ETH</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>
        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Average Daily Volume</h1>
          <p className='text-2xl font-bold'>{statistics.averageDailyVolumeUSD} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'><span className='text-unibot'>Unibot</span> Market Cap</h1>
          <p className='text-2xl font-bold'>{statistics.unibotMarketcapETH} ETH</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Total Number Of Transactions</h1>
          <p className='text-2xl font-bold'>{statistics.totalNumberOfTransactions}</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>
        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Ethereum Price</h1>
          <p className='text-2xl font-bold'>{statistics.ethereumPriceNumeral} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'><span className='text-unibot'>$UNIBOT</span> Price</h1>
          <p className='text-2xl font-bold'>{statistics.unibotPriceNumeral} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Total users</h1>
          <p className='text-2xl font-bold'>{statistics.totalNumberOfUsers}</p>
        </div>
      </div>
    </>
  )}
</div>


    </div>
  )
}
