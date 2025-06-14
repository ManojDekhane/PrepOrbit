import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";

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
        alert("Failed to load papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [exam, year]);

  const handlePaperClick = (paperCode) => {
    navigate(`/exam/${exam}/${year}/${paperCode}`);
  };

  if (loading) return <div className="p-6">Loading papers...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {exam.toUpperCase()} {year} - Select Paper
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {papers.map((p) => (
          <button
            key={p}
            onClick={() => handlePaperClick(p)}
            className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded"
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PaperListPage;
