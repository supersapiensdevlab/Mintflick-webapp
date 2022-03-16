import { useCallback, useEffect, useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';
import { clearProvider } from '../actions/web3Actions';
import { useDispatch, useSelector } from 'react-redux';
import { createProvider } from '../actions/web3Actions';

//import WalletConnectProvider from "@walletconnect/web3-provider";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
//const INFURA_ID =  "https://polygon-mumbai.infura.io/v3/a186bf6fba224d889e3facc647134699";

const NETWORK_NAME = 'mumbai';

const useWeb3Modal = (config = {}) => {
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, NETWORK = NETWORK_NAME } = config;

  const provider = useSelector((state) => state.web3Reducer.provider);

  const torus = new Torus({
    buttonPosition: 'bottom-right', // customize position of torus icon in dapp
  });
  window.torus = torus;

  const dispatch = useDispatch();

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    //console.log(torus);

    if (!torus.isInitialized)
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

    if (!torus.isLoggedIn) {
      await torus.login();
      const userInfo = await torus.getUserInfo();

      console.log('Hi', userInfo.name, ' registered with', userInfo.email);
      /*
        email: string;
        name: string;
        profileImage: string;
        verifier: string;
        verifierId: string;
      */
    } else {
      const userInfo = await torus.getUserInfo();

      console.log('Hi', userInfo.name, 'you are registered with', userInfo.email);
    }

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);

    dispatch(createProvider(web3.currentProvider));
    return web3.currentProvider;
  }, []);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      if (torus.isLoggedIn) {
        await torus.logout();
      } else if (torus.isInitialized) {
        torus.cleanUp();
      }
      console.log(torus);
      console.log('logging out');
      return provider;
    },
    [!torus.isLoggedIn],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && torus.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, torus.cachedProvider]);

  return [loadWeb3Modal, logoutOfWeb3Modal];
};

export default useWeb3Modal;
