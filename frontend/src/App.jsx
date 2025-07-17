import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from "./components/PrivateRoute";
import ExamPage from './pages/ExamPage';
import MyAttemptsPage from './pages/MyAttemptsPage';
import ResultSummaryPage from './pages/ResultSummaryPage';
import AdminQuestionUpload from './pages/AdminQuestionUpload';
import PaperListPage from './pages/PaperListPage';
import ExamYearListPage from './pages/ExamYearListPage';
import Layout from "./pages/layout";
import LeaderboardPage from './pages/LeaderBoardPage';
import PrepBotChat from './components/PrepBotChat';
import Chatbot from "../src/components/chatbot";
import FeedbackPage from './pages/feedback';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/prepbot" element={<PrepBotChat />} />


          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exam/:exam"
            element={
              <PrivateRoute>
                <ExamYearListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exam/:exam/:year"
            element={
              <PrivateRoute>
                <PaperListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exam/:exam/:year/:paperCode"
            element={
              <PrivateRoute>
                <ExamPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-attempts"
            element={
              <PrivateRoute>
                <MyAttemptsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/results/:exam/:year"
            element={
              <PrivateRoute>
                <ResultSummaryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <PrivateRoute>
                <AdminQuestionUpload />
              </PrivateRoute>
            }
          />
          <Route
            path='/leaderboard'
            element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            }
          />
           <Route
            path='/feedback'
            element={
              <PrivateRoute>
                <FeedbackPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
     <Chatbot/>
    </BrowserRouter>
  );
}

export default App;
