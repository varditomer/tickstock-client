import { useEffect, useState } from "react";
import { StockChart } from "../components/StockChart";
import { StockTable } from "../components/StockTable";
import type { Stock } from "../models/stock.model";
import { socketService } from "../services/socket.service";

export const HomePage = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    // This is critical to trigger the reconnection status
    socketService.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socketService.on<Stock>("stock-update", (data) => {
      setStocks((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((s) => s.symbol === data.symbol);
        if (idx !== -1) {
          updated[idx] = data;
        } else {
          updated.push(data);
        }
        return updated;
      });
    });

    return () => {
      socketService.off("connect");
      socketService.off("stock-update");
      socketService.disconnect();
    };
  }, []);

  return (
    <main className="home-page">
      <h2>Live Stock Updates</h2>
      <StockTable stocks={stocks} />
      <StockChart stocks={stocks} />
    </main>
  );
};
