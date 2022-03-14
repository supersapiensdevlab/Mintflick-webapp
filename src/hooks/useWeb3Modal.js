import { useCallback, useEffect, useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';

//import WalletConnectProvider from "@walletconnect/web3-provider";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
//const INFURA_ID =  "https://polygon-mumbai.infura.io/v3/a186bf6fba224d889e3facc647134699";

const NETWORK_NAME = 'mumbai';

const useWeb3Modal = (config = {}) => {
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, NETWORK = NETWORK_NAME } = config;

  const torus = new Torus({
    buttonPosition: 'bottom-right', // customize position of torus icon in dapp
  });
  window.torus = torus;

  const [provider, setProvider] = useState(null);

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  // const web3Modal = new Web3Modal({
  //   network: NETWORK,
  //   cacheProvider: true,
  //   providerOptions: {},
  // });

  const polygonMumbaiConfig: CustomChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai-explorer.matic.today',
    chainId: '0x13881',
    displayName: 'Polygon Mumbai Testnet',
    ticker: 'matic',
    tickerName: 'matic',
  };

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    //console.log(torus);

    if (!torus.isInitialized)
      await torus.init({
        enableLogging: true,
        network: {
          host: 'https://rpc-mumbai.maticvigil.com', // mandatory
          networkName: 'Matic Mumbai', // optional
          chainId: '0x13881',
          blockExplorer: 'https://mumbai-explorer.matic.today',
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
    //console.log('provider', web3.currentProvider);
    setProvider(web3.currentProvider);
    //console.log(torus);
    return provider;
  }, [provider]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      console.log(torus);
      if (torus.isLoggedIn) {
        await torus.logout();
      } else if (torus.isInitialized) {
        torus.cleanUp();
      }
      setProvider(null);
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

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
};

export default useWeb3Modal;
