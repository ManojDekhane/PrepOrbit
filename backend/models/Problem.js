const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String
});

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  publicTestCases: [testCaseSchema],
  starterCode: {
    java: String,
    cpp: String,
    python: String
  },
  wrapperCode: {
    java: String,
    cpp: String,
    python: String
  }
});

module.exports = mongoose.model("Problem", problemSchema);
