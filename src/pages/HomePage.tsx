import { useEffect, useState } from "react";
import { StockChart } from "../components/StockChart";
import { StockTable } from "../components/StockTable";
import type { Stock } from "../models/stock.model";
import { socketService } from "../services/socket.service";

type HistoryMap = Record<string, { time: string; price: number }[]>;

export const HomePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [historyMap, setHistoryMap] = useState<HistoryMap>({});

  useEffect(() => {
    const socket = socketService.getSocket();
    setIsConnected(socket.connected);

    // When connecting, receive full initial history
    const handleInitialData = (
      data: Record<string, { price: number; change: number }[]>
    ) => {
      const now = new Date().toLocaleTimeString();

      const stockList: Stock[] = [];
      const histMap: HistoryMap = {};

      for (const symbol in data) {
        const history = data[symbol];
        if (Array.isArray(history) && history.length > 0) {
          const latest = history[history.length - 1];
          stockList.push({
            symbol,
            price: latest.price,
            change: latest.change,
          });

          histMap[symbol] = history.map((h) => ({
            time: now,
            price: h.price,
          }));
        }
      }

      setStocks(stockList);
      setHistoryMap(histMap);
    };

    const handleStockUpdate = (data: Stock) => {
      setStocks((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((s) => s.symbol === data.symbol);
        if (idx !== -1) updated[idx] = data;
        else updated.push(data);
        return [...updated];
      });

      const time = new Date().toLocaleTimeString();
      setHistoryMap((prev) => {
        const curr = prev[data.symbol] || [];
        const updated = [...curr, { time, price: data.price }];
        return { ...prev, [data.symbol]: updated.slice(-10) };
      });
    };

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
      setIsConnected(false);
    });

    socket.on("reconnect", () => {
      console.log("🔄 Reconnected to socket server");
      setIsConnected(true);
    });

    socket.once("initial-data", handleInitialData);
    socket.on("stock-update", handleStockUpdate);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("initial-data", handleInitialData);
      socket.off("stock-update", handleStockUpdate);
    };
  }, []);

  return (
    <main className="home-page">
      <h2>Live Stock Updates</h2>

      {!isConnected ? (
        <p className="loading-msg">Connecting to server...</p>
      ) : stocks.length === 0 ? (
        <p className="loading-msg">Waiting for stock data...</p>
      ) : (
        <>
          <StockTable stocks={stocks} />
          <StockChart stocks={stocks} historyMap={historyMap} />
        </>
      )}
    </main>
  );
};
