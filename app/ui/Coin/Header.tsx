import { convertToUSD } from "@/lib/utils";
import { CoingeckoSingleCoinData } from "@/types/coingecko.type";
import Image from "next/image";

export default function Header({ coin }: { coin: CoingeckoSingleCoinData }) {
  const {
    categories,
    market_cap_rank,
    name,
    image,
    symbol,
    market_data: { current_price },
  } = coin;
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex items-center gap-2">
        <div className="relative rounded border-4 border-zinc-900 overflow-hidden w-24 h-24 shrink-0">
          <Image fill src={image.large} alt="logotip" sizes="(maxWidth: 200px)" priority />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl m-0">
            # {market_cap_rank} {name} {symbol.toUpperCase()}
          </h2>

          <h4 className="text-4xl m-0">{convertToUSD(current_price.usd)}</h4>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((item: string) => (
          <div className="bg-zinc-800 rounded-xl p-1 md:text-base text-sm" key={Math.random()}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
