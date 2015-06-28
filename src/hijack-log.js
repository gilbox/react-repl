const _log = console.log.bind(console);
let hijacked = false;
let fullLog = '';

_log.clear = function () {
  fullLog = '';
};

_log.get = function () {
  return fullLog;
};

function hijackLog() {
  if (hijacked) return _log;

  console.warn("The console.log has been hijacked by react-repl. This is not a security alert, it's a notice to developers.");

  console.log = function(...args) {
    fullLog += (fullLog ? "\n":'') +
      args.map(v =>
        (typeof v === 'string') ?
          `${v} ` : JSON.stringify(v, null, 2) + "\n").join('');
    _log.apply(console, args);
  }

  hijacked = true;

  return _log;
}

module.exports = hijackLog;
