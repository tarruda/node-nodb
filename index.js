/*jshint eqnull:true */

var classic = require('classic');

var NoDBMiddleware = require('./lib/middleware');


var NoDB = classic({
  constructor: function NoDB() {
    this._head = this._tail = null;
  },


  put: function(key, value, cb) {
    return this._head.put(key, value, cb);
  },


  del: function(key, cb) {
    return this._head.del(key, cb);
  },


  get: function(key, cb) {
    return this._head.get(key, cb);
  },


  iterator: function(options, cb) {
    return this._head.iterator(options, cb);
  },


  use: function(middleware) {
    if (typeof middleware === 'function')
      // call factory function
      middleware = middleware(this);

    if (this._head == null) {
      this._head = this._tail = new NoDBMiddleware(middleware);
      return;
    }

    this._tail.next = new NoDBMiddleware(middleware);
    this._tail = this._tail.next;
  }
});


module.exports = function nodb(extensions) {
  return new NoDB(extensions);
};
