var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var fileSchema = new Schema({
  name: String,
  content: String,
  userId: String
});

var File = mongoose.model('File', fileSchema);

module.exports = File;