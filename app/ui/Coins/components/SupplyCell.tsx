import React from "react";

import { ProgressBar } from "primereact/progressbar";

import { CoingeckoCoinData } from "@/types/coingecko.types";

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
  return (
    <div className="w-15rem">
      <ProgressBar
        className="text-center text-xs overflow-visible"
        value={Math.round((circulating_supply / total_supply) * 100)}
        displayValueTemplate={valueTemplate}
      ></ProgressBar>
    </div>
  );
}

const MemoizedSupplyCell = React.memo(SupplyCell);
export default MemoizedSupplyCell;
