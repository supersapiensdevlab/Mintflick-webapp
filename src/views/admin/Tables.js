import React from 'react';

// components

import CardTable from '../../component/Cards/CardTable.js';

const Tables = ({ data }) => {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable data={data} />
        </div>
      </div>
    </>
  );
};
export default Tables;
