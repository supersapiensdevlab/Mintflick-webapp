'use client';
import { useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';

function App(): JSX.Element {
  const [account, setAccount] = useState<
    { address: string; balance: string } | undefined
  >();
  const onClickLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const torus = new Torus({
      buttonPosition: 'top-right', // default: 'bottom-left'
    });
    await torus.init({
      enableLogging: false,
      network: {
        host: 'https://rpc.testnet.mantle.xyz/', // mandatory
        networkName: 'Mantle Testnet',
        chainId: 5001,
        blockExplorer: 'https://explorer.testnet.mantle.xyz/',
        ticker: 'BIT',
        tickerName: 'BIT',
      },
    });
    // await torus.hideTorusButton();

    await torus.login();

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {/* <img src={wordmark} className='App-logo' alt='logo' /> */}

        {account ? (
          <div className='App-info'>
            <p>
              <strong>Address</strong>: {account.address}
            </p>
            <p>
              <strong>Balance</strong>: {account.balance}
            </p>{' '}
          </div>
        ) : (
          <>
            <p>
              You haven't logged in yet. Log in to see your account details.
            </p>
            <button className='App-link' onClick={onClickLogin}>
              Login
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
