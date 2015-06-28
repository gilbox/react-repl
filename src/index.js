const React = require('react');
const Console = require('./console');
const Ace = require('./ace');
const babel = require('babel-core/browser');
const consoleLog = require('./hijack-log')();
const PlayRun = require('./play-run');
const SplitView = require('./split-view');

const debounce = (fn, ms, t) => () => {
  clearTimeout(t);
  t = setTimeout(fn, ms); };

const styles = {
  ace: {
    height: '100%',
  },
  console: {
    height: '100%',
    overflow: 'auto',
  },
  replContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  playRun: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
  }
};

const ReactREPL = React.createClass({
  propTypes: {
    splitDraggerSize: React.PropTypes.number,
    initialOrientation: React.PropTypes.oneOf(['vertical', 'horizontal']),
    initialCode: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      splitDraggerSize: 12,
      initialOrientation: 'vertical',
      initialCode: ''
    }
  },

  getInitialState() {
    return {
      orientation: this.props.initialOrientation,
      autoRun: true,
      code: this.props.initialCode,
    };
  },

  componentDidMount() {
    // const update = debounce(_=> this.forceUpdate(), 100);
    // this.refs.ace.editor.on('change', _=> this.state.autoRun && update());
  },

  updateCode(value) {  // debounced update
    const code = value;
    clearTimeout(this.updateCodeTO);
    this.updateCodeTO = setTimeout(() => this.setState({code}), 200);
  },

  handleAceChange(value) {
    if (this.state.autoRun) {
      this.updateCode(value);
    }
  },

  render() {
    const theCode = this.state.code;

    consoleLog.clear();

    try {
      const es5 = babel.transform(theCode).code;
      consoleLog("-------- Transformed Code --------\n" + es5 + "\n----------------------------------");
      eval(es5);
    } catch (e) {
      console.log(e.stack);
    }

    return (
      <div style={styles.replContainer} ref="repl">

        <SplitView
          style={styles.replContainer}
          orientation={this.state.orientation}
          splitDraggerSize={this.props.splitDraggerSize}>

          <div style={styles.ace}>
            <Ace
              onChange={this.handleAceChange}
              ref="ace"
              name="aceEditor"
              mode="javascript"
              theme="monokai" />
          </div>

          <div style={styles.console}>

            <div>
              <Console log={consoleLog.get() || null} />
            </div>

            <PlayRun style={styles.playRun} />
          </div>

        </SplitView>

      </div>
    );
  }
});

module.exports = ReactREPL;
