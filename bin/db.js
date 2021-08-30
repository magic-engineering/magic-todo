const path = require("path");
const JSONdb = require('simple-json-db');
const db = new JSONdb(path.join(__dirname, "db.json"));

module.exports = db;