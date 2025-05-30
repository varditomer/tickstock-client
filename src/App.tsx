import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

type Stock = {
  symbol: string;
  price: number;
  change: number;
};

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("stock-update", (data: Stock) => {
      setStocks((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((s) => s.symbol === data.symbol);
        if (idx !== -1) {
          updated[idx] = data;
        } else {
          updated.push(data);
        }
        return [...updated];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 TickStock</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(({ symbol, price, change }) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>${price.toFixed(2)}</td>
              <td style={{ color: change >= 0 ? "green" : "red" }}>
                {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
