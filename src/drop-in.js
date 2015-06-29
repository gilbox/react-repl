const React = require('react');
const Repl = require('./');

export default function repl(
  domElement,
  initialCode,
  initialOrientation,
  mode='javascript',
  theme,
  splitDraggerSize=20
) {
  React.render(
    <Repl
      mode={mode}
      theme={theme}
      splitDraggerSize={splitDraggerSize}
      initialOrientation={initialOrientation}
      initialCode={initialCode} />
    , domElement);
}
