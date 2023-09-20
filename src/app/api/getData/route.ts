import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()
export const revalidate = 0;


interface PricesData {
  ethereumPrice: number;
}

async function fetchPrices(): Promise<PricesData> {
  try {
    const ethereumPriceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&time=${Date.now()}`, {
      next: { revalidate: 0 }
    });

    const ethereumPriceData = await ethereumPriceRes.json();
    const ethereumPrice = ethereumPriceData.ethereum.usd;

    return {
      ethereumPrice: ethereumPrice
    };
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')))
  const prediction = Number(params.get('prediction'));

  try {
    const duneRes = await fetch(`https://api.dune.com/api/v1/query/2636251/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })
    const duneData = await duneRes.json()

    const duneRes2 = await fetch(`https://api.dune.com/api/v1/query/2656557/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })
    const duneData2 = await duneRes2.json()

    const pricesData = await fetchPrices();
    //const unibotPrice = pricesData.unibotPrice;
    const unibotPrice = duneData2.result.rows[0].closePriceUSD;
    const ethereumPrice = pricesData.ethereumPrice;

    const data = {
      annualizedCombinedAPY: numeral(duneData.result.rows[0].annualizedCombinedAPY).format('0,0.00'),
      annualizedCombinedAPR: numeral(duneData.result.rows[0].annualizedCombinedAPR).format('0,0.00'),
      dailyHolderRevenue: numeral(duneData.result.rows[0].combinedHolderRevenue24hETH).format('0,0.00'),
      averageDailyVolumeUSD: numeral(duneData.result.rows[0].averageDailyVolumeUSD).format('0,0.00'),
      unibotMarketcapETH: numeral(duneData2.result.rows[0].mcapUSD ).format('0,0.00'),
      totalNumberOfTransactions: numeral(duneData.result.rows[0].totalNumberOfTransactions).format('0,0'),
      totalNumberOfUsers: numeral(duneData.result.rows[0].totalNumberOfUsers).format('0,0'),
      ethereumPriceNumeral: numeral(ethereumPrice).format('0,0.00'),
      unibotPriceNumeral: numeral(unibotPrice).format('0,0.00'),
      unibotPrice: unibotPrice,
      ethereumPrice: ethereumPrice,
    }

    if(prediction === 1) { 
      const data = {
        annualizedCombinedAPY: duneData.result.rows[0].annualizedCombinedAPY,
        annualizedCombinedAPR: duneData.result.rows[0].annualizedCombinedAPR,
        botFees24hETH: duneData.result.rows[0].botFees24hETH,
        botFeesHolderRevenue24hETH: duneData.result.rows[0].botFeesHolderRevenue24hETH,
        botFeesHolderRevenue30dETH: duneData.result.rows[0].botFeesHolderRevenue30dETH,
        revShareRevenue24hETH: duneData.result.rows[0].revShareRevenue24hETH,
        revShareRevenue30dETH: duneData.result.rows[0].revShareRevenue30dETH,
        unibotMarketcapEligibleForRevshareETH: duneData.result.rows[0].unibotMarketcapEligibleForRevshareETH,
        unibotPrice: unibotPrice,
        ethereumPrice: ethereumPrice,
        ethereumPriceNumeral: numeral(ethereumPrice).format('0,0.00'),
        unibotPriceNumeral: numeral(unibotPrice).format('0,0.00'),
      }

      return NextResponse.json({ data })
    } else {
      return NextResponse.json({ data })
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error() 
  }
}
