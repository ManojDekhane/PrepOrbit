const Problem = require("../models/Problem");
const { buildSourceCode } = require("../utils/buildSourceCode");
const { submitBatch, getResults, LANGUAGE_MAP } = require("../utils/judge0");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.runCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (!Array.isArray(problem.publicTestCases)) {
      return res.status(400).json({ error: "Test cases not found" });
    }

    const languageId = LANGUAGE_MAP[language];
    if (!languageId) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const finalCode = buildSourceCode(problem, code, language);

    const submissions = problem.publicTestCases.map(tc => ({
      language_id: languageId,
      source_code: finalCode,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitRes = await submitBatch(submissions);
    const tokens = submitRes.map(s => s.token);

    await sleep(5000);

    const resultsRaw = await getResults(tokens);

    const results = resultsRaw.map((r, i) => {
      const output = (r.stdout || r.stderr || r.compile_output || "").trim();
      const expected = problem.publicTestCases[i].output.trim();

      return {
        input: problem.publicTestCases[i].input,
        output,
        expected,
        status: output === expected ? "Passed" : "Failed"
      };
    });

    res.json({ results });

  } catch (err) {
    console.error("RunCode Error:", err);
    res.status(500).json({ error: err.message });
  }
};
