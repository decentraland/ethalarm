import React from "react";

import LogDetail from "~/components/logDetail";

export default class Success extends React.Component {
  render() {
    const id = "ebf595a7-451e-483b-941a-ce87c510c437";
    return (
      <div className="success step">
        <p className="highlight">Details for entry {id}</p>
        <div className="explain">
          <LogDetail
            contractName="SomeContract"
            address="0x0F5D2fB29fb7d3CFeE444a200298f468908cC942"
            events={["Deposit", "Withdraw"]}
            email="john@doe.com"
            id={id}
          />
        </div>
      </div>
    );
  }
}
