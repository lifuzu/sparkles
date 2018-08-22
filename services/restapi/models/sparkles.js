var r = require('rethinkdb');
var util = require('util');
var assert = require('assert');
var debug = require('debug')('restapi:models');

// RethinkDB database settings. Defaults can be overridden using environment variables.
var dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db  : process.env.RDB_DB || 'sparkles',
  tables: {
    'sparkles': 'id',
    'cache': 'cid',
    'users': 'id'
  }
};

/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the `RDB_DB` database (defaults to `sparkles`)
 * - create tables `sparkles`, `cache`, `users` in this database
 */
module.exports.setup = function() {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function (err, connection) {
    assert.ok(err === null, err);
    r.dbCreate(dbConfig.db).run(connection, function(err, result) {
      if(err) {
        debug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbConfig.db, err.name, err.msg, err.message);
      } else {
        debug("[INFO ] RethinkDB database '%s' created", dbConfig.db);
      }

      for(var tbl in dbConfig.tables) {
        (function (tableName) {
          r.db(dbConfig.db).tableCreate(tableName, {primaryKey: dbConfig.tables[tbl]}).run(connection, function(err, result) {
            if(err) {
              debug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
            } else {
              debug("[INFO ] RethinkDB table '%s' created", tableName);
            }
          });
        })(tbl);
      }
    });
  });
};

/**
 * To save a new sparkle message using we are using
 * [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * An `insert` op returns an object specifying the number
 * of successfully created objects and their corresponding IDs:
 *
 * ```
 * {
 *   "inserted": 1,
 *   "errors": 0,
 *   "generated_keys": [
 *     "b3426201-9992-ab84-4a21-576719746036"
 *   ]
 * }
 * ```
 *
 * @param {Object} msg
 *    The sparkle to be saved
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.saveSparkle = function (msg, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('sparkles').insert(msg).run(connection, function(err, result) {
      if(err) {
        debug("[ERROR][%s][saveSparkle] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      } else {
        if(result.inserted === 1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
};

// #### Retrieving sparkle messages

/**
 * To find the last `max_results` messages ordered by `timestamp`,
 * we are using [`table`](http://www.rethinkdb.com/api/javascript/table/) to access
 * messages in the table, then we
 * [`orderBy`](http://www.rethinkdb.com/api/javascript/order_by/) `timestamp`
 * and instruct the server to return only `max_results` using
 * [`limit`](http://www.rethinkdb.com/api/javascript/limit/).
 *
 * These operations are chained together and executed on the database. Results
 * are collected with [`toArray`](http://www.rethinkdb.com/api/javascript/toArray)
 * and passed as an array to the callback function.
 *
 *
 * @param {Number} max_results
 *    Maximum number of results to be retrieved from the db
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Array} an array of sparkle messages
 */
module.exports.findSparkles = function (max_results, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('sparkles').orderBy(r.desc('timestamp')).limit(max_results).run(connection, function(err, cursor) {
      if(err) {
        debug("[ERROR][%s][findSparkles] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(null, []);
        connection.close();
      } else {
        cursor.toArray(function(err, results) {
          if(err) {
            debug("[ERROR][%s][findSparkles][toArray] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, []);
          }
          else {
            callback(null, results);
          }
          connection.close();
        });
      }
    });
  });
};


// #### Helper functions

/**
 * A wrapper function for the RethinkDB API `r.connect`
 * to keep the configuration details in a single function
 * and fail fast in case of a connection error.
 */
function onConnect(callback) {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function(err, connection) {
    assert.ok(err === null, err);
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}

// #### Connection management
//
// This application uses a new connection for each query needed to serve
// a user request. In case generating the response would require multiple
// queries, the same connection should be used for all queries.
//
// Example:
//
//     onConnect(function (err, connection)) {
//         if(err) { return callback(err); }
//
//         query1.run(connection, callback);
//         query2.run(connection, callback);
//     }
//