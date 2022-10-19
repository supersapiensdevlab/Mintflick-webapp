import React from "react";

function Settings() {
  const [marketPlaceModalOpen, setMarketPlaceModalOpen] = useState(false);
  const [manageSuperfansModalOpen, setmanageSuperfansModalOpen] =
    useState(false);
  return (
    <div className="flex flex-col items-start p-4  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <p className="text-lg text-brand5 font-bold">Text Channel</p>
    </div>
  );
}

export default Settings;
