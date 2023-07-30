import { writeFileSync, statSync, existsSync } from 'fs';
import { NextResponse } from 'next/server'




async function fetchAndSavePrices() {
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
  
      const data = {
        unibotPrice: unibotPrice,
        ethereumPrice: ethereumPrice
      };
  
      writeFileSync('prices.json', JSON.stringify(data, null, 2));
  
    } catch(error) {
      console.error(`Error: ${error}`);
    }
  }

  export async function GET(request: Request) {
    const filepath = 'prices.json';
    
    if (existsSync(filepath)) {
      const stats = statSync(filepath);
      const currentTime = new Date().getTime();
      const lastModifiedTime = new Date(stats.mtime).getTime();
      const fiveMinutes = 5 * 60 * 1000; 
  
      if ((currentTime - lastModifiedTime) > fiveMinutes) {
        await fetchAndSavePrices();
      }
    } else {
      await fetchAndSavePrices();
    }
  
    return NextResponse.json({ done: true })
  }