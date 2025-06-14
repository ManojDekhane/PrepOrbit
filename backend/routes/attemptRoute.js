const express = require("express");
const router = express.Router();
const {saveAttempt} = require("../controllers/attemptController");
const verifyToken = require("../middleware/authMiddleWare");
const { getMyAttempts } = require("../controllers/attemptController");

router.post("/save", verifyToken, saveAttempt);
router.get("/my", verifyToken, getMyAttempts);

module.exports = router;