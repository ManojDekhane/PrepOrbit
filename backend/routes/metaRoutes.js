const express = require("express");
const router = express.Router();
const { getAvailableYears, getPapersForYear } = require("../controllers/metaController");
const verifyToken = require("../middleware/authMiddleWare");

router.get("/:exam/years", verifyToken, getAvailableYears);
router.get("/:exam/:year/papers", verifyToken, getPapersForYear);

module.exports = router;