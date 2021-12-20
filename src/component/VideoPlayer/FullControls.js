/* eslint-disable react/display-name */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FullScreen from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeMute from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import classes from './videoPlayer.module.css';

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
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

const FullControls = forwardRef(
  (
    {
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onDuration,
      onPlayPause,
      playing,
      played,
      elapsedTime,
      totalDuration,
      onMute,
      muted,
      onVolumeSeekDown,
      onChangeDispayFormat,
      onToggleFullScreen,
      volume,
      onVolumeChange,
    },
    ref,
  ) => {
    const handleOnClick = () => {
      ref.current.style.visibility = 'hidden';
    };

    const handleOnControlClick = () => {
      ref.current.style.visibility = 'visibile';
    };

    return (
      <div ref={ref} className={classes.controlsWrapper} onClick={handleOnClick}>
        <Grid
          container
          direction="column"
          justify="bottom"
          style={{
            flexGrow: 1,
            position: 'fixed',
            marginBottom: '0px',
            paddingBottom: '0px',
            bottom: -15,
          }}
          onMouseMove={handleOnControlClick}
        >
          <Grid container direction="row" justify="space-between" style={{ padding: 20 }}>
            <Grid item xs={12}>
              <PrettoSlider
                min={0}
                max={100}
                ValueLabelComponent={(props) => (
                  <ValueLabelComponent {...props} value={elapsedTime} />
                )}
                aria-label="custom thumb label"
                value={played * 100}
                onChange={onSeek}
                onMouseDown={onSeekMouseDown}
                onChangeCommitted={onSeekMouseUp}
                onDuration={onDuration}
              />
            </Grid>

            <Grid alignItems="center">
              <IconButton onClick={onPlayPause} style={{ color: 'white' }}>
                {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>

              <Button
                variant="text"
                onClick={
                  onChangeDispayFormat
                  //     () =>
                  //   setTimeDisplayFormat(
                  //     timeDisplayFormat == "normal" ? "remaining" : "normal"
                  //   )
                }
              >
                <Typography variant="body1" style={{ color: '#fff', marginLeft: 16 }}>
                  {elapsedTime}/{totalDuration}
                </Typography>
              </Button>
            </Grid>

            <Grid item direction="row" align="right" style={{ width: '30%' }}>
              <IconButton
                // onClick={() => setState({ ...state, muted: !state.muted })}
                onClick={onMute}
                className={`${classes.bottomIcons} ${classes.volumeButton}`}
                style={{ color: 'white' }}
              >
                {muted ? (
                  <VolumeMute fontSize="large" />
                ) : volume > 0.5 ? (
                  <VolumeUp fontSize="large" />
                ) : (
                  <VolumeDown fontSize="large" />
                )}
              </IconButton>

              <Slider
                min={0}
                max={100}
                value={muted ? 0 : volume * 100}
                onChange={onVolumeChange}
                aria-labelledby="input-slider"
                onMouseDown={onSeekMouseDown}
                onChangeCommitted={onVolumeSeekDown}
                style={{ color: 'white', width: '25%', marginBottom: '-8px' }}
              />
              <IconButton
                onClick={onToggleFullScreen}
                className={classes.bottomIcons}
                style={{ paddingLeft: '40px', color: '#fff' }}
              >
                <FullScreen fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  },
);

FullControls.propTypes = {
  onSeek: PropTypes.func,
  onSeekMouseDown: PropTypes.func,
  onSeekMouseUp: PropTypes.func,
  onDuration: PropTypes.func,
  onRewind: PropTypes.func,
  onPlayPause: PropTypes.func,
  onFastForward: PropTypes.func,
  onVolumeSeekDown: PropTypes.func,
  onChangeDispayFormat: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
  elapsedTime: PropTypes.string,
  totalDuration: PropTypes.string,
  muted: PropTypes.bool,
  playbackRate: PropTypes.number,
};
export default FullControls;
