import React from "react";

import { CoingeckoCoinData } from "@/types/coingecko.types";

type Props = {
  coin: CoingeckoCoinData;
};

function CoinName({ coin }: Props) {
  return (
    <div className="flex gap-2 align-items-center z-5">
      <img width={30} height={30} src={coin.image} alt={coin.id} />
      <span className="hidden-mob">{coin.name}</span>
      <span className="text-primary uppercase">{coin.symbol}</span>
    </div>
  );
}

const MemoizedCoinName = React.memo(CoinName);
export default MemoizedCoinName;
