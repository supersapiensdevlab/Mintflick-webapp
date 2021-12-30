import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waves = ({ src, isPlaying, currentTime, setIsPlaying, setHidden }) => {
  const waveformRef = useRef();
  const [wavesurfer, setWavesurfer] = useState(null);

  useEffect(() => {
    if (waveformRef.current) {
      setWavesurfer(
        WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#D9DCFF',
          progressColor: '#4353FF',
          cursorColor: '#4353FF',
          barWidth: 3,
          barRadius: 3,
          cursorWidth: 1,
          height: 200,
          barGap: 3,
          interact: false,
        }),
      );
    }
    // eslint-disable-next-line
  }, [waveformRef]);

  useEffect(() => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.play();
      } else {
        wavesurfer.pause();
      }
    }
    // eslint-disable-next-line
  }, [isPlaying]);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.seekTo(currentTime / wavesurfer.getDuration());
    }
    // eslint-disable-next-line
  }, [currentTime]);

  useEffect(() => {
    loadAudio();
    if (wavesurfer) {
      wavesurfer.on('ready', function () {
        setHidden(false);
      });
      wavesurfer.on('finish', function () {
        setIsPlaying(false);
        wavesurfer.stop();

        let data = JSON.parse(window.sessionStorage.getItem('Track_Array'));
        let index = JSON.parse(window.sessionStorage.getItem('Track_Index'));
        //console.log('finish');
        if (JSON.parse(window.sessionStorage.getItem('Track_Index')) > [data.length - 2]) {
          window.sessionStorage.setItem('Track_Index', '0');
        } else {
          let value = JSON.parse(window.sessionStorage.getItem('Track_Index'));
          window.sessionStorage.setItem('Track_Index', value + 1);
        }
        window.history.replaceState({}, 'track', `/track/${data[index].username}/0`);
      });
    }
    // eslint-disable-next-line
  }, [wavesurfer]);

  const loadAudio = () => {
    if (wavesurfer) {
      wavesurfer.load(src);
      //wavesurfer.zoom(Number(250));
    }
    //console.log(wavesurfer);
  };

  return (
    <>
      <div ref={waveformRef} className="z-0"></div>
    </>
  );
};

export default Waves;
