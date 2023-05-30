import React from 'react';
('use client');
import { useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';

type Props = {};

export default function ConnectPolygonWalletButton({}: Props) {
  const [account, setAccount] = useState<
    { address: string; balance: string } | undefined
  >();
  const torus = new Torus({
    buttonPosition: 'top-right', // default: 'bottom-left'
  });
  const onClickLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await torus.init({
      enableLogging: false,
    });
    await torus.hideTorusButton();

    await torus.login();

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance });
  };

  return (
    <div className='App'>
      {account ? (
        <div className='App-info'>
          <p>
            <strong>Address</strong>: {account.address}
          </p>
          <p>
            <strong>Balance</strong>: {account.balance}
          </p>{' '}
          <button className='App-link' onClick={() => torus.logout()}>
            Logout
          </button>
        </div>
      ) : (
        <>
          <p>You haven't logged in yet. Log in to see your account details.</p>
          <button className='App-link' onClick={onClickLogin}>
            Login
          </button>
        </>
      )}
    </div>
  );
}
