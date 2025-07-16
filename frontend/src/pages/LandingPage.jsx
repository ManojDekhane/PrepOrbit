import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudyImageLandingPage from "../assets/StudyImageLandingPage.png";
import jeeimage from "../assets/examimage/jee.jpeg";
import neetimage from "../assets/examimage/neet.webp";
import gateimage from "../assets/examimage/GATE.jpg";
import CardItem from "../components/card"; 
import "../index.css";

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const exams = [
    { name: "JEE", image: jeeimage },
    { name: "NEET", image: neetimage },
    { name: "GATE", image: gateimage },
  ];

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
      {/* Welcome Section */}
      <section className="text-center py-10 px-4 bg-white shadow-inner">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to <span className="text-blue-700">PrepOrbit</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          A place where your preparation journey becomes focused, organized, and impactful. Unlock your potential today!
        </p>
      </section>

      {/* Exam Cards Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-9">Choose Your Exam</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
          {exams.map((exam) => (
            <CardItem
              key={exam.name}
              title={exam.name}
              imageSrc={exam.image}
              onClick={() => handleExamClick(exam.name)}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 py-16 max-w-7xl mx-auto bg-white rounded-lg shadow mt-8">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-blue-800">About PrepOrbit</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            PrepOrbit is your ultimate preparation companion for competitive exams like <strong>JEE, NEET, and GATE</strong>.
            We provide real exam papers, instant feedback, smart progress tracking, and a focused environment to help
            you perform your best. Join thousands of students who trust PrepOrbit for exam excellence.
          </p>
        </div>
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
