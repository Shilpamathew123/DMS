var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var folderSchema = new Schema({
  name: String,
  userId: String,
  parentFolderId: String
});

var Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;