const express = require("express");
const Problem = require("../models/Problem");

const router = express.Router();

/* Get all problems (list page) */
router.get("/", async (req, res) => {
  const problems = await Problem.find({}, "title description");
  res.json(problems);
});

/* Get single problem (editor page) */
router.get("/:id", async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  res.json(problem);
});

module.exports = router;
