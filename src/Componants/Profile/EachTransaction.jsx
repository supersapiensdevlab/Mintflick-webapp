import React from "react";
import { Send } from "tabler-icons-react";

function EachTransaction() {
  return (
    <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 p-2 rounded-md">
      <div className="rounded-full bg-brand-600 p-2 text-white">
        <Send />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-brand3">username</span>
        <span className="text-xs text-success">Confirmed</span>
      </div>

      <span className="ml-auto font-semibold text-error text-sm">
        13.00 flicks
      </span>
    </div>
  );
}

export default EachTransaction;
