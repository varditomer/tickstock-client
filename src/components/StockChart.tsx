import { useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { Stock } from "../models/stock.model";

interface Props {
  stocks: Stock[];
  historyMap: Record<string, { time: string; price: number }[]>;
}

export const StockChart = ({ stocks, historyMap }: Props) => {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const chartData = historyMap[selectedSymbol] || [];

  const uniqueSymbols = Array.from(new Set(stocks.map((s) => s.symbol)));

  return (
    <section className="stock-chart-section">
      <div className="chart-header">
        <h3>{selectedSymbol} Price (Recent)</h3>
        <select
          className="stock-selector"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
        >
          {uniqueSymbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};
