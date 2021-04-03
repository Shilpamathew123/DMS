/*
 * A file for rendering configuration values.
 */

var confJson = require("./config");

var config = {
    httpsEnabled : confJson.enable_https,
    viewEngine : confJson.view_engine,
    getDbCon: function() {
      var con = confJson.db.dialect + "://" 
        + confJson.db.user + ":" 
        + confJson.db.pass + "@" 
        + confJson.db.host + "/" 
        + confJson.db.database;
      return con;
    }
};

module.exports = config;