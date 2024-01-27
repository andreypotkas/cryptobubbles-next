import { CoingeckoCoinData } from "@/types/coingecko.type";
import Image from "next/image";
import Link from "next/link";

type Props = {
  coin: CoingeckoCoinData;
};

export default function CoinName({ coin }: Props) {
  return (
    <Link className="flex gap-2 items-center z-5 border-b-2 border-b-zinc-700 hover:border-b-2 hover:border-white pb-2" href={`/coin/${coin.id}`}>
      <div className="relative w-12 h-12">
        <Image fill src={coin.image} alt={coin.id} />
      </div>
      <span>{coin.name}</span>
      <span className="uppercase">{coin.symbol}</span>
    </Link>
  );
}
