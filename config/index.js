/*
 * A file for rendering configuration values.
 */

var confJson = require("./config");

process.env.HTTP_PORT || '3000'

var config = {
    httpsEnabled : confJson.enable_https,
    viewEngine : confJson.view_engine,
    getDbCon: function() {
      var con = (process.env.DB_DIALECT || confJson.db.dialect) + "://" 
        + (process.env.DB_USER || confJson.db.user) + ":" 
        + (process.env.DB_PASS || confJson.db.pass) + "@" 
        + (process.env.DB_HOST || confJson.db.host) + "/" 
        + (process.env.DB_DATABASE || confJson.db.database);
      return con;
    }
};

module.exports = config;