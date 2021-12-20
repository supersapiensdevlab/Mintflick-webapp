import React from 'react';

class Ticket extends React.Component {
  constructor(props) {
    super(props);
    this.unlockHandler = this.unlockHandler.bind(this);
    this.checkout = this.checkout.bind(this);
    this.state = {
      locked: 'pending', // there are 3 state: pending, locked and unlocked
    };
  }

  /**
   * When the component mounts, listen to events from unlockProtocol
   */
  componentDidMount() {
    window.addEventListener('unlockProtocol', this.unlockHandler);
  }

  /**
   * Make sure we clean things up before unmounting
   */
  componentWillUnmount() {
    window.removeEventListener('unlockProtocol', this.unlockHandler);
  }

  /**
   * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
   */
  checkout() {
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal();
  }

  /**
   * event handler
   * @param {*} e
   */
  unlockHandler(e) {
    this.setState((state) => {
      return {
        ...state,
        locked: e.detail,
      };
    });
  }

  render() {
    const { locked } = this.state;
    console.log('locked', locked);
    return (
      <div className="App bg-white w-100 w-max md:w-full col-span-5">
        <header className="App-header bg-yellow-100 w-100">
          {locked === 'locked' && (
            <div
              onClick={this.checkout}
              className=" bg-blue-100 w-100"
              style={{ cursor: 'pointer' }}
            >
              Unlock me!{' '}
              <span aria-label="locked" role="img">
                🔒
              </span>
            </div>
          )}
          {locked === 'unlocked' && (
            <div className=" bg-blue-100 w-100 text-red-800">
              {console.log('unlocked')}
              Unlocked!{' '}
              <span aria-label="unlocked" role="img">
                🗝
              </span>
              <img
                alt="key"
                src="https://media.tenor.com/images/c11c77813c82e82ce26f760079719185/tenor.gif"
                className="w-48 h-48"
              ></img>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default Ticket;
