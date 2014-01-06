var assert = require('assert');
var sinon = require('sinon');
var nodb = require('../index');


for (var k in assert) global[k] = assert[k];


describe('nodb', function() {
  var db, top, mid, bot;


  beforeEach(function() {
    top = {
      put: function(key, value, next, cb) {
        next(key * 2, value / 2, function(r) { cb(true); });
      },
      del: function(key, next, cb) {
        next(key * 4, function(x, y) { cb(x, y / 3); });
      },
      get: function(key, next, cb) {
        next(key * 8, function(x, y) { cb(x, y * 10); });
      },
      iterator: function(options, next, cb) {
        next(options * 64, function(x, y) { cb(x, y / 64); });
      }
    };
    mid = {
      put: function(key, value, next, cb) {
        next(key * 2, value / 2, function(r) { cb(false); });
      },
      del: function(key, next, cb) {
        next(key * 4, function(x, y) { cb(x, y / 3); });
      },
      get: function(key, next, cb) {
        next(key * 8, function(x, y) { cb(x, y * 10); });
      },
      iterator: function(options, next, cb) {
        next(options * 64, function(x, y) { cb(x, y / 64); });
      }
    };
    bot = {
      put: function(key, value, next, cb) {
        cb(null);
      },
      del: function(key, next, cb) {
        cb(null, 9);
      },
      get: function(key, next, cb) {
        cb(null, 9);
      },
      iterator: function(options, next, cb) {
        cb(null, options);
      }
    };

    sinon.spy(top, 'put');
    sinon.spy(mid, 'put');
    sinon.spy(bot, 'put');
    sinon.spy(top, 'del');
    sinon.spy(mid, 'del');
    sinon.spy(bot, 'del');
    sinon.spy(top, 'get');
    sinon.spy(mid, 'get');
    sinon.spy(bot, 'get');
    sinon.spy(top, 'iterator');
    sinon.spy(mid, 'iterator');
    sinon.spy(bot, 'iterator');

    db = nodb();
    db.use(top);
    db.use(mid);
    db.use(bot);
  });


  describe('put', function() {
    it('sends arguments through the middleware pipeline', function() {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.put(2, 3, function() {});
      assert(top.put.calledWith(2, 3));
      assert(mid.put.calledWith(4, 1.5));
      assert(bot.put.calledWith(8, 0.75));
    });


    it('gets result from the middleware pipeline', function(done) {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.put(2, 3, function(r) {
        equal(true, r);
        done();
      });
    });
  });


  describe('del', function() {
    it('sends arguments through the middleware pipeline', function() {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.del(5, function() {});
      assert(top.del.calledWith(5));
      assert(mid.del.calledWith(20));
      assert(bot.del.calledWith(80));
    });


    it('gets result from the middleware pipeline', function(done) {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.del(5, function(x, y) {
        equal(null, x);
        equal(1, y);
        done();
      });
    });
  });


  describe('get', function() {
    it('sends arguments through the middleware pipeline', function() {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.get(5, function() {});
      assert(top.get.calledWith(5));
      assert(mid.get.calledWith(40));
      assert(bot.get.calledWith(320));
    });


    it('gets result from the middleware pipeline', function(done) {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.get(5, function(x, y) {
        equal(null, x);
        equal(900, y);
        done();
      });
    });
  });


  describe('iterator', function() {
    it('sends arguments through the middleware pipeline', function() {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.iterator(1, function() {});
      assert(top.iterator.calledWith(1));
      assert(mid.iterator.calledWith(64));
      assert(bot.iterator.calledWith(4096));
    });


    it('gets result from the middleware pipeline', function(done) {
      // callback argument wont matter because its only called by the
      // last middleware in the pipeline, which is a sinon spy
      db.iterator(1, function(x, y) {
        equal(null, x);
        equal(1, y);
        done();
      });
    });
  });
});
