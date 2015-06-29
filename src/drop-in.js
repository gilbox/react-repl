const React = require('react');
const Repl = require('./');

export default function repl(domElement) {
  React.render(
    <Repl
      mode="javascript"
      theme={null}
      splitDraggerSize={20}
      initialOrientation="vertical"
      initialCode={initialCode} />
    , domElement);
}
