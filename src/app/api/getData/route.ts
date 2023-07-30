import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()

export async function GET() {

  const duneRes = await fetch(`https://api.dune.com/api/v1/query/2636251/results?api_key=${process.env.DUNE_API_KEY}`, {
    cache: 'no-store',
  })
  const duneData = await duneRes.json()

  await fetch(`http://localhost:3000/api/savePrice`, {
    cache: 'no-store',
  })

  const pricesRes = await fetch(`http://localhost:3000/api/getPrice`, {
    cache: 'no-store',
  })
  const pricesData = await pricesRes.json()
  console.log(pricesData)
  const unibotPrice = pricesData.data.unibotPrice
  const ethereumPrice = pricesData.data.ethereumPrice

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
}