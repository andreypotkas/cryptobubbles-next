"use client";

import { convertToUSD } from "@/app/lib/utils";
import { CoingeckoCoinData, SparklineData } from "@/types/coingecko.type";
import CoinName from "./CoinName";
import PriceChangeCell from "./PriceChangeCell";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { UTCTimestamp } from "lightweight-charts";
import Chart from "./Chart";
import MemoizedSupplyCell from "./SupplyCell";

type Props = {
  coins: CoingeckoCoinData[];
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

function generateChartData(data: SparklineData) {
  return data.price.map((item, index) => {
    return { time: (Date.now() + 60 * 60 * 1000 * index) as UTCTimestamp, value: item };
  });
}

export default function MarketInfo({ coins }: Props) {
  return (
    <div className="bg-zinc-900 px-2">
      <div id="coins-table">
        <DataTable rows={20} scrollable lazy stripedRows loading={!coins.length} value={coins}>
          <Column frozen body={(data) => <CoinName coin={data} />} header="Coin"></Column>
          <Column body={(coin) => convertToUSD(coin.current_price)} header="Price"></Column>
          <Column body={(coin) => convertToUSD(coin.market_cap)} header="Market Cap"></Column>
          <Column body={(coin) => convertToUSD(coin.total_volume)} header="Volume"></Column>
          {priceChangeColumns.map((item) => {
            return <Column className="w-4rem" key={Math.random()} body={(coin) => <PriceChangeCell value={coin[item.prop]} />} header={item.title}></Column>;
          })}
          <Column body={(coin) => <MemoizedSupplyCell data={coin} />} header="Supply"></Column>
          <Column body={(coin: CoingeckoCoinData) => <Chart data={generateChartData(coin.sparkline_in_7d)} />} header="Chart 7d"></Column>
        </DataTable>
      </div>
    </div>
  );
}
