import React from "react";

import { CoingeckoCoinData } from "@/types/coingecko.type";
import { ProgressBar } from "primereact/progressbar";

type Props = {
  data: CoingeckoCoinData;
};

function SupplyCell({ data }: Props) {
  const { circulating_supply, total_supply } = data;

  const valueTemplate = () => {
    const circulatingSupply = Math.round(circulating_supply);
    const totalSupply = total_supply ? Math.round(total_supply) : "None";

    return (
      <span
        style={{
          color: "white",
          fontSize: "0.75rem",
          position: "absolute",
          top: "0px",
          left: "3rem",
        }}
      >
        {circulatingSupply}/<b>{totalSupply}</b>
      </span>
    );
  };
  return <ProgressBar className="text-center text-xs w-64" value={Math.round((circulating_supply / total_supply) * 100)} displayValueTemplate={valueTemplate}></ProgressBar>;
}

const MemoizedSupplyCell = React.memo(SupplyCell);
export default MemoizedSupplyCell;
