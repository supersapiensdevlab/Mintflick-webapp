import { IconButton, Slider, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React from 'react';
import { Link } from 'react-router-dom';
import personImg from '../../../assets/images/profile.svg';
import classes from './Footer.module.css';

const PrettoSlider = withStyles({
  root: {
    height: 8,
    width: '80%',
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const Footer = (props) => {
  return (
    <div className="fixed bottom-0 bg-white w-full 2xl:h-28 h-28 lg:h-20 mb-0 pb-0  flex flex-col lg:flex-row justify-between lg:-ml-8 align-center z-10 dark:bg-dbeats-dark-primary dark:text-gray-100  bg-opacity-80 dark:bg-opacity-90  dark:backdrop-filter  dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md">
      <div className="w-full self-center hidden lg:block">
        <div className="flex">
          <img
            src={props.creatorData.profile_image ? props.creatorData.profile_image : personImg}
            className="2xl:h-20 2xl:w-20  h-16 w-16 p-3 my-auto rounded-full"
            alt="img"
          ></img>
          <div className=" flex lg:block flex-row my-auto 2xl:pt-3 lg:pt-1">
            <Link
              to={`/profile/${props.creatorData.username}`}
              className="no-underline cursor-pointer text-black hover:no-underline"
            >
              <span className="2xl:text-2xl lg:text-md font-semibold dark:text-white">
                {props.creatorData.name}
              </span>
            </Link>
            <p className="hidden lg:block lg:text-sm 2xl:text-lg">{props.creatorData.username}</p>
          </div>
          <i className="fas fa-info-circle block mt-3 2xl:mt-5 lg:mt-4 ml-3 2xl:text-lg lg:text-md text-dbeats-light hidden"></i>
        </div>
      </div>
      <div className="w-full " align="center">
        <div className="2xl:h-10 h-10 lg:h-9 2xl:mt-4 mt-4 lg:mt-0">
          <IconButton onClick={props.onRewind} className={classes.controlIcons} aria-label="rewind">
            <FastRewindIcon
              className="text-dbeats-light "
              style={{ width: '1.8rem', height: '1.8rem' }}
            />
          </IconButton>
          <IconButton
            onClick={props.onPlayPause}
            className={classes.control_icons}
            aria-label="play"
          >
            {props.playing ? (
              <PauseIcon
                className={classes.pause_icon}
                style={{ width: '2.2rem', height: '2.2rem' }}
              />
            ) : (
              <PlayArrowIcon
                className={classes.play_icon}
                style={{ width: '2.2rem', height: '2.2rem' }}
              />
            )}
          </IconButton>
          <IconButton
            onClick={props.onFastForward}
            className={classes.controlIcons}
            aria-label="forward"
          >
            <FastForwardIcon
              fontSize="inherit"
              className={classes.fast_forward}
              style={{ width: '1.8rem', height: '1.8rem' }}
            />
          </IconButton>
        </div>
        <div className="flex self-center">
          <PrettoSlider
            style={{ color: '#00d3ff' }}
            min={0}
            max={100}
            ValueLabelComponent={(tim) => (
              <ValueLabelComponent {...tim} value={props.elapsedTime} />
            )}
            aria-label="custom thumb label"
            value={props.played * 100}
            onChange={props.onSeek}
            onMouseDown={props.onSeekMouseDown}
            onChangeCommitted={props.onSeekMouseUp}
            onDuration={props.onDuration}
            className="mx-auto mt-1 lg:mt-3"
          />
          <div
            className="self-center px-2 pb-1.5 hidden lg:block"
            onClick={props.onChangeDispayFormat}
          >
            <p className="lg:text-sm 2xl:text-lg lg:mt-2">
              {props.elapsedTime}/{props.totalDuration}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex lg:justify-center  lg:h-full  h-10 -mt-10 lg:-mt-0  lg:pb-0 justify-around">
          <div className="  lg:block justify-center lg:self-center hidden">
            <IconButton
              onClick={props.onMute}
              className={`${classes.bottomIcons} ${classes.volumeButton} mt-5`}
              style={{ color: '#00d3ff' }}
            >
              {props.muted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 lg:h-5 lg:w-5 2xl:h-9 2xl:w-9"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </IconButton>

            <Slider
              min={0}
              max={100}
              value={props.muted ? 0 : props.volume * 100}
              onChange={props.onVolumeChange}
              aria-labelledby="input-slider"
              onMouseDown={props.onSeekMouseDown}
              onChangeCommitted={props.onVolumeSeekDown}
              style={{ width: '150px', marginBottom: '-8px', color: '#00d3ff' }}
              className="lg:self-center lg:mt-0 hidden lg:block"
            />
          </div>
          <div className="self-center hidden lg:block ">
            <IconButton
              onClick={props.onToggleFullScreen}
              className={classes.bottomIcons}
              style={{ paddingLeft: '15px', color: '#00d3ff' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 lg:h-5 lg:w-5 2xl:h-8 2xl:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
