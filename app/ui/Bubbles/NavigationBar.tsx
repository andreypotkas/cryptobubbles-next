import { Button } from "@/components/ui/button";
import { PriceChangePercentage } from "@/types/bubbles.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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
      <div className="flex gap-2 items-center">
        <Button disabled={+page <= 1} variant="outline" size="icon">
          <Link href={`/?page=${+page - 1}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="w-6 text-center"> {page}</div>
        <Button disabled={+page >= 50} variant="outline" size="icon">
          <Link href={`/?page=${+page + 1}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
