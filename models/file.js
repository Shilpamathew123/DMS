var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var fileSchema = new Schema({
  name: String,
  folderId: String,
  userId: String,
  content: String
});

var File = mongoose.model('File', fileSchema);

module.exports = File;