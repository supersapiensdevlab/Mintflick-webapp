import React from 'react';
import { Image } from 'react-bootstrap';
import logo from '../../assets/images/white-logo.svg';
import classes from './Loader.module.css';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Image src={logo} className={classes.loader_image} />
    </div>
  );
};

export default Loader;
