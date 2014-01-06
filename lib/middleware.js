var classic = require('classic');


var NoDBMiddleware = classic({
  constructor: function NoDBMiddleware(middleware) {
    this._middleware = middleware;
    this.next = null;
  },


  put: function(key, value, cb) {
    var _this = this;

    if (_this._middleware.put) {
      return _this._middleware.put(key, value, function(key, value, cb) {
        _this.next.put(key, value, cb);
      }, cb);
    }

    return _this.next.put(key, value, cb);
  },


  del: function(key, cb) {
    var _this = this;

    if (_this._middleware.del) {
      return _this._middleware.del(key, function(key, cb) {
        _this.next.del(key, cb);
      }, cb);
    }

    return _this.next.del(key, cb);
  },


  get: function(key, cb) {
    var _this = this;

    if (_this._middleware.get) {
      return _this._middleware.get(key, function(key, cb) {
        _this.next.get(key, cb);
      }, cb);
    }

    return _this.next.get(key, cb);
  },


  iterator: function(options, cb) {
    var _this = this;

    if (_this._middleware.iterator) {
      return _this._middleware.iterator(options, function(options, cb) {
        _this.next.iterator(options, cb);
      }, cb);
    }

    return _this.next.iterator(key, cb);
  }
});


module.exports = NoDBMiddleware;
