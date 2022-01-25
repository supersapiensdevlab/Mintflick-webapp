import Container from '@material-ui/core/Container';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenful from 'screenfull';
import Footer from '../../pages/VideoPages/Footer/Footer';
import FullControls from './FullControls';
import PlayControls from './PlayControls';
import classes from './videoPlayer.module.css';

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function VideoPlayer(props) {
  const [showControls, setShowControls] = useState(false);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 0.3,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const { playing, light, muted, loop, playbackRate, pip, played, volume } = state;

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    //console.log({ newValue });
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = () => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    //console.log({ value: e.target });
    setState({ ...state, seeking: false });
    // //console.log(sliderRef.current.value)
    playerRef.current.seekTo(newValue / 100, 'fraction');
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    // //console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
    setShowControls(!showControls);
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(timeDisplayFormat === 'normal' ? 'remaining' : 'normal');
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = 'visible';
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = 'hidden';
  };

  const handleClickEvent = () => {
    setState({ ...state, playing: !state.playing });
  };

  const currentTime = playerRef && playerRef.current ? playerRef.current.getCurrentTime() : '00:00';

  const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime =
    timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  function escFunction(event) {
    if (event.keyCode === 27) {
      setShowControls(false);
    }
  }

  window.addEventListener('keydown', escFunction);

  return (
    <>
      <Container style={{ width: '100%', height: '100%' }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
          onClick={handleClickEvent}
          onDoubleClick={toggleFullScreen}
          ref={playerContainerRef}
          className="relative w-full 2xl:h-125 lg:h-110 md:h-120 xs:h-100 min-h-full"
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            className={`${classes.video_player}`}
            url={props.playbackUrl}
            pip={pip}
            playing={playing}
            controls={false}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
          />
          {showControls ? (
            <FullControls
              ref={controlsRef}
              onSeek={handleSeekChange}
              onSeekMouseDown={handleSeekMouseDown}
              onSeekMouseUp={handleSeekMouseUp}
              onDuration={handleDuration}
              onRewind={handleRewind}
              onPlayPause={handlePlayPause}
              onFastForward={handleFastForward}
              playing={playing}
              played={played}
              elapsedTime={elapsedTime}
              totalDuration={totalDuration}
              onMute={hanldeMute}
              muted={muted}
              onVolumeChange={handleVolumeChange}
              onVolumeSeekDown={handleVolumeSeekDown}
              onChangeDispayFormat={handleDisplayFormat}
              playbackRate={playbackRate}
              onPlaybackRateChange={handlePlaybackRate}
              onToggleFullScreen={toggleFullScreen}
              volume={volume}
            />
          ) : (
            <PlayControls
              ref={controlsRef}
              onPlayPause={handlePlayPause}
              playing={playing}
              played={played}
            />
          )}
        </div>
      </Container>
      {props.footer ? (
        <Footer
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onDuration={handleDuration}
          onRewind={handleRewind}
          onPlayPause={handlePlayPause}
          onFastForward={handleFastForward}
          playing={playing}
          played={played}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onMute={hanldeMute}
          muted={muted}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekDown={handleVolumeSeekDown}
          onChangeDispayFormat={handleDisplayFormat}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRate}
          onToggleFullScreen={toggleFullScreen}
          volume={volume}
          creatorData={props.creatorData}
          className="lg:-ml-12 "
        />
      ) : null}
    </>
  );
}

export default VideoPlayer;
