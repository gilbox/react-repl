const React = require('react');
const {Component} = React;
const styles = {
  shared: {
    zIndex: 100,
    position: 'relative'
  },
  vertical: {
    backgroundColor: 'black'
  },
  horizontal: {
    backgroundColor: 'black'
  },
  dragger: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }
};
const noop = ()=>undefined;

export default class SplitDragger extends Component {
  static propTypes = {
    style: React.PropTypes.object,
    draggerStyle: React.PropTypes.object,
    onDragEnd: React.PropTypes.func,
    onClick: React.PropTypes.func,
    orientation: React.PropTypes.oneOf(['vertical', 'horizontal'])
  }

  static defaultProps = {
    orientation: 'vertical',
    onDragEnd: noop,
    onClick: noop
  }

  constructor(props) {
    super(props);
    this.handleDocumentMouseUp = ::this.handleDocumentMouseUp;
    this.handleDocumentMouseMove = ::this.handleDocumentMouseMove;
    this.state = { draggerOffset: 0 };
  }

  isVertical() {
    return this.props.orientation === 'vertical';
  }

  handleDocumentMouseUp(event) {
    this.props.onDragEnd(this.state.draggerOffset);
    this.setState({ draggerOffset: 0 });
    document.removeEventListener("mousemove" , this.handleDocumentMouseMove , false);
    document.removeEventListener("mouseup" , this.handleDocumentMouseUp , false);
  }

  handleDocumentMouseMove(event) {
    const draggerOffset =
      this.isVertical() ?
        event.pageX - this.startPage :
        event.pageY - this.startPage;

    this.setState({draggerOffset});
  }

  handleMouseDown(event) {
    this.startPage = this.isVertical() ? event.pageX : event.pageY;
    document.addEventListener("mousemove" , this.handleDocumentMouseMove , false);
    document.addEventListener("mouseup" , this.handleDocumentMouseUp , false);
  }

  render() {
    const isVertical = this.isVertical();
    const draggerOffset = {
      [isVertical ? 'marginLeft' : 'marginTop']: this.state.draggerOffset };

    return (
      <div
        className={'this.props.className'}
        style={{
          position: this.props.position,
          height: this.props.height,
          width: this.props.width,
          left: this.props.left,
          top: this.props.top,
          ...styles.shared,
          ...styles[this.props.orientation],
          ...this.props.style }}>

        <div
          onClick={this.props.onClick}
          onMouseDown={::this.handleMouseDown}
          style={{
            cursor: isVertical ? 'ew-resize' : 'ns-resize',
            ...styles.dragger,
            ...draggerOffset,
            ...this.props.draggerStyle }} />

      </div>
    )
  }
}
