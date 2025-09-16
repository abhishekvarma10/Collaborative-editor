// server/Document.js
const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
  _id: String,
  data: Object,
  title: {
    type: String,
    default: "Untitled Document"
  }
});

module.exports = model("Document", DocumentSchema);