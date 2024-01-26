import Header from "@/app/ui/Coin/Header";
import LightWeightChart from "@/app/ui/Coin/LightWeightChart";
import Markets from "@/app/ui/Coin/Markets";
import TradingViewWidget from "@/app/ui/Coin/TradingViewChart";
import { CoingeckoSingleCoinData } from "@/types/coingecko.type";

async function getCoin(id: string): Promise<CoingeckoSingleCoinData> {
  const response = await fetch("https://api.coingecko.com/api/v3/" + `coins/${id}?` + "localization=false" + "&tickers=true" + "&market_data=true" + "&community_data=true");
  return response.json();
}

async function getCoinHistory(id: string) {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=max`);
  const data = await response.json();
  const { market_caps, total_volumes, prices } = data;

  const res = prices.map((item: [number, number], index: number) => {
    item.push(total_volumes[index][1]);
    item.push(market_caps[index][1]);
    return item;
  });
  return res;
}

export default async function CoinPage({ params }: { params: { id: string } }) {
  const history = await getCoinHistory(params.id);
  const coin = await getCoin(params.id);

  return (
    <div className="bg-zinc-950 px-4 py-6 rounded" style={{ maxWidth: "1440px", margin: "0 auto" }}>
      <Header coin={coin} />
      <div className="py-4 text-zinc-500">{coin.description.en}</div>
      <div className="flex flex-col gap-8 h-screen relative">
        <LightWeightChart coinHistory={history} name={coin.name} />
        <TradingViewWidget symbol={coin.symbol} />
      </div>
      <Markets coin={coin} />
    </div>
  );
}
