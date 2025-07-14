// // pages/LeaderboardPage.jsx
// import { useState, useEffect } from "react";
// import API from "../utils/axios";

// function LeaderboardPage({ exam = "jee" }) {
//   const [users, setUsers] = useState([]);
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         const res = await API.get(`/leaderboard/${exam}?limit=${showAll ? 100 : 10}`);
//         setUsers(res.data);
//       } catch (err) {
//         console.error("Failed to fetch leaderboard", err);
//       }
//     };

//     fetchLeaderboard();
//   }, [exam, showAll]);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4 capitalize">{exam} Leaderboard</h2>
//       <table className="min-w-full bg-white rounded shadow overflow-hidden">
//         <thead className="bg-gray-100 text-left text-sm font-semibold">
//           <tr>
//             <th className="p-3">Rank</th>
//             <th className="p-3">Name</th>
//             <th className="p-3">Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u, idx) => (
//             <tr key={u._id} className="border-t text-sm">
//               <td className="p-3">{idx + 1}</td>
//               <td className="p-3">{u.name}</td>
//               <td className="p-3 font-semibold">{u.points[exam]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {users.length >= 10 && (
//         <button
//           onClick={() => setShowAll(prev => !prev)}
//           className="mt-4 text-blue-600 hover:underline"
//         >
//           {showAll ? "Show Top 10" : "See All"}
//         </button>
//       )}
//     </div>
//   );
// }

// export default LeaderboardPage;

import { useState, useEffect } from "react";
import API from "../utils/axios";

const exams = ["jee", "neet", "gate"];

function LeaderboardPage() {
  const [exam, setExam] = useState("jee");
  const [users, setUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/leaderboard/${exam}?limit=${showAll ? 100 : 10}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, [exam, showAll]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Tabs for Exams */}
      <div className="flex space-x-4 mb-6">
        {exams.map((e) => (
          <button
            key={e}
            onClick={() => { setExam(e); setShowAll(false); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              e === exam ? "bg-blue-600 text-white" : "bg-gray-100 text-blue-600"
            }`}
          >
            {e.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-blue-700 mb-4 capitalize">{exam} Leaderboard</h2>

      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100 text-left text-sm font-semibold">
          <tr>
            <th className="p-3">Rank</th>
            <th className="p-3">Name</th>
            <th className="p-3">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id} className="border-t text-sm">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{u.name}</td>
              <td className="p-3 font-semibold">{u.points[exam]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length >= 10 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 text-blue-600 hover:underline"
        >
          {showAll ? "Show Top 10" : "See All"}
        </button>
      )}
    </div>
  );
}

export default LeaderboardPage;
