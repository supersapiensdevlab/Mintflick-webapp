import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Pinned, PinnedOff } from "tabler-icons-react";
import { UserContext } from "../../Store";

function Channels() {
  const [channels, setChannels] = useState([]);
  const State = useContext(UserContext);

  useEffect(() => {
    console.log('called')
    console.log(State.database.userData)
    if (State.database.userData.data) {
      for (var i = 0; i < State.database.userData.data.user.pinned.length; i++) {
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/${State.database.userData.data.user.pinned[i]}`)
          .then((value) => {
            let noti_no = State.database.userData.data.user.notification.filter((nf) => nf.username === State.database.userData.data.user.username);

            setChannels((prev) => [...prev, { ...value.data, notification_numbers: noti_no.length }]);
          });
      }
    }
  }, [State.database.userData]);

  const UnPinningUser = (pinnedUser) => {
    const UnPinningData = {
      username: State.database.userData.data.user.username,
      pinneduser: pinnedUser,
    };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/unpin`,
      data: UnPinningData,
      headers: {
        'content-type': 'application/json',
        'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
      },
    })
      .then(() => {
        setChannels(channels.filter((c)=> c.username !== pinnedUser))
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  return (
    <div className="w-full h-fit space-y-4 ">
      <p className=" font-extrabold text-lg text-brand5 mb-2">Channels</p>
      {channels.length > 0 ? <>
      {channels.map((channel, i) => (
        <div className="flex  items-center space-x-2 h-8" key={i}>
          <div className="h-full flex items-center flex-grow space-x-2">
            <img
              className="h-full rounded-full"
              src={channel.profile_image}
              alt="Channel image"
            />

            <p className="cursor-pointer text-base font-medium text-brand3">
              {channel.name}
            </p>
          </div>
          <button className="btn btn-circle btn-ghost" onClick={()=>{UnPinningUser(channel.username)}}>
            {<PinnedOff />}
          </button>
          {channel.notification_numbers > 0 &&
            <div className="flex items-center h-6 w-fit p-2 bg-rose-600 rounded-full">
              <p className="text-white">{channel.notification_numbers}</p>
            </div>
          }
        </div>
      ))}
      </>:<div className="text-brand5"> No pinned users</div>}
    </div>
  );
}

export default Channels;
