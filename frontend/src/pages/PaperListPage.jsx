import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";
import CardItem from "../components/card";
import paperimage from "../assets/year/paper.avif";

function PaperListPage() {
  const { exam, year } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await API.get(`/meta/${exam}/${year}/papers`);
        setPapers(res.data.paperCodes || []);
      } catch (err) {
        console.error("Failed to fetch papers", err);
        alert("Failed to load papers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [exam, year]);

  const handlePaperClick = (paperCode) => {
    navigate(`/exam/${exam}/${year}/${paperCode}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg text-blue-600 animate-pulse">
        ⏳ Loading papers...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        {exam.toUpperCase()} {year} – Choose a Paper
      </h2>

      {papers.length === 0 ? (
        <p className="text-gray-600 bg-white p-4 rounded shadow text-center">
          No papers found for this exam/year.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {papers.map((paperCode) => (
            <CardItem
              key={paperCode}
              title={paperCode.toUpperCase()}            
              imageSrc={paperimage}
              onClick={() => handlePaperClick(paperCode)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PaperListPage;
