import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";

import HeaderCellWithIcon from "@/components/shared/HeaderCellWithIcon/HeaderCellWithIcon";
import { ChartUtils } from "@/lib/chartUtils";
import { Formatter } from "@/lib/formatter";
import { CoingeckoCoinData } from "@/types/coingecko.types";

import Chart from "./components/Chart";
import CoinName from "./components/CoinName";
import PriceChangeCell from "./components/PriceChangeCell";
import SupplyCell from "./components/SupplyCell";

import "./Coins.scss";

type Props = {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentCoins: CoingeckoCoinData[];
};

const tableStyle = {
  border: "1px solid var(--surface-border)",
  borderRadius: "var(--border-radius)",
  maxWidth: "1280px",
  margin: "0 auto",
  overflow: "hidden",
};

const priceChangeColumns = [
  {
    title: "1h",
    prop: "price_change_percentage_1h_in_currency",
  },
  {
    title: "24h",
    prop: "price_change_percentage_24h_in_currency",
  },
  {
    title: "7d",
    prop: "price_change_percentage_7d_in_currency",
  },
  {
    title: "30d",
    prop: "price_change_percentage_30d_in_currency",
  },
  {
    title: "1y",
    prop: "price_change_percentage_1y_in_currency",
  },
];

export default function Coins({ currentCoins = [], setCurrentPage }: Props) {
  const navigate = useNavigate();
  const [first, setFirst] = useState<number>(0);

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setCurrentPage(event.page + 1);
  };

  const handleSelectCoin = (data: CoingeckoCoinData) => navigate("/" + data.id);

  return (
    <div className="p-2 surface-card">
      <Tooltip target=".price-change-cell">
        <span className="text-sm">Price change percentage</span>
      </Tooltip>
      <Tooltip target=".rank-cell">
        <span className="text-sm">Market cap rank</span>
      </Tooltip>
      <div id="coins-table" className="px-0 md:px-8">
        <DataTable
          rows={20}
          scrollable
          lazy
          stripedRows
          loading={!currentCoins.length}
          value={currentCoins}
          tableStyle={tableStyle}
          onSelectionChange={(e) => handleSelectCoin(e.value)}
          selectionMode="single"
        >
          <Column
            frozen
            body={(data) => <CoinName coin={data} />}
            header="Coin"
          ></Column>
          <Column
            className="text-center"
            field="market_cap_rank"
            header={<HeaderCellWithIcon title={"#"} className="rank-cell" />}
          ></Column>
          <Column
            body={(coin) => Formatter.toUSD(coin.current_price)}
            header="Price"
          ></Column>
          <Column
            body={(coin) => Formatter.compactNumber(coin.market_cap)}
            header="Market Cap"
          ></Column>
          <Column
            body={(coin) => Formatter.compactNumber(coin.total_volume)}
            header="Volume"
          ></Column>
          {priceChangeColumns.map((item) => {
            return (
              <Column
                className="w-4rem"
                key={Math.random()}
                body={(coin) => <PriceChangeCell value={coin[item.prop]} />}
                header={
                  <HeaderCellWithIcon
                    title={item.title}
                    className="price-change-cell"
                  />
                }
              ></Column>
            );
          })}
          <Column
            body={(coin) => <SupplyCell data={coin} />}
            header="Supply"
          ></Column>
          <Column
            body={(coin: CoingeckoCoinData) => (
              <Chart
                data={ChartUtils.generateChartData(coin.sparkline_in_7d.price)}
              />
            )}
            header="Chart 7d"
          ></Column>
        </DataTable>
        <Paginator
          first={first}
          rows={50}
          totalRecords={10000}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
