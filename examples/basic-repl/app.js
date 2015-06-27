const React = require('react');
const Repl = require('react-repl');

require('brace/mode/javascript');
require('brace/theme/monokai');

const App = React.createClass({
  render() {
    const initialCode = "console.log('foooo');"
    return (
      <Repl
        splitDraggerSize={20}
        initialOrientation="vertical"
        initialCode={initialCode} />
    );
  }
});

React.render(<App />, document.getElementById('example'));
