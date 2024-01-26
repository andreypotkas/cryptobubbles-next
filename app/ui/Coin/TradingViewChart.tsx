"use client";
import { useEffect, useRef } from "react";

type Props = {
  symbol: string;
};

let tvScriptLoadingPromise: null | Promise<unknown> = null;

export default function TradingViewWidget({ symbol }: Props) {
  const onLoadScriptRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget() {
      if (document.getElementById("tradingview_8b2b2") && "TradingView" in window) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol + "USDT",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_8b2b2",
        });
      }
    }
  }, [symbol]);

  return (
    <div className="h-1/2">
      <div
        id="tradingview_8b2b2"
        style={{
          height: "calc(100% - 32px)",
          width: "100%",
          background: "transparent",
        }}
      />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
