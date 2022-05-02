import { Framework } from '@superfluid-finance/sdk-core';
import { Web3Provider } from '@ethersproject/providers';

const testFlow = async (props) => {
  const amount = props.amount;

  const walletAddress = await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
  const sf = await Framework.create({
    ethers: new Web3Provider(window.ethereum),
  });
  await sf.initialize();

  const carol2 = sf.user({
    address: walletAddress[0],

    // fDAIx token, which is a test Super Token on Goerli network
    token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
  });

  await carol2.flow({
    recipient: '0xF976A17dE1945C6977725aE289A1c2EA5d036789',
    // This flow rate is equivalent to 1 tokens per month, for a token with 18 decimals.
    flowRate: 385802469135 * amount,
  });

  //const details = await carol2.details();
  //console.log(details);
};

testFlow();
