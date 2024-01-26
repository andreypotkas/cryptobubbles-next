"use client";

import { CoingeckoHistoryResponse } from "@/types/coingecko.type";
import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { ChartUtils } from "./chart.utils";

type Props = {
  coinHistory: CoingeckoHistoryResponse;
  name: string;
};

const chartProps = {
  data: {
    autoSize: true,
    layout: {
      background: {
        color: "transparent",
      },
      textColor: "white",
    },
    grid: {
      vertLines: {
        color: "rgba(60, 60, 60, 0.3)",
      },
      horzLines: {
        color: "rgba(60, 60, 60, 0.3)",
      },
    },
  },
  colors: {
    lineColor: "#14B8A6",
    areaTopColor: "#14B8A6",
    areaBottomColor: "rgba(64, 211, 152, 0.295)",
  },
};

export default function LightWeightChart({ coinHistory }: Props) {
  const toolTipRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current!, chartProps.data);
    chart.timeScale().fitContent();

    const priceSeries = chart.addAreaSeries({
      lineColor: chartProps.colors.lineColor,
      topColor: chartProps.colors.areaTopColor,
      bottomColor: chartProps.colors.areaBottomColor,
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    window.addEventListener("resize", handleResize);

    const priceData = ChartUtils.transformCoingeckoChartPriceData(coinHistory);
    const volumeData = ChartUtils.transformCoingeckoChartVolumeData(coinHistory);

    priceSeries.setData(priceData);
    volumeSeries.setData(volumeData);

    chart.priceScale("").applyOptions({ scaleMargins: { top: 0.5, bottom: 0 } });

    chart.subscribeCrosshairMove((param) => ChartUtils.handleCrossHairMove(param, chartContainerRef, toolTipRef, priceSeries, volumeSeries));

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [coinHistory]);

  return (
    <>
      <div className="absolute" ref={toolTipRef} />
      <div ref={chartContainerRef} className="h-1/2 w-full bg-zinc-900 p-4 text-zinc-200" />
    </>
  );
}
