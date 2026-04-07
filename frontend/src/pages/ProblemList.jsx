import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/problems")
      .then(res => res.json())
      .then(data => setProblems(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Problem List
        </h2>
        <p className="text-gray-600 mt-1">
          Choose a problem and start coding 🚀
        </p>
      </div>

      {/* PROBLEM LIST */}
      <div className="max-w-5xl mx-auto space-y-4">
        {problems.map((p, index) => (
          <div
            key={p._id}
            onClick={() => navigate(`/problems/${p._id}`)}
            className="bg-white p-5 rounded-lg border border-gray-200 cursor-pointer
                       hover:shadow-md hover:border-blue-400 transition-all"
          >
            <div className="flex items-start gap-4">
              
              {/* INDEX */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                              bg-blue-100 text-blue-700 rounded-full font-semibold">
                {index + 1}
              </div>

              {/* CONTENT */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {problems.length === 0 && (
          <p className="text-center text-gray-500">
            No problems available
          </p>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
