import React from 'react';
import PublicInfo from './Public_Info';
import { useParams } from 'react-router-dom';

const PublicRoomPage = () => {
  let params = useParams();

  return (
    <>
      <div id="outer-container" style={{ height: '100%' }}>
        <PublicInfo stream_id={params.username} />
      </div>
    </>
  );
};

export default PublicRoomPage;
