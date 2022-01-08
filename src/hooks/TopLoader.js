import React, { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

const TopLoader = ({ page }) => {
  const loaderRef = useRef(null);
  useEffect(() => {
    loaderRef.current.continuousStart();
    setTimeout(() => {
      loaderRef.current.complete();
    }, 1000);
    // eslint-disable-next-line
  }, [page]);
  return <LoadingBar color="#00d3ff" ref={loaderRef} shadow={true} />;
};

export default TopLoader;
