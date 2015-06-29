const React = require('react');
const Repl = require('./');

export default (mode, theme) =>
  (domElement, initialCode, initialOrientation, splitDraggerSize=20) =>
    React.render(
      <Repl
        mode={mode}
        theme={theme}
        splitDraggerSize={splitDraggerSize}
        initialOrientation={initialOrientation}
        initialCode={initialCode} />
      , domElement);
