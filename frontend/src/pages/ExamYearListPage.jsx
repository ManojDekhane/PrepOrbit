import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";
import CardItem from "../components/card";


import jee2020 from "../assets/year/jee-2020.jpg";
import neet2022 from "../assets/year/neet-2022.webp";
import gate2022 from "../assets/year/gate-2022.jpg";

const imageMap = {
  "jee-2020": jee2020,
  "neet-2022": neet2022,
  "gate-2022": gate2022,
};

function ExamYearListPage() {
  const { exam } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await API.get(`/meta/${exam}/years`);
        setYears(res.data.years || []);
      } catch (err) {
        console.error("Failed to fetch years", err);
        alert("Failed to load years");
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [exam]);

  const handleYearClick = (year) => {
    navigate(`/exam/${exam}/${year}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg animate-pulse">
        ⏳ Loading years...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {exam.toUpperCase()} - Choose a Year
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {years.map((year) => {
          const key = `${exam.toLowerCase()}-${year}`;
          const imgSrc = imageMap[key] || "/fallback-year.jpg"; // Add fallback image in /public
          return (
            <CardItem
              key={year}
              title={year}             
              imageSrc={imgSrc}
              onClick={() => handleYearClick(year)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExamYearListPage;
