import React from "react";

export default class NextButton extends React.Component {
  render() {
    return (
      <button className="next" onClick={() => (this.props.action || {})()}>
        <span>next</span>
      </button>
    );
  }
}
