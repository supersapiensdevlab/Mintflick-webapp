import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TableComponent from '../../component/admin/tableComponent';
export default function Dashboard() {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [arrayData, setArrayData] = useState([]);

  const [latestVideo, setLatestVideo] = useState([]);
  const [latestTrack, setLatestTrack] = useState([]);
  const [latestUploads, setLatestUploads] = useState(null);

  const fetchData = async () => {
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    for (let i = 0; i < fileRes.data.length; i++) {
      if (fileRes.data[i].videos && fileRes.data[i].videos.length > 0) {
        if (user ? fileRes.data[i].username !== user.username : true)
          setArrayData((prevState) => [...prevState, fileRes.data[i]]);
      }
    }

    const fetchUploads = await axios.get(`${process.env.REACT_APP_SERVER_URL}/trending`);
    if (fetchUploads.data.latest_videos) {
      let data = [];
      let fetchedData = fetchUploads.data.latest_videos.reverse();
      for (let i = 0; i < fetchedData.length; i++) {
        if (!data.some((el) => el.username === fetchedData[i].username)) {
          data.push(fetchedData[i]);
        }
      }
      setLatestVideo(data);
      setLatestUploads(true);
    }
    if (fetchUploads.data.latest_tracks) {
      let data = [];
      let fetchedData = fetchUploads.data.latest_tracks.reverse();
      for (let i = 0; i < fetchedData.length; i++) {
        if (!data.some((el) => el.username === fetchedData[i].username)) {
          data.push(fetchedData[i]);
        }
      }
      setLatestTrack(data);
      setLatestUploads(true);
    }
  };

  return (
    <>
      <div className="pt-18">
        <div className={`${darkMode && 'dark'}  `}>
          <p className="">ADMIN</p>
          <div className="grid grid-cols-12">
            <div className="col-span-4"></div>
            <div className="col-span-8">
              <TableComponent></TableComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
