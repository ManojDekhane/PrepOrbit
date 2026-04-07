import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { label: "C++", value: "cpp", monaco: "cpp" },
  { label: "Java", value: "java", monaco: "java" },
  { label: "Python", value: "python", monaco: "python" }
];

const CodeRunner = () => {
  const { id } = useParams();
  const containerRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editorHeight, setEditorHeight] = useState(60); 

  useEffect(() => {
    fetch(`http://localhost:5000/api/problems/${id}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setCode(data.starterCode?.[language] || "");
      });
  }, [id, language]);

  const runCode = async () => {
    setLoading(true);
    setResults([]);
    setError("");

    const res = await fetch("http://localhost:5000/api/code/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: id, code, language })
    });

    const data = await res.json();
    if (!res.ok) setError(data.error || "Execution error");
    else setResults(data.results);

    setLoading(false);
  };

  // DRAG LOGIC
  const startDrag = (e) => {
    const startY = e.clientY;
    const startHeight = editorHeight;

    const onMove = (moveEvent) => {
      const delta = moveEvent.clientY - startY;
      const containerHeight = containerRef.current.offsetHeight;
      const newHeight =
        startHeight + (delta / containerHeight) * 100;

      setEditorHeight(Math.min(85, Math.max(25, newHeight)));
    };

    const stopMove = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", stopMove);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", stopMove);
  };

  if (!problem) return <p className="p-6">Loading...</p>;

  return (
    <div className="grid grid-cols-[35%_65%] h-screen bg-gray-100">
      
      {/* LEFT PANEL */}
      <div className="p-6 bg-white border-r overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-2">{problem.title}</h2>
        <p className="text-gray-600 mb-4">{problem.description}</p>

        <h3 className="font-semibold mb-2">Test Cases</h3>
        {problem.publicTestCases.map((tc, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded mb-2">
            <p className="text-sm font-medium">Input</p>
            <pre className="bg-white p-2 rounded mb-1">{tc.input}</pre>
            <p className="text-sm font-medium">Output</p>
            <pre className="bg-white p-2 rounded">{tc.output}</pre>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="p-4 flex flex-col" ref={containerRef}>
        
        {/* TOOLBAR */}
        <div className="flex justify-between items-center mb-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Running..." : "Run"}
          </button>
        </div>

        {/* EDITOR */}
        <div
          style={{ height: `${editorHeight}%` }}
          className="border rounded overflow-hidden"
        >
          <Editor
            height="100%"
            language={LANGUAGES.find(l => l.value === language).monaco}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{ minimap: { enabled: false } }}
          />
        </div>

        {/* DRAG HANDLE */}
        <div
          onMouseDown={startDrag}
          className="h-2 bg-gray-300 cursor-row-resize my-1 rounded"
        />

        {/* OUTPUT */}
        <div className="flex-1 overflow-y-auto bg-white border rounded p-3">
          <h3 className="font-semibold mb-2">Output</h3>

          {error && <p className="text-red-600">{error}</p>}

          {results.map((r, i) => (
            <div
              key={i}
              className={`p-3 mb-2 rounded border-l-4 ${
                r.status === "Passed"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <p className="font-medium">
                Test Case {i + 1}: {r.status}
              </p>
              <pre className="text-sm mt-1">Output: {r.output}</pre>
              <pre className="text-sm">Expected: {r.expected}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;
