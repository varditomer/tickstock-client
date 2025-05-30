// components/StockTable.tsx
import type { Stock } from "../models/stock.model";

interface Props {
  stocks: Stock[];
}

export const StockTable = ({ stocks }: Props) => {
  return (
    <section className="stock-table-section">
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
              <td className={change >= 0 ? "positive" : "negative"}>
                {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
