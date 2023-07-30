import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()

interface PricesData {
  unibotPrice: number;
  ethereumPrice: number;
}

let cachedPricesData: PricesData | null = null;
let cachedPricesTimestamp: number | null = null;

async function fetchPrices(): Promise<PricesData> {
  try {
    const unibotPriceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=unibot&vs_currencies=usd', {
      cache: 'no-store',
    });
    const unibotPriceData = await unibotPriceRes.json();
    const unibotPrice = unibotPriceData.unibot.usd;

    const ethereumPriceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
      cache: 'no-store',
    });
    const ethereumPriceData = await ethereumPriceRes.json();
    const ethereumPrice = ethereumPriceData.ethereum.usd;

    const data: PricesData = {
      unibotPrice: unibotPrice,
      ethereumPrice: ethereumPrice
    };

    cachedPricesData = data;
    cachedPricesTimestamp = new Date().getTime();

    return data;

  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

async function getPrices(): Promise<PricesData> {
  const currentTime = new Date().getTime();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (!cachedPricesData || !cachedPricesTimestamp || (currentTime - cachedPricesTimestamp > fiveMinutes)) {
    return await fetchPrices();
  } else {
    return cachedPricesData;
  }
}


export async function GET() {

  try {
    const duneRes = await fetch(`https://api.dune.com/api/v1/query/2636251/results?api_key=${process.env.DUNE_API_KEY}`, {
      cache: 'no-store',
    })
    const duneData = await duneRes.json()

    const pricesData = await getPrices();
    const unibotPrice = pricesData.unibotPrice;
    const ethereumPrice = pricesData.ethereumPrice;


    const data = {
      annualizedCombinedAPY: numeral(duneData.result.rows[0].annualizedCombinedAPY).format('0,0.00'),
      annualizedCombinedAPR: numeral(duneData.result.rows[0].annualizedCombinedAPR).format('0,0.00'),
      dailyHolderRevenue: numeral(duneData.result.rows[0].combinedHolderRevenue24hETH).format('0,0.00'),
      averageDailyVolumeUSD: numeral(duneData.result.rows[0].averageDailyVolumeUSD).format('0,0.00'),
      unibotMarketcapETH: numeral(duneData.result.rows[0].unibotMarketcapETH).format('0,0.00'),
      totalNumberOfTransactions: numeral(duneData.result.rows[0].totalNumberOfTransactions).format('0,0'),
      totalNumberOfUsers: numeral(duneData.result.rows[0].totalNumberOfUsers).format('0,0'),
      ethereumPrice: numeral(ethereumPrice).format('0,0.00'),
      unibotPrice: numeral(unibotPrice).format('0,0.00'),
    }
    


    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error() 
  }
}