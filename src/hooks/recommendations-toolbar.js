import React, { useEffect } from 'react';

const recommendation = (latestUploads) => {
  useEffect(() => {
    return (
      <div
        id="recommended_channel"
        className="w-full  pt-18  h-full lg:col-span-1 hidden  lg:block sm:hidden   bg-dbeats-white  dark:bg-dbeats-dark-secondary text-white mt-52"
      >
        This is {('This is', console.log(latestUploads[0]))}
      </div>
    );
  }, [latestUploads]);
};
export default recommendation;
