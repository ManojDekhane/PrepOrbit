const express = require("express");
const router = express.Router();
const {fetchQuestionsByExamAndYear} = require("../controllers/questionController");
const verifyToken = require("../middleware/authMiddleWare");

router.get("/:exam/:year/:paperCode", verifyToken, fetchQuestionsByExamAndYear);

module.exports = router;