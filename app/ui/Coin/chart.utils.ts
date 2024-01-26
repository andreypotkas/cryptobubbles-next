import { convertToUSD } from "@/lib/utils";
import { CoingeckoHistoryResponse } from "@/types/coingecko.type";
import { ISeriesApi, MouseEventParams, UTCTimestamp } from "lightweight-charts";

export class ChartUtils {
  static priceFormatter = () => {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format;
  };
  static generateChartData(initialData: number[]) {
    const interval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const data = initialData.map((value, index) => {
      const formattedTime = (Date.now() + interval * index) as UTCTimestamp;
      return { time: formattedTime, value };
    });
    return data;
  }

  static transformCoingeckoChartPriceData = (data: CoingeckoHistoryResponse) => {
    return data.map((item) => {
      return {
        time: (+item[0] / 1000) as UTCTimestamp,
        value: +item[1],
      };
    });
  };

  static transformCoingeckoChartVolumeData = (data: CoingeckoHistoryResponse) => {
    return data.map((item, index: number) => {
      return {
        time: (+item[0] / 1000) as UTCTimestamp,
        value: +item[2],
        color: index !== 0 && data[index][2] < data[index - 1][2] ? "rgba(255,82,82, 0.8)" : "rgba(0, 150, 136, 0.8)",
      };
    });
  };

  static handleCrossHairMove = (
    param: MouseEventParams,
    chartContainerRef: React.RefObject<HTMLDivElement>,
    toolTip: React.RefObject<HTMLDivElement>,
    priceSeries: ISeriesApi<"Area">,
    volumeSeries: ISeriesApi<"Histogram">
  ) => {
    try {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current!.clientHeight
      ) {
        toolTip.current!.style.display = "none";
      } else {
        toolTip.current!.style.display = "block";
        const priceData = param.seriesData.get(priceSeries) as unknown;
        const volumeData = param.seriesData.get(volumeSeries) as unknown;
        if (priceData && volumeData) {
          const price = convertToUSD((priceData as { time: number; value: number }).value);
          const volume = (volumeData as { time: number; value: number }).value.toFixed(2);

          const ts = (priceData as { time: UTCTimestamp; value: number }).time;
          const time = (new Date(ts * 1000) + "").slice(0, 21);

          toolTip.current!.innerHTML = `
                            <div class='flex flex-col gap-1 items-left absolute' style="left: 25px; width:300px; top: 20px; background: black; padding:1rem; border-radius:1rem;">
                            <div style=" text-align: left; z-index: 100; ">
                                <span style="color:var(--primary-color)"> Price: </span>
                                <span>${price}</span>
                            </div>
                            <div style=" text-align: left; z-index: 100;">
                              <span style="color:var(--primary-color)"> Volume: </span>
                              <span>${volume}</span>
                            </div>
                            <div style=" text-align: left; z-index: 100;">
                              <span style="color:var(--primary-color)"> Date: </span>
                              <span>${time}</span>
                            </div>
                            
                    </div>
            `;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}
