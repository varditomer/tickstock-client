import tickstockLogo from "../assets/images/tickstock_logo.png";

export const Header = () => {
  return (
    <header>
      <h1>
        <img
          src={tickstockLogo}
          alt="TickStock Logo"
          //   style="height:1em;vertical-align:middle;"
        />{" "}
        TickStock
      </h1>
    </header>
  );
};
