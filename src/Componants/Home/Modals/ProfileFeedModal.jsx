import React, { useState } from "react";
import { Camera, X } from "tabler-icons-react";
import Post from "../Post";

function ProfileFeedModal(props) {
  const [currentPlay, setCurrentPlay] = useState(null);

  const clearData = () => {
    props.setfeedModal(false);
  };
  return (
    <div
      className={`${
        props.feedModal && "modal-open"
      } modal modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              {props.icon}
              {props.owner}
            </h3>
            <X
              onClick={() => clearData()}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        {props.data.map((post, i) => (
          <Post
            contentType="post"
            key={post._id}
            myKey={i}
            profilePic={post.profile_image}
            profileName={post.username}
            profileuser_id={post.user_id}
            timestamp={post.time}
            text={post.announcement}
            image={post.post_image}
            price={post.price}
            likes={post.likes}
            comments={post.comments}
            ownerId={post.ownerId}
            tokenId={post.tokenId}
            trackImage={post.trackImage}
            trackName={post.trackName}
            trackDisc={post.description}
            trackUrl={post.link}
            currentPlay={currentPlay}
            setCurrentPlay={setCurrentPlay}
            profileUsername={post.username}
            trackId={post.trackId}
            trackPlays={post.plays}
            videoImage={post.videoImage}
            videoName={post.videoName}
            videoUrl={post.link}
            videoId={post.videoId}
            videoViews={post.views}
            pollId={post.pollId}
            postId={post.postId}
            votes={post.votes}
            content={post}
            reports={post.reports}
            superfan_data={post.superfan_data}
            // gettingNFTData={gettingNFTData}
          ></Post>
        ))}
      </div>
    </div>
  );
}

export default ProfileFeedModal;
