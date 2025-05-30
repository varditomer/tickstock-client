import tickstockLogo from "../../assets/images/tickstock_logo.png";
import { ConnectionStatus } from "../../components/ConnectionStatus";

export const Header = () => {
  return (
    <header>
      <div className="header-content">
        <h1>
          <img src={tickstockLogo} alt="TickStock Logo" />
          TickStock
        </h1>
        <ConnectionStatus />
      </div>
    </header>
  );
};
