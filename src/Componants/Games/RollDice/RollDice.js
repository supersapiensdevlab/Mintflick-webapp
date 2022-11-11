import React, { Component } from "react";
import "./RollDice.css";
import Die from "./Die";
import { Dice } from "tabler-icons-react";
import Lottie from "lottie-react";
import wheel from "../../../Assets/graphics/wheel.json";

import fireworks from "../../../Assets/graphics/fireworks.json";

class RollDice extends Component {
  // Face numbers passes as default props
  static defaultProps = {
    sides: ["one", "two", "three", "four", "five", "six"],
  };
  constructor(props) {
    super(props);

    // States
    this.state = {
      die1: "one",
      die2: "one",
      rolling: false,
    };
    this.roll = this.roll.bind(this);
  }
  roll() {
    const { sides } = this.props;
    this.setState({
      // Changing state upon click
      die1: sides[Math.floor(Math.random() * sides.length)],
      die2: sides[Math.floor(Math.random() * sides.length)],
      rolling: true,
    });

    // Start timer of one sec when rolling start
    setTimeout(() => {
      // Set rolling to false again when time over
      this.setState({ rolling: false });
    }, 1000);
  }

  render() {
    const handleBtn = this.state.rolling ? "RollDice-rolling" : "";
    const { die1, die2, rolling } = this.state;
    return (
      <div className="RollDice p-2 pt-20  h-screen bg-slate-100 dark:bg-slate-800">
        <div className="RollDice-container">
          <Die face={die1} rolling={rolling} />
          <Die face={die2} rolling={rolling} />
        </div>
        <button
          className="btn btn-brand btn-md flex justify-center items-center space-x-2 text-white z-20"
          disabled={this.state.rolling}
          onClick={this.roll}
        >
          <Dice size={20} className="-mt-2 text-white" />
          <div className="-mt-2 text-white">
            {this.state.rolling ? "Rolling" : "Roll Dice!"}
          </div>
        </button>
        <div>
          <Lottie
            className="w-1/2 absolute bottom-0 sm:h-1/2 right-1/2 -z-1"
            autoplay={true}
            loop={true}
            animationData={fireworks}
          />
          <Lottie
            className="w-1/2 absolute bottom-0 sm:h-1/2 left-1/2 -z-1"
            autoplay={true}
            loop={true}
            animationData={wheel}
          />
        </div>
      </div>
    );
  }
}

export default RollDice;
