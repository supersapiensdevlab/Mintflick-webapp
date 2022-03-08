import { useCallback, useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';

//import WalletConnectProvider from "@walletconnect/web3-provider";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
//const INFURA_ID =  "https://polygon-mumbai.infura.io/v3/a186bf6fba224d889e3facc647134699";

const NETWORK_NAME = 'mainnet';

const useWeb3Modal = (config = {}) => {
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, NETWORK = NETWORK_NAME } = config;

  const web3auth = new Web3Auth({
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: 'https://rpc-mumbai.maticvigil.com',
      blockExplorer: 'https://mumbai-explorer.matic.today',
      chainId: '0x13881',
      displayName: 'Polygon Mumbai Testnet',
      ticker: 'matic',
      tickerName: 'matic',
    },
    whiteLabel: {
      theme: {
        isDark: true,
        colors: {
          torusBrand1: '#282c34',
        },
      },
      logoDark:
        'https://bafybeifkq5r5b7wiaaap4jxptoiuxbjdacmig6yu3m76whhf2422doyr7e.ipfs.dweb.link/', // Dark logo for light background
      logoLight:
        'https://bafybeifkq5r5b7wiaaap4jxptoiuxbjdacmig6yu3m76whhf2422doyr7e.ipfs.dweb.link/', // Light logo for dark background

      defaultLanguage: 'en',
    },
    clientId:
      'BFrU6JsPLNdCdC1jb72ye0Pwc1ViJVl4D9aSqT2qdgPxrUZ79CbwxnhTimVo5cRrXPbGsVWGEYhl0bgIiGhmZc0', // get your clientId from https://developer.web3auth.io
  });
  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  // const web3Modal = new Web3Modal({
  //   network: NETWORK,
  //   cacheProvider: true,
  //   providerOptions: {},
  // });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    await web3auth.initModal();

    const provider = await web3auth.connect();
    setProvider(new Web3(provider));
    return provider;
  }, [web3auth]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3auth.logout();
      await web3auth.clearCachedProvider();
      window.location.reload();
    },
    [web3auth],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3auth.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3auth.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
};

export default useWeb3Modal;
