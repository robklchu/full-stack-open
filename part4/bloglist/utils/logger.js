function info(...params) {
  return console.log(...params);
}

function error(...params) {
  return console.error(...params);
}

module.exports = { info, error };
