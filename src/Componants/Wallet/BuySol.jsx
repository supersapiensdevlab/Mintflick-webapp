import React, { useContext } from "react";
import { UserContext } from "../../Store";
import { ExternalLink, Link } from "tabler-icons-react";
import Upi from "../../Assets/logos/Upi";

function BuySol(props) {
  const State = useContext(UserContext);
  return (
    <div className="flex items-center gap-1">
      <a
        className="gap-1 tracking-wider text-white capitalize btn btn-sm btn-success"
        target="_blank"
        href={`https://onramp.money/main/buy/?appId=1&walletAddress=${State.database.walletAddress}&network=spl&coinCode=sol`}
      >
        {props.text}
        <ExternalLink size={16} />
      </a>{" "}
      <span className="flex items-center gap-0 text-sm font-semibold tracking-wider text-brand4">
        <Upi /> Supported
      </span>
    </div>
  );
}

export default BuySol;
