import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";

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
            <div className="p-6 text-center text-gray-600">
                ⏳ Loading years...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {exam.toUpperCase()} - Select Year
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {years.map((year) => (
                    <button
                        key={year}
                        onClick={() => handleYearClick(year)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-3 rounded-lg shadow transition"
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ExamYearListPage;
