import { PriceChangePercentage } from "@/types/bubbles.types";
import clsx from "clsx";
import React from "react";

type Props = {
  page: string;
  bubbleSort: PriceChangePercentage;
  setBubbleSort: React.Dispatch<React.SetStateAction<PriceChangePercentage>>;
};

export default function NavigationBar({ page, bubbleSort, setBubbleSort }: Props) {
  const items = [
    { label: "hour", sortValue: PriceChangePercentage.HOUR },
    { label: "day", sortValue: PriceChangePercentage.DAY },
    { label: "week", sortValue: PriceChangePercentage.WEEK },
    { label: "month", sortValue: PriceChangePercentage.MONTH },
    { label: "year", sortValue: PriceChangePercentage.YEAR },
  ];
  return (
    <ul className="flex gap-1 md:justify-start justify-between w-full py-2">
      {items.map((item, index) => {
        return (
          <li
            className={clsx("p-2 bg-zinc-800 cursor-pointer text-white hover:border-lime-500 hover:border-b-2 ronded-t-lg", item.sortValue === bubbleSort && "border-b-2 border-lime-500")}
            key={Math.random()}
            onClick={() => setBubbleSort(item.sortValue)}
          >
            <span className="font-bold">{item.label.toUpperCase()}</span>
          </li>
        );
      })}
    </ul>
  );
}
