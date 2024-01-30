import { Button } from "@/components/ui/button";
import { PriceChangePercentage } from "@/types/bubbles.types";
import React from "react";
import Pagination from "../Pagination";

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
    <div className="w-full flex justify-between p-2 bg-zinc-900">
      <div className="flex gap-1">
        {items.map((item, index) => {
          return (
            <Button key={index} className={"px-1 md:px-3"} style={{ background: item.sortValue === bubbleSort ? "gray" : "black" }} variant="outline" onClick={() => setBubbleSort(item.sortValue)}>
              {item.label}
            </Button>
          );
        })}
      </div>
      <Pagination page={page} />
    </div>
  );
}
