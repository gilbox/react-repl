const React = require('react');
const {Component} = React;
const SplitDragger = require('./split-dragger');
const DOUBLE_CLICK_TIMEOUT = 300;

export default class SplitView extends Component {
  static propTypes = {
    splitDraggerSize: React.PropTypes.number,
    initialOrientation: React.PropTypes.oneOf(['vertical', 'horizontal'])
  }

  static defaultProps = {
    splitDraggerSize: 12,
    initialOrientation: 'vertical',
    initialSplitOffsetPercent: 50,
  }

  constructor(props) {
    super(props);
    this.state = {
      orientation: props.initialOrientation,
      splitOffsetPercent: props.initialSplitOffsetPercent,
    };
  }

  isVertical() {
    return this.state.orientation === 'vertical'
  }

  handleSplitDrag(offset) {
    const containerSize = React.findDOMNode(this.refs.container)
                                   .getBoundingClientRect()
                                   [this.isVertical() ? 'width' : 'height'];

    const splitOffsetPercent = this.state.splitOffsetPercent + 100 * offset / containerSize;
    this.setState({ splitOffsetPercent });
  }

  handleSplitClick() {
    if (this.splitClicked) {
      // toggle orientation on dbl-click
      this.setState({orientation: this.isVertical() ? 'horizontal' : 'vertical' });
    } else {
      this.splitClicked = true;
      setTimeout(_=> this.splitClicked = false, DOUBLE_CLICK_TIMEOUT);
    }
  }

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
      onClick: ::this.handleSplitClick,
      onDragEnd: ::this.handleSplitDrag,
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
      [changingDim]: `calc(${100-this.state.splitOffsetPercent}% - ${halfSplitDraggerSize}px)` };

    return (
      <div style={this.props.style} ref="container">
        <div style={firstPaneStyles}>{this.props.children[0]}</div>
        <SplitDragger {...splitDraggerProps} />
        <div style={secondPaneStyles}>{this.props.children[1]}</div>
      </div>
    );
  }
}
