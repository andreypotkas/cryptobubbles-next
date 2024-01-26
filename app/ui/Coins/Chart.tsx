"use client";

import { UTCTimestamp, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = {
  data: { time: UTCTimestamp; value: number }[];
};

const CHART_PROPS = {
  colors: {
    lineColor: "#38b2ac",
    areaTopColor: "#38b2ac",
    areaBottomColor: "#38b2ac2d",
  },
};

export default function Chart({ data }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current!, {
      width: 250,
      height: 60,
      layout: {
        textColor: "white", // Text color for labels
        background: {
          color: "transparent",
        },
      },
      timeScale: {
        visible: false, // Hide the time scale for better performance
      },
      grid: {
        vertLines: {
          color: "transparent", // Set vertical grid lines color to transparent
        },
        horzLines: {
          color: "transparent", // Set horizontal grid lines color to transparent
        },
      },
      crosshair: {
        vertLine: { visible: false }, // Hide vertical line of crosshair
        horzLine: { visible: false }, // Hide horizontal line of crosshair
      },
      watermark: {
        color: "transparent", // Set the watermark color to transparent
      },
      leftPriceScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      handleScroll: false, // Disable scrolling for better performance
      handleScale: false, // Disable scaling for better performance
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      baseLineVisible: false,
      priceLineVisible: false,
      lineColor: CHART_PROPS.colors.lineColor,
      topColor: CHART_PROPS.colors.areaTopColor,
      bottomColor: CHART_PROPS.colors.areaBottomColor,
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="pb-2" />;
}
