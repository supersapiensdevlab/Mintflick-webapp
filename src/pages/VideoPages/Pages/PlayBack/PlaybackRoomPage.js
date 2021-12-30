import React from 'react';
import PlayBackInfo from './Playback_Info';
import { useParams } from 'react-router-dom';

const PlayBackRoomPage = () => {
  let params = useParams();

  return (
    <>
      <div id="outer-container" style={{ height: '100%' }}>
        <main id="page-wrap">
          <PlayBackInfo video_username={params.username} video_id={params.video_id} />
        </main>
      </div>
    </>
  );
};

export default PlayBackRoomPage;
