import React from "react";

import Logo from "~/components/logo";

import Navbar from "./navbar";
import App from "./app";

export default class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <Navbar />
        <Logo />
        {this.props.children}
      </div>
    );
  }
}
