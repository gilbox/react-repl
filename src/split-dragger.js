const React = require('react');
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

module.exports = React.createClass({
  displayName: 'SplitDragger',

  propTypes: {
    style: React.PropTypes.object,
    draggerStyle: React.PropTypes.object,
    onDragEnd: React.PropTypes.func,
    orientation: React.PropTypes.oneOf(['vertical', 'horizontal'])
  },

  getDefaultProps() {
    return {
      orientation: 'vertical',
      onDragEnd: noop
    }
  },

  getInitialState() {
    return { draggerOffset: 0 };
  },

  isVertical() {
    return this.props.orientation === 'vertical';
  },

  handleDocumentMouseUp(event) {
    this.props.onDragEnd(this.state.draggerOffset);
    this.setState({ draggerOffset: 0 });
    document.removeEventListener("mousemove" , this.handleDocumentMouseMove , false);
    document.removeEventListener("mouseup" , this.handleDocumentMouseMove , false);
  },

  handleDocumentMouseMove(event) {
    const draggerOffset =
      this.isVertical() ?
        event.pageX - this.startPage :
        event.pageY - this.startPage;

    this.setState({draggerOffset});
  },

  handleMouseDown(event) {
    this.startPage = this.isVertical() ? event.pageX : event.pageY;
    document.addEventListener("mousemove" , this.handleDocumentMouseMove , false);
    document.addEventListener("mouseup" , this.handleDocumentMouseUp , false);
  },

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
          onMouseDown={this.handleMouseDown}
          style={{
            cursor: isVertical ? 'ew-resize' : 'ns-resize',
            ...styles.dragger,
            ...draggerOffset,
            ...this.props.draggerStyle }} />

      </div>
    )
  }
});
