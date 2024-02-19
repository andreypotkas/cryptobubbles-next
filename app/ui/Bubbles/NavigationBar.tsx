import { PriceChangePercentage } from "@/types/bubbles.types";
import clsx from "clsx";
import React from "react";

type Props = {
  bubbleSort: PriceChangePercentage;
  setBubbleSort: React.Dispatch<React.SetStateAction<PriceChangePercentage>>;
};

export default function NavigationBar({ bubbleSort, setBubbleSort }: Props) {
  const items = [
    { label: "hour", sortValue: PriceChangePercentage.HOUR },
    { label: "day", sortValue: PriceChangePercentage.DAY },
    { label: "week", sortValue: PriceChangePercentage.WEEK },
    { label: "month", sortValue: PriceChangePercentage.MONTH },
    { label: "year", sortValue: PriceChangePercentage.YEAR },
  ];
  return (
    <ul className="flex gap-1  w-full pt-1   md:py-2 fixed w-full bottom-0 left-0 md:static bg-zinc-950 md:bg-transparent">
      {items.map((item, index) => {
        return (
          <li
            className={clsx(
              "p-2 text-center bg-zinc-800 cursor-pointer text-white hover:border-lime-500 hover:border-b-2 ronded-t-lg w-1/5 md:w-auto",
              item.sortValue === bubbleSort && "border-b-2 border-lime-500"
            )}
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
