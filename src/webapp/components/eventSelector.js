import React from 'react'
import PropTypes from 'prop-types'

class EventSelector extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      selected: {}
    }
    for (let item of this.props.options) {
      this.state.selected[item.id] = true
    }

    this.handleAllClick = () => {
      const newState = !this.allSelected()
      this.setState({
        selected: this.props.options.map(item => item.id).reduce(
          (prev, item) => { prev[item] = newState; return prev }, {}
        )
      })
    }

    this.handleClick = (ev) => {
      const updatedSelected = Object.assign({}, this.state.selected)
      const id = ev.target.attributes['data-id'].value
      updatedSelected[id] = !this.state.selected[id]
      this.setState({
        selected: updatedSelected
      })
    }
  }

  renderItem(item) {
    return <li key={item.id} ref={item.id}>
      <input type='checkbox'
        checked={this.state.selected[item.id]}
        data-id={item.id}
        onChange={this.handleClick}
      />
      {item.name}
    </li>
  }

  allSelected() {
    return this.props.options.map(item => item.id).reduce(
      (prev, item) => prev && this.state.selected[item], true
    )
  }

  renderAll() {
    return <li key='all'>
      <input type='checkbox'
        checked={this.allSelected()}
        onChange={this.handleAllClick}
      />
      All
    </li>
  }

  renderOptions() {
    const options = this.props.options.map(item => this.renderItem(item))
    options.push(this.renderAll())
    return options
  }

  getSelections() {
    return this.props.options.filter(item => this.state.selected[item.id])
  }

  render() {
    return (<ul>
      { this.renderOptions() }
    </ul>)
  }
}

EventSelector.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string
    })
  )
}

export default EventSelector
