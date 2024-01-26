import { CoingeckoCoinData } from "@/types/coingecko.type";
import Image from "next/image";

type Props = {
  coin: CoingeckoCoinData;
};

export default function CoinName({ coin }: Props) {
  return (
    <div className="flex gap-2 items-center z-5">
      <div className="relative w-12 h-12">
        <Image fill src={coin.image} alt={coin.id} />
      </div>
      <span>{coin.name}</span>
      <span className="uppercase">{coin.symbol}</span>
    </div>
  );
}
