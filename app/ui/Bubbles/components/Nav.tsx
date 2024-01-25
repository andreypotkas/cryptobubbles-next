import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";

import { PriceChangePercentage } from "@/types/bubbles.types";

type Props = {
  currentPage: number;
  setBubbleSort: React.Dispatch<React.SetStateAction<PriceChangePercentage>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const ROWS = 50;

function Nav({ currentPage, setBubbleSort, setCurrentPage }: Props) {
  const items: MenuItem[] = [
    { label: "1h", command: () => setBubbleSort(PriceChangePercentage.HOUR) },
    { label: "1d", command: () => setBubbleSort(PriceChangePercentage.DAY) },
    { label: "1w", command: () => setBubbleSort(PriceChangePercentage.WEEK) },
    { label: "1m", command: () => setBubbleSort(PriceChangePercentage.MONTH) },
    { label: "1y", command: () => setBubbleSort(PriceChangePercentage.YEAR) },
  ];

  const firstEl = (currentPage - 1) * ROWS;
  const [first, setFirst] = useState<number>(firstEl);

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setCurrentPage(event.page + 1);
  };

  return (
    <div className="w-full p-2 surface-card">
      <Menubar
        className="surface-card p-0"
        model={items}
        end={
          <Paginator
            className="p-0"
            first={first}
            rows={ROWS}
            totalRecords={10000}
            onPageChange={handlePageChange}
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          />
        }
      />
    </div>
  );
}

const MemoizedNavBar = React.memo(Nav);
export default MemoizedNavBar;
