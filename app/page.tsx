import { imageUrlToBase64 } from "@/lib/utils";
import { CoingeckoCoinData } from "@/types/coingecko.type";
import Bubbles from "./ui/Bubbles/Bubbles";
import Coins from "./ui/Coins/Coins";

async function getCoins(page: string): Promise<CoingeckoCoinData[]> {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/" +
      "coins/markets?" +
      "vs_currency=usd" +
      "&order=market_cap_desc" +
      "&per_page=100" +
      `&page=${page}` +
      "&sparkline=true" +
      "&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y" +
      "&locale=en" +
      `&x_cg_demo_api_key=${process.env.COINGECKO_API_SECRET_KEY}`
  );

  const data = await response.json();

  return await Promise.all(
    data.map(async (item: CoingeckoCoinData) => {
      const dataUrl = await imageUrlToBase64(item.image);
      return { ...item, image: dataUrl };
    })
  );
}

export default async function Main({
  searchParams,
}: {
  searchParams?: { page: string };
}) {
  const { page = "1" } = searchParams as { page: string };
  const coins = await getCoins(page);

  return (
    <>
      <Bubbles page={page} coins={coins} />
      <Coins coins={coins} />
    </>
  );
}
