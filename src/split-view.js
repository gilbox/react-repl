const React = require('react');
const SplitDragger = require('./split-dragger');

const SplitView = React.createClass({
  propTypes: {
    splitDraggerSize: React.PropTypes.number,
    orientation: React.PropTypes.oneOf(['vertical', 'horizontal'])
  },

  getDefaultProps() {
    return {
      splitDraggerSize: 12,
      orientation: 'vertical',
      initialSplitOffsetPercent: 50,
    }
  },

  getInitialState() {
    return {
      splitOffsetPercent: this.props.initialSplitOffsetPercent,
    };
  },

  isVertical() {
    return this.props.orientation === 'vertical'
  },

  handleSplitDrag(offset) {
    const containerSize = React.findDOMNode(this.refs.container)
                                   .getBoundingClientRect()
                                   [this.isVertical() ? 'width' : 'height'];

    const splitOffsetPercent = this.state.splitOffsetPercent + 100 * offset / containerSize;
    this.setState({ splitOffsetPercent });
  },

  render() {
    const isVertical = this.isVertical();
    const splitDraggerSize = this.props.splitDraggerSize;
    const halfSplitDraggerSize = splitDraggerSize/2;

    const changingPos = isVertical ? 'left' : 'top';
    const fixedPos = isVertical ? 'top' : 'left';
    const changingDim = isVertical ? 'width' : 'height';
    const fixedDim = isVertical ? 'height' : 'width';

    const firstPaneStyles = {
      position: 'absolute',
      overflow: 'hidden',
      top: '0',
      left: '0',
      [fixedDim]: '100%',
      [changingDim]: `calc(${this.state.splitOffsetPercent}% - ${halfSplitDraggerSize}px)` };

    const splitDraggerProps = {
      position: "absolute",
      onDragEnd: this.handleSplitDrag,
      orientation: this.state.orientation,
      [changingPos]: `calc(${this.state.splitOffsetPercent}% - ${halfSplitDraggerSize}px)`,
      [fixedDim]: '100%',
      [changingDim]: splitDraggerSize };

    const secondPaneStyles = {
      position: 'absolute',
      overflow: 'hidden',
      [fixedPos]: '0',
      [fixedDim]: '100%',
      [changingPos]: `calc(${this.state.splitOffsetPercent}% + ${halfSplitDraggerSize}px)`,
      [changingDim]: `calc(${this.state.splitOffsetPercent}% - ${halfSplitDraggerSize}px)` };

    return (
      <div style={this.props.style} ref="container">
        <div style={firstPaneStyles}>{this.props.children[0]}</div>
        <SplitDragger {...splitDraggerProps} />
        <div style={secondPaneStyles}>{this.props.children[1]}</div>
      </div>
    );
  }
});

module.exports = SplitView;
