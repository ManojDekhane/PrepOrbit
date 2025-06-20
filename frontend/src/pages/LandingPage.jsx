import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrepOrbitImage from "../assets/PrepOrbit1.jpg";
import StudyImageLandingPage from "../assets/StudyImageLandingPage.png";
import "../index.css";

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
      {/* Header */}
      {/* <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src={PrepOrbitImage} alt="Logo" className="h-12 w-12 object-contain rounded-full" />
          <span className="text-xl font-bold text-blue-700 tracking-wide">PrepOrbit</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow">
            Sign Up
          </Link>
        </div>
      </header> */}

      {/* Welcome Section */}
      <section className="text-center py-10 px-4 bg-white shadow-inner">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to <span className="text-blue-700">PrepOrbit</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          A place where your preparation journey becomes focused, organized, and impactful. Unlock your potential today!
        </p>
      </section>

      {/* Exam Navigation */}
      <section className="bg-gradient-to-r from-slate-100 via-white to-pink-100 px-4 py-6 flex justify-center gap-8 shadow-inner">
        {exams.map((exam) => (
          <button
            key={exam}
            onClick={() => handleExamClick(exam)}
            className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            {exam}
          </button>
        ))}
      </section>

      {/* About Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 py-16 max-w-7xl mx-auto bg-white rounded-lg shadow mt-8">
        {/* Left: Text */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-blue-800">About PrepOrbit</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            PrepOrbit is your ultimate preparation companion for competitive exams like <strong>JEE, NEET, and GATE</strong>.
            We provide real exam papers, instant feedback, smart progress tracking, and a focused environment to help
            you perform your best. Join thousands of students who trust PrepOrbit for exam excellence.
          </p>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center">
          <img
            src={StudyImageLandingPage}
            alt="Study Illustration"
            className="w-full max-w-md object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-200 text-center py-6 mt-12">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold">PrepOrbit</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
