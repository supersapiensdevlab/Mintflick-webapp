import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { detectURLs, linkify } from '../../../component/uploadHelperFunction';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';
import classes from '../Profile.module.css';
import DeleteModal from '../../../component/Modals/DeleteModal/DeleteModal';

moment().format();

const AnnouncementCard = (props) => {
  const [playing, setPlaying] = useState(false);

  const [showImage, setShowImage] = useState(true);
  const [seeMore, setSeeMore] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [showLinkPreview, setShowLinkPreview] = useState(false);

  const [time, setTime] = useState(null);
  const [linkData, setLinkData] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/profile/${props.username}/posts`;

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (props.post.timestamp) {
      setTime(moment(Math.floor(props.post.timestamp)).fromNow());
    }

    setAnnouncement(props.post.announcement);

    if (props.post.announcement && !props.post.post_image) {
      let url = detectURLs(props.post.announcement);
      if (url && url.length > 0) {
        let data = linkify(props.post.announcement);
        setAnnouncement(data);
        setLinkData(props.post.linkpreview_data);
        setShowLinkPreview(true);
      } else {
        setShowLinkPreview(false);
      }
    }
    // eslint-disable-next-line
  }, []);

  // const convertTimestampToTime = () => {
  //   const timestamp = new Date(props.playbackUserData.time * 1000); // This would be the timestamp you want to format
  //   setTime(moment(timestamp).fromNow());
  // };

  // useEffect(() => {
  //   convertTimestampToTime();
  //   // eslint-disable-next-line
  // }, []);

  return (
    <div id="tracks-section" className="py-1 ">
      <div
        className={`w-full  flex-col  md:flex-row    py-3 border border-white border-opacity-5 shadow-lg  
        sm:rounded  dark:bg-dbeats-dark-primary dark:text-gray-100 
         md:px-5 px-3 `}
      >
        <div className={`   lg:w-80 2xl:w-80   md:w-96     `}>
          <Link
            to={{
              pathname: props.post.link,
            }}
            target="_blank"
            rel="noopener noreferrer"
            style={!props.post.link ? { cursor: 'default' } : null}
            onClick={!props.post.link ? (e) => e.preventDefault() : null}
          >
            {showImage ? (
              <>
                {props.post.post_image ? (
                  <>
                    <img
                      src={props.post.post_image}
                      alt="announcement_info"
                      className="mx-auto h-full w-auto bg-dbeats-dark-primary"
                    />
                  </>
                ) : null}
                {!props.post.post_image && showLinkPreview && linkData ? (
                  <>
                    <img
                      src={
                        linkData && linkData.image && linkData.image.url ? linkData.image.url : null
                      }
                      alt="announcement_info"
                      className="mx-auto h-full w-auto bg-dbeats-dark-primary"
                    />
                  </>
                ) : null}
              </>
            ) : props.post.post_video ? (
              <ReactPlayer
                width="100%"
                height="100%"
                playing={playing}
                muted={false}
                volume={0.5}
                url={props.post.post_video}
                controls={false}
                className={classes.cards_videos}
              />
            ) : null}
          </Link>
        </div>
        <div className={`  w-full py-2 relative`}>
          <p className="flex w-full justify-between text-black text-sm font-medium dark:text-gray-100">
            <div className="w-full">
              <div className="text-gray-500  pb-1">{time}</div>
              <div className="flex flex-col 2xl:text-base lg:text-md    dark:text-gray-100 w-full">
                <p
                  className={`${!seeMore ? 'line-clamp-4' : ''} mr-2  `}
                  style={{ wordBreak: 'break-words' }}
                >
                  {announcement.split('\n').map(function (item, key) {
                    return <div key={key} dangerouslySetInnerHTML={{ __html: item }}></div>;
                  })}
                  {}
                </p>

                {announcement.split(/\r\n|\r|\n/).length > 3 ? (
                  <span
                    className="cursor-pointer text-base hover:underline text-gray-600 mt-2"
                    onClick={() => setSeeMore(!seeMore)}
                  >
                    {seeMore ? 'see less' : 'read more'}
                  </span>
                ) : null}
              </div>
            </div>
            <div className=" right-0">
              {props.privateUser && (
                <button
                  onClick={() => {
                    setShowDelete(true);
                  }}
                  className=" flex px-2 py-1  text-dbeats-white hover:bg-red-500"
                >
                  <i className="fa-solid fa-trash-can mr-2 text-sm"></i>Delete
                </button>
              )}
            </div>
          </p>

          <div>
            <div className="2xl:text-2xl lg:text-lg text-gray-500 ">
              <button className="px-1" onClick={handleShow}>
                <i className="fas fa-share-alt hover:text-dbeats-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        show={show}
        handleClose={handleClose}
        sharable_data={sharable_data}
        copybuttonText={buttonText}
        setCopyButtonText={setButtonText}
      />
      <DeleteModal
        type="post"
        data={props.post}
        show={showDelete}
        setShowDelete={setShowDelete}
      ></DeleteModal>
    </div>
  );
};

export default AnnouncementCard;
