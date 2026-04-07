const axios = require("axios");

const JUDGE0_URL = "https://ce.judge0.com"; // ✅ FREE OFFICIAL Judge0

const LANGUAGE_MAP = {
  cpp: 54,
  java: 62,
  python: 71
};

const submitBatch = async (submissions) => {
  const res = await axios.post(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`,
    { submissions },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

const getResults = async (tokens) => {
  const res = await axios.get(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data.submissions;
};

module.exports = {
  submitBatch,
  getResults,
  LANGUAGE_MAP
};
