import React from 'react';
import PublicInfo from './Public_Info';
import { useParams } from 'react-router-dom';

const PublicRoomPage = () => {
  let params = useParams();

  return (
    <>
      <div id="outer-container" style={{ height: '100%' }}>
        <main id="page-wrap">
          <PublicInfo stream_id={params.username} />
        </main>
      </div>
    </>
  );
};

export default PublicRoomPage;
