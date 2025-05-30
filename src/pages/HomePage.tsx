import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Ensure the socket URL is set correctly
const isProd = import.meta.env.PROD;
const SERVER_URL = isProd ? window.location.origin : import.meta.env.VITE_SOCKET_URL;

console.log('🔌 Connecting to socket server at:', SERVER_URL);

const socket = io(SERVER_URL);

// Define the Stock type for TypeScript
type Stock = {
  symbol: string;
  price: number;
  change: number;
};

export const HomePage = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('stock-update', (data: Stock) => {
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
    <main>
      <h2>Live Stock Updates</h2>
      <table className="stock-table">
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
              <td className={change >= 0 ? 'positive' : 'negative'}>
                {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
