import React from "react";

const EmptyNotification = () => {
  return (
    <div className="h-full">
      <div
        rel="noopener noreferrer"
        className=" justify-center p-2 dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark-secondary dark:text-white text-gray-500"
      >
        <p>No new Notifications</p>
      </div>
    </div>
  );
};

export default EmptyNotification;
