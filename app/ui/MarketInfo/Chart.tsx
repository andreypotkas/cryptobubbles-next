"use client";

import clsx from "clsx";
import { UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = {
  data: { time: UTCTimestamp; value: number }[];
};

const chartProps = {
  width: 300,
  height: 60,
  layout: {
    textColor: "white",
    background: {
      color: "transparent",
    },
  },
  timeScale: {
    visible: false,
  },
  grid: {
    vertLines: {
      color: "transparent",
    },
    horzLines: {
      color: "transparent",
    },
  },
  crosshair: {
    vertLine: { visible: false },
    horzLine: { visible: false },
  },

  leftPriceScale: {
    visible: false,
  },
  rightPriceScale: {
    visible: false,
  },
  handleScroll: false,
  handleScale: false,
};

export default function Chart({ data }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, chartProps);

    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      baseLineVisible: false,
      priceLineVisible: false,
      topColor: "gray",
      bottomColor: "rgba(46, 204, 113, 0.1)",
    });
    newSeries.setData(data);

    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-[300px] h-[60px] relative pb-2">
      <div ref={chartContainerRef} className={clsx(!chartContainerRef.current && "invisible")} />
      {!chartContainerRef.current && (
        <div className="max-w-sm animate-pulse absolute bottom-0">
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[300px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[300px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[300px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[300px]"></div>
        </div>
      )}
    </div>
  );
}
