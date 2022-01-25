import React, { Component } from 'react';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chips: [],
    };
  }

  render() {
    var unlockProtocolConfig = {
      locks: {
        '0xabc': {
          // 0xabc is the address of a lock, obtained from the dashboard
          name: 'Developer Conference', // this is optional
        },
      },
      icon: 'https://url-of-your-logo',
      callToAction: {
        default: 'Purchase your ticket to attend the conference!',
        pending:
          'Your transaction was sent. It may take a few minutes to go through and you will receive it once it did.',
        confirmed:
          'You already have a ticket. Please make sure to check your key chain to view it!',
        noWallet: 'You do not have a wallet yet. Please install one.',
      },
    };
    const { locked } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {locked === 'locked' && (
            <div onClick={this.checkout} style={{ cursor: 'pointer' }}>
              Unlock me!{' '}
              <span aria-label="locked" role="img">
                🔒
              </span>
            </div>
          )}
          {locked === 'unlocked' && (
            <div>
              Unlocked!{' '}
              <span aria-label="unlocked" role="img">
                🗝
              </span>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default Ticket;
