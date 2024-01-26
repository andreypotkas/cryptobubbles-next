"use client";

import { UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = {
  data: { time: UTCTimestamp; value: number }[];
};

export default function Chart({ data }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, {
      width: 250,
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
    });

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

  return <div ref={chartContainerRef} className="pb-2" />;
}
