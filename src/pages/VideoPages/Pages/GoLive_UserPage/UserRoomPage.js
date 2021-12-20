import React from 'react';
import UserInfo from './User_Info';
import { useParams } from 'react-router-dom';

const UserRoomPage = () => {
  let params = useParams();
  return (
    <>
      <div id="outer-container" style={{ height: '100%' }}>
        <main id="page-wrap">
          <UserInfo stream_id={params.roomID} />
        </main>
      </div>
    </>
  );
};

export default UserRoomPage;
