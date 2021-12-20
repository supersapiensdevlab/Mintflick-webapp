import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import classes from './videoPlayer.module.css';

// eslint-disable-next-line react/display-name
const PlayControls = forwardRef(({ onPlayPause, playing }, ref) => {
  return (
    <div ref={ref} className={classes.playcontrolsWrapper}>
      <Grid className={classes.playbtn_position} container>
        <IconButton onClick={onPlayPause} style={{ color: 'white' }}>
          {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
      </Grid>
    </div>
  );
});

PlayControls.propTypes = {
  onPlayPause: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
};
export default PlayControls;
