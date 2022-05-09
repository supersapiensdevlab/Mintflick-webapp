import { useCallback, useEffect, useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';
import { clearProvider } from '../actions/web3Actions';
import { useDispatch, useSelector } from 'react-redux';
import { createProvider } from '../actions/web3Actions';
import { web3Login } from '../actions/userActions';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { logout } from '../actions/userActions';

//import WalletConnectProvider from "@walletconnect/web3-provider";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
//const INFURA_ID =  "https://polygon-mumbai.infura.io/v3/a186bf6fba224d889e3facc647134699";

const NETWORK_NAME = 'mumbai';
const torus = new Torus({
  buttonPosition: 'bottom-left', // customize position of torus icon in dapp
});
const useWeb3Modal = (config = {}) => {
  const history = useHistory();

  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, NETWORK = NETWORK_NAME } = config;

  const provider = useSelector((state) => state.web3Reducer.provider);

  const dispatch = useDispatch();

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    //console.log(torus);
    let userInfo = null;
    if (!torus.isInitialized) {
      await torus.init({
        enableLogging: true,
        network: {
          host: 'matic', // mandatory https://rpc-mumbai.maticvigil.com
          networkName: 'Matic Mainnet', // optional
          chainId: '137',
          blockExplorer: 'https://polygonscan.com/',
          ticker: 'MATIC',
          tickerName: 'MATIC',
        },
      });
      console.log('init '); //, torusinit);
    }
    if (!torus.isLoggedIn) {
      await torus.login();
      userInfo = await torus.getUserInfo();
      window.localStorage.setItem(
        'torus',
        JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.profileImage,
        }),
      );
      console.log(torus);
      console.log('Hi', userInfo.name, ' registered with', userInfo.email);
      /*
        email: string;
        name: string;
        profileImage: string;
        verifier: string;
        verifierId: string;
      */
    } else {
      userInfo = await torus.getUserInfo();

      console.log('Hi', userInfo.name, 'you are registered with', userInfo.email);
    }

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    if (userInfo) {
      const userData = {
        walletId: address,
        name: userInfo.name,
        email: userInfo.email,
        profileImage: userInfo.profileImage,
      };
      await axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`, userData, {})
        .then((value) => {
          window.localStorage.setItem('user', JSON.stringify(value.data.user));
          dispatch(web3Login(value.data));
          // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
          // //window.location.href = '/';
          console.log(value.data);
        });
    }
    dispatch(createProvider(web3.currentProvider));

    return web3.currentProvider;
  }, [dispatch]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      torus.logout();
      torus.cleanUp();

      dispatch(clearProvider());
      console.log(torus);
      console.log('logging out');

      window.localStorage.removeItem('torus');
    },
    [dispatch],
  );

  const logoutweb3 = useCallback(
    async function () {
      await torus.logout();
      await torus.cleanUp();
      dispatch(logout());

      dispatch(clearProvider());
      console.log(torus);
      console.log('logging out');
    },
    [dispatch],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.

  return [loadWeb3Modal, logoutOfWeb3Modal, logoutweb3];
};

export default useWeb3Modal;
