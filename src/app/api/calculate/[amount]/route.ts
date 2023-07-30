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

export async function GET(request: Request) {
  const amount: number = Number(request.url.slice(request.url.lastIndexOf('/') + 1))

  const duneRes = await fetch(`https://api.dune.com/api/v1/query/2636251/results?api_key=${process.env.DUNE_API_KEY}`, {
    cache: 'no-store',
  } )
  const duneData = await duneRes.json()

  const pricesData = await getPrices();
  const unibotPrice = pricesData.unibotPrice;
  const ethereumPrice = pricesData.ethereumPrice;


  const annualizedCombinedAPY = duneData.result.rows[0].annualizedCombinedAPY


  const hourlyCalculation = ((annualizedCombinedAPY / 100) * amount * unibotPrice) / 8760
  const dailyCalculation = ((annualizedCombinedAPY / 100) * amount * unibotPrice) / 365
  const weeklyCalculation = ((annualizedCombinedAPY / 100) * amount * unibotPrice) / 52
  const monthlyCalculation = ((annualizedCombinedAPY / 100) * amount * unibotPrice) / 12
  const yearlyCalculation = ((annualizedCombinedAPY / 100) * amount * unibotPrice)

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

  return NextResponse.json({ data })
}