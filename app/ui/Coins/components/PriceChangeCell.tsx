import React from "react";

import { Formatter } from "@/lib/formatter";

type Props = {
  value: string;
};

enum CHART_COLORS {
  RED = "#fa9078",
  GREEN = "#38b2ac",
}

function PriceChangeCell({ value }: Props) {
  const color = +value > 0 ? CHART_COLORS.GREEN : CHART_COLORS.RED;
  return (
    <div
      style={{
        background: color,
        color: "white",
        width: "5em",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        textAlign: "center",
      }}
    >
      {Formatter.toPercentage(+value)}
    </div>
  );
}

const MemoizedPriceChangeCell = React.memo(PriceChangeCell);
export default MemoizedPriceChangeCell;
