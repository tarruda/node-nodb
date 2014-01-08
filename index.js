var extensible = require('extensible');

var nodb = extensible();


nodb.method('get', 'key, cb');
nodb.method('put', 'key, value, cb');
nodb.method('del', 'key, cb');
nodb.method('iterator', 'options, cb');


module.exports = function() {
  return nodb.fork();
};

