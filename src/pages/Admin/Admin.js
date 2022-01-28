import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// components

import AdminNavbar from '../../component/Navbar/AdminNavbar';
import Sidebar from '../../component/Sidebar/Sidebar';
import HeaderStats from '../../component/Headers/HeaderStats';
import FooterAdmin from '../../component/Footers/FooterAdmin';

// views

import Dashboard from '../../views/admin/Dashboard.js';
import Maps from '../../views/admin/Maps.js';
import Settings from '../../views/admin/Settings.js';
import Tables from '../../views/admin/Tables.js';

import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Admin() {
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
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" data={arrayData} exact component={Dashboard} />
            <Route path="/admin/maps" data={arrayData} exact component={Maps} />
            <Route path="/admin/settings" data={arrayData} exact component={Settings} />
            <Route path="/admin/tables" data={arrayData} exact component={Tables} />
            <Redirect from="/admin" data={arrayData} to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
