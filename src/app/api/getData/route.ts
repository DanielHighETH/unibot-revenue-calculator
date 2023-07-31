import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()

interface PricesData {
  unibotPrice: number;
  ethereumPrice: number;
}

async function fetchPrices(): Promise<PricesData> {
  try {
    const unibotPriceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=unibot&vs_currencies=usd&time=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });    
    const unibotPriceData = await unibotPriceRes.json();
    const unibotPrice = unibotPriceData.unibot.usd;

    const ethereumPriceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&time=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    const ethereumPriceData = await ethereumPriceRes.json();
    const ethereumPrice = ethereumPriceData.ethereum.usd;

    return {
      unibotPrice: unibotPrice,
      ethereumPrice: ethereumPrice
    };
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

export async function GET() {

  try {
    const duneRes = await fetch(`https://api.dune.com/api/v1/query/2636251/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    const duneData = await duneRes.json()

    const pricesData = await fetchPrices();
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
      ethereumPriceNumeral: numeral(ethereumPrice).format('0,0.00'),
      unibotPriceNumeral: numeral(unibotPrice).format('0,0.00'),
      unibotPrice: unibotPrice,
      ethereumPrice: ethereumPrice,
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error() 
  }
}
