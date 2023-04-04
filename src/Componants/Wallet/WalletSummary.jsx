import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import BuySol from "./BuySol";
import { loadBalance } from "../../Helper/getWalletBalance";
import SolanaToken from "../../Assets/logos/SolanaToken";

function WalletSummary() {
  const State = useContext(UserContext);
  const [balance, setbalance] = useState(0);

  async function loadbalance() {
    const x = await loadBalance(State.database.walletAddress);
    setbalance(x);
  }
  useEffect(() => {
    loadbalance();
  }, []);

  return (
    <div className="flex flex-col items-start w-full p-5 mt-5 space-y-4 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl">
      <p className="flex items-center w-full text-lg font-black text-brand3">
        Wallet Balance
      </p>
      <p className="flex items-center w-full gap-2 text-base font-medium text-brand2">
        <SolanaToken /> {balance} SOL
      </p>
      <BuySol text="Topup" />
    </div>
  );
}
export default WalletSummary;
