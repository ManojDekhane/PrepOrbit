// Build full source code with wrapper
exports.buildSourceCode = (problem, userCode, language) => {
  if (!problem.wrapperCode || !problem.wrapperCode[language]) return userCode;
  return problem.wrapperCode[language].replace("{{USER_CODE}}", userCode);
};
