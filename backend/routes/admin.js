const express = require("express");
const { uploadQuestions } = require("../controllers/adminController");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleWare");

router.post("/add-questions", verifyToken, uploadQuestions);

module.exports = router;