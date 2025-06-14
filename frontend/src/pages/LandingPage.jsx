import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrepOrbitImage from "../assets/PrepOrbit1.jpg";
import StudyImageLandingPage from "../assets/StudyImageLandingPage.png";

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const exams = ["JEE", "NEET", "GATE"];

  const handleExamClick = (exam) => {
    const path = `/exam/${exam.toLowerCase()}`;

    if (user) {
      navigate(path);
    } else {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-gray-800">

      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center space-x-3">
          <img src={PrepOrbitImage} alt="Logo" className="h-10 w-10 object-contain" />
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition">Sign Up</Link>
        </div>
      </header>

      <section className="text-center py-8 px-4 bg-white">
        <h1 className="text-xl md:text-2xl">
          Welcome to <span className="font-semibold text-blue-700">PrepOrbit</span>, a place where you can prepare for your exams in an organized way.
        </h1>
      </section>

      <section className="bg-gradient-to-r from-slate-100 via-white to-pink-100 px-4 py-4 flex justify-center space-x-6 shadow-inner">
        {exams.map((exam) => (
          <button
            key={exam}
            onClick={() => handleExamClick(exam)}
            className="text-lg font-medium hover:underline text-gray-700"
          >
            {exam}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-6 py-12 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-4">About PrepOrbit</h2>
          <p className="text-gray-600 leading-relaxed">
            PrepOrbit is your ultimate preparation companion for competitive exams like JEE, NEET, and GATE.
            We provide real exam papers, instant feedback, smart progress tracking, and a focused environment to help
            you perform your best. Join thousands of students who trust PrepOrbit for exam excellence.
          </p>
        </div>
      </section>

      <footer className="bg-slate-200 text-center py-4">
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} PrepOrbit. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
