import React from "react";
import { AlertTriangle } from "tabler-icons-react";

const EmptyNotification = () => {
  return (
    <div className="h-fit w-fit">
      <div className="flex gap-2 text-base text-rose-500 font-medium">
        <AlertTriangle />
        <span className="">No new Notifications</span>
      </div>
    </div>
  );
};

export default EmptyNotification;
