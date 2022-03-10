import { useState } from 'react';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import person from '../../assets/images/person.png';

function App() {
  const [account, setAccount] = useState();

  const onClickLogin = async (e) => {
    e.preventDefault();

    const torus = new Torus({});
    await torus.init({
      loginConfig: {
        // Customize login provider configurations.

        // Customize brand logo, colors, and translation
        whitelabel: {
          theme: {
            isDark: true,
            colors: {
              torusBrand1: '#00d3ff',
            },
          },
          logoDark: 'https://tkey.surge.sh/images/Device.svg', // Dark logo for light background
          logoLight: 'https://tkey.surge.sh/images/Device.svg', // Light logo for dark background
          topupHide: true,
          featuredBillboardHide: false,
          disclaimerHide: false,
          defaultLanguage: 'en',
        },
      },
    });

    await torus.login();
    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={person} className="App-logo" alt="logo" />
        {account ? (
          <div className="App-info">
            <p>
              <strong>Address</strong>: {account.address}
            </p>
            <p>
              <strong>Balance</strong>: {account.balance}
            </p>
          </div>
        ) : (
          <>
            <p>You login yet. Login to see your account details.</p>
            <button className="App-link" onClick={onClickLogin}>
              Login
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
