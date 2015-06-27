const React = require('react');
const Console = require('./console');
const Ace = require('./ace');
const babel = require('babel-core/browser');
const consoleLog = require('./hijack-log')();
const PlayRun = require('./play-run');
const SplitDragger = require('./split-dragger');

const debounce = (fn, ms, t) => () => {
  clearTimeout(t);
  t = setTimeout(fn, ms); };

const styles = {
  aceEditor: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    overflow: 'hidden',
  },
  replContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  }
};

const ReactREPL = React.createClass({
  propTypes: {
    splitDraggerSize: React.PropTypes.number,
    initialOrientation: React.PropTypes.oneOf(['vertical', 'horizontal'])
  },
  getDefaultProps() {
    return {
      splitDraggerSize: 12,
      initialOrientation: 'vertical',
    }
  },
  getInitialState() {
    return {
      orientation: this.props.initialOrientation,
      splitOffsetPercent: 'splitOffset' in this.props ? this.props.initialSplitOffsetPercent : 50,
      autoRun: true,
      code: this.props.initialCode,
    };
  },
  componentDidMount() {
    //const update = debounce(_=> this.forceUpdate(), 100);
    //this.refs.ace.editor.on('change', _=> this.state.autoRun && update());
  },
  isVertical() {
    return this.state.orientation === 'vertical'
  },
  handleSplitDrag(offset) {
    const replContainerSize = React.findDOMNode(this.refs.repl)
                                   .getBoundingClientRect()
                                   [this.isVertical() ? 'width' : 'height'];

    const splitOffsetPercent = this.state.splitOffsetPercent + 100 * offset / replContainerSize;
    this.setState({ splitOffsetPercent });
  },
  render() {
    const isVertical = this.isVertical();
    const theCode = this.state.code;
    const splitDraggerSize = this.props.splitDraggerSize;
    const halfSplitDraggerSize = splitDraggerSize/2;

    consoleLog.clear();

    try {
      consoleLog('transformed....', theCode);
      const es5 = babel.transform(theCode).code;
      //const es5 = 'console.log("fake code");';
      consoleLog(es5);
      eval(es5);
    } catch (e) {
      console.log(e.stack);
    }

    const changingPos = isVertical ? 'left' : 'top';
    const fixedPos = isVertical ? 'top' : 'left';
    const changingDim = isVertical ? 'width' : 'height';
    const fixedDim = isVertical ? 'height' : 'width';

    const aceEditorStyles = {
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

    const outputStyles = {
      position: 'absolute',
      overflow: 'hidden',
      [fixedPos]: '0',
      [fixedDim]: '100%',
      [changingPos]: `calc(${this.state.splitOffsetPercent}% + ${splitDraggerSize}px)`,
      [changingDim]: `calc(${this.state.splitOffsetPercent}% - ${halfSplitDraggerSize}px)` };

    return (
      <div style={styles.replContainer} ref="repl">
        <div style={aceEditorStyles}>
          <Ace
            ref="ace"
            name="aceEditor"
            mode="javascript"
            theme="monokai" />
        </div>

        <SplitDragger {...splitDraggerProps} />

        <div style={outputStyles}>

          <div>
            <Console log={consoleLog.get() || null} />
          </div>

          <PlayRun />

        </div>
      </div>
    );
  }
});

module.exports = ReactREPL;
