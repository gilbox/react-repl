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
  fill: {
    height: '100%'
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
      autoRun: true,
      code: this.props.initialCode,
    };
  },

  componentDidMount() {
    //const update = debounce(_=> this.forceUpdate(), 100);
    //this.refs.ace.editor.on('change', _=> this.state.autoRun && update());
  },

  render() {
    const theCode = this.state.code;

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

    return (
      <div style={styles.replContainer} ref="repl">

        <SplitView
          style={styles.replContainer}
          orientation={this.state.orientation}
          splitDraggerSize={this.props.splitDraggerSize}>

          <div style={styles.fill}>
            <Ace
              ref="ace"
              name="aceEditor"
              mode="javascript"
              theme="monokai" />
          </div>

          <div style={styles.fill}>

            <div>
              <Console log={consoleLog.get() || null} />
            </div>

            <PlayRun />
          </div>

        </SplitView>

      </div>
    );
  }
});

module.exports = ReactREPL;
