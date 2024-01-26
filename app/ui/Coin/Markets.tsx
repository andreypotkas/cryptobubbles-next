import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { convertToUSD } from "@/lib/utils";
import { CoingeckoSingleCoinData } from "@/types/coingecko.type";
import Link from "next/link";
import ExchangeName from "./ExchangeName";

export default function Markets({ coin }: { coin: CoingeckoSingleCoinData }) {
  return (
    <div className="py-12 bg-zinc-950" style={{ maxWidth: "1680px", margin: "0 auto", padding: "0.5rem" }}>
      <Table>
        <TableCaption>Markets</TableCaption>
        <TableHeader className="bg-zinc-900">
          <TableRow>
            <TableHead>Exchange name</TableHead>
            <TableHead className="w-[100px]">Ticker</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Trade URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coin.tickers.map((ticker) => (
            <TableRow key={Math.random()}>
              <TableCell>
                <ExchangeName ticker={ticker} />
              </TableCell>
              <TableCell className="font-medium w-[200px]">{ticker.base + "-" + ticker.target}</TableCell>
              <TableCell>{convertToUSD(ticker.last)}</TableCell>
              <TableCell>{convertToUSD(ticker.volume)}</TableCell>
              <TableCell className="w-[200px]">{new Date(ticker.timestamp).toTimeString()}</TableCell>
              <TableCell>
                {ticker.trade_url ? (
                  <Link target="blank" className="hover:underline bg-zinc-800 rounded p-2" href={ticker.trade_url}>
                    {ticker.market.name + ": " + ticker.base + "-" + ticker.target}
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
