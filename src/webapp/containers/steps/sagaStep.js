import React from "react";

export default class SagaStep extends React.Component {
  constructor() {
    super(...arguments);
    this.action = () => this.props.dispatch(this.createAction());
  }
}
