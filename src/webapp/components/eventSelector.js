import React from 'react'
import PropTypes from 'prop-types'

class EventSelector extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      selected: {}
    }

    for (let item of this.props.options) {
      this.state.selected[item] = true
    }
  }

  handleAllClick = () => {
    const newState = !this.allSelected()
    const selected = this.props.options.reduce((prev, item) => {
      prev[item] = newState
      return prev
    }, {})

    this.setState({ selected })
  }

  handleClick = ev => {
    const updatedSelected = Object.assign({}, this.state.selected)
    const name = ev.target.value
    updatedSelected[name] = !this.state.selected[name]
    this.setState({
      selected: updatedSelected
    })
  }

  renderItem(item, index) {
    return (
      <li key={index}>
        <input
          type="checkbox"
          checked={this.state.selected[item]}
          value={item}
          onChange={this.handleClick}
        />
        {item}
      </li>
    )
  }

  allSelected() {
    return this.props.options
      .reduce((prev, item) => prev && this.state.selected[item], true)
  }

  renderAll() {
    return (
      <li key="all">
        <input
          type="checkbox"
          checked={this.allSelected()}
          value="all"
          onChange={this.handleAllClick}
        />
        All
      </li>
    )
  }

  renderOptions() {
    const options = this.props.options.map(this.renderItem.bind(this))
    options.push(this.renderAll())
    return options
  }

  getSelections() {
    return this.props.options.filter(item => this.state.selected[item])
  }

  render() {
    return <ul>{this.renderOptions()}</ul>
  }
}

EventSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string)
}

export default EventSelector
