import { CoingeckoCoinData } from "@/types/coingecko.type";
import MarketInfo from "../ui/MarketInfo";

async function getCoins(): Promise<CoingeckoCoinData[]> {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/" +
      "coins/markets?" +
      "vs_currency=usd" +
      "&order=market_cap_desc" +
      "&per_page=250" +
      `&page=${1}` +
      "&sparkline=true" +
      "&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y" +
      "&locale=en" +
      `&x_cg_demo_api_key=${process.env.COINGECKO_API_SECRET_KEY}`
  );

  const data = await response.json();
  return data;
}

export default async function MarketInfoPaage() {
  const coins = await getCoins();

  return <MarketInfo coins={coins} />;
}
