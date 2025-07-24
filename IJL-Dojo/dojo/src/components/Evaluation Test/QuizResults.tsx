// import React, { useEffect, useState } from 'react';
// import { ChevronDown, Users, Trophy, TrendingUp, Clock, Award, CheckCircle, XCircle, Search } from 'lucide-react';

// interface Entry {
//   employee_id: number;
//   name: string;
//   section: string;
//   skill: string;
//   marks: number;
//   percentage: number;
// }

// const QuizResults: React.FC = () => {
//   const [sessions, setSessions] = useState<string[]>([]);
//   const [selectedSession, setSelectedSession] = useState<string>('');
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loadingSessions, setLoadingSessions] = useState(true);
//   const [loadingScores, setLoadingScores] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm,setSearchTerm] = useState('')

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/past-sessions/')
//       .then(res => res.json())
//       .then(data => {
//         const reversed = [...data].reverse();
//         setSessions(reversed);
//         if (reversed.length) setSelectedSession(reversed[0]);
//       })
//       .catch(() => setError('Failed to load sessions.'))
//       .finally(() => setLoadingSessions(false));
//   }, []);

//   useEffect(() => {
//     if (!selectedSession) return;
//     setLoadingScores(true);
//     setError(null);

//     fetch(`http://127.0.0.1:8000/api/scores-by-session/${encodeURIComponent(selectedSession)}/`)
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to fetch scores.');
//         return res.json();
//       })
//       .then(data => {
//         const sorted = [...data].sort((a, b) => b.marks - a.marks);
//         setEntries(sorted);
//       })
//       .catch(() => setError('Failed to load scores for selected session.'))
//       .finally(() => setLoadingScores(false));
//   }, [selectedSession]);

//   // Calculate stats
//   const totalParticipants = entries.length;
//   const passedCount = entries.filter(e => e.percentage >= 80).length;
//   const averageMarks = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.marks, 0) / entries.length) : 0;
//   const topPerformer = entries.length > 0 ? entries[0] : null;

//   const filteredEntries = entries.filter(e =>
//   e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   e.employee_id.toString().includes(searchTerm)
// );


//   if (loadingSessions) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
//           <div className="flex flex-col items-center space-y-6">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//               <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
//             </div>
//             <div className="text-center">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Sessions</h3>
//               <p className="text-gray-600">Please wait while we fetch your data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
//                 <Trophy className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   Quiz Results Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-1">Track performance and analyze results</p>
//               </div>
//           </div>
//         </div>
//       </div>
//     </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Session Selection */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
//             <div className="flex items-center space-x-3">
//               <Clock className="w-6 h-6 text-blue-600" />
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Session Selection</h3>
//                 <p className="text-sm text-gray-600">Choose a quiz session to view results</p>
//               </div>
//             </div>
//             <div className="relative">
//               <select
//                 className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:shadow-lg transition-all min-w-[250px]"
//                 value={selectedSession}
//                 onChange={e => setSelectedSession(e.target.value)}
//               >
//                 {sessions.map(s => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         {entries.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Participants</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">{totalParticipants}</p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-xl">
//                   <Users className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pass Rate</p>
//                   <p className="text-3xl font-bold text-green-600 mt-1">{((passedCount / totalParticipants) * 100).toFixed(1)}%</p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-xl">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Average Score</p>
//                   <p className="text-3xl font-bold text-purple-600 mt-1">{averageMarks.toFixed(1)}</p>
//                 </div>
//                 <div className="bg-purple-100 p-3 rounded-xl">
//                   <TrendingUp className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Top Score</p>
//                   <p className="text-3xl font-bold text-yellow-600 mt-1">{topPerformer?.marks}</p>
//                 </div>
//                 <div className="bg-yellow-100 p-3 rounded-xl">
//                   <Award className="w-6 h-6 text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Section */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
//           <div className="px-8 py-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
//                   <Trophy className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     Results for <span className="text-blue-600">{selectedSession}</span>
//                   </h2>
//                   <p className="text-gray-600 mt-1">Detailed performance breakdown</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search employees..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={searchTerm}
//                     onChange={(e)=>setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
//                 <div className="flex items-center space-x-3">
//                   <XCircle className="w-6 h-6 text-red-500" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//                     <p className="text-red-600 mt-1">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {loadingScores ? (
//               <div className="flex items-center justify-center py-16">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//                   </div>
//                   <p className="text-gray-600 font-medium">Loading scores...</p>
//                 </div>
//               </div>
//             ) : entries.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
//                 <p className="text-gray-600">No entries available for the selected session.</p>
//               </div>
//             ) : (
//               <div className="overflow-hidden rounded-xl border border-gray-200">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full">
//                     <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           <div className="flex items-center space-x-2">
//                             <span>Rank</span>
//                           </div>
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Section</th>
//                         {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Level</th> */}
//                         {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Skill</th> */}
//                         <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Score</th>
//                         {/* <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Percentage</th> */}
//                         <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Result</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredEntries.map((e, i) => {
//                         const passed = e.percentage >= 80;
//                         const isTopPerformer = i === 0;
//                         const isTop3 = i < 3;
                        
//                         return (
//                           <tr key={i} className={`hover:bg-blue-50 transition-all duration-200 ${isTopPerformer ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center space-x-2">
//                                 {isTop3 && (
//                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
//                                     i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-yellow-600'
//                                   }`}>
//                                     {i + 1}
//                                   </div>
//                                 )}
//                                 {!isTop3 && (
//                                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
//                                     {i + 1}
//                                   </div>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center space-x-3">
//                                 <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                   {e.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-semibold text-gray-900">{e.name}</div>
//                                   <div className="text-sm text-gray-500">ID: {e.employee_id}</div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                 {e.section}
//                               </span>
//                             </td>
//                             {/* <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                                 {e.level_name}
//                               </span>
//                             </td> */}
//                             {/* <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                                 {e.skill}
//                               </span>
//                             </td> */}
//                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <div className="text-lg font-bold text-gray-900">{e.marks}</div>
//                             </td>
//                             {/* <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <div className="flex items-center justify-center">
//                                 <div className="text-lg font-bold text-gray-900">{e.percentage.toFixed(1)}%</div>
//                               </div>
//                             </td> */}
//                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
//                                 passed 
//                                   ? 'bg-green-100 text-green-800 border border-green-200' 
//                                   : 'bg-red-100 text-red-800 border border-red-200'
//                               }`}>
//                                 {passed ? (
//                                   <>
//                                     <CheckCircle className="w-4 h-4 mr-1" />
//                                     Pass
//                                   </>
//                                 ) : (
//                                   <>
//                                     <XCircle className="w-4 h-4 mr-1" />
//                                     Fail
//                                   </>
//                                 )}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;

import React, { useEffect, useState } from 'react';
import { ChevronDown, Users, Trophy, TrendingUp, Clock, Award, CheckCircle, XCircle, Search } from 'lucide-react';
import Nav from '../HomeNav/nav';

interface Entry {
  employee_id: number;
  name: string;
  section: string;
  skill: string;
  skill_name?: string;
  level_number?: number | string;
  level_name?: string;
  marks: number;
  percentage: number;
  passed?: boolean;
}

const QuizResults: React.FC = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  
  
  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/past-sessions/')
      .then(res => res.json())
      .then(data => {
        const reversed = [...data].reverse();
        setSessions(reversed);
        if (reversed.length) setSelectedSession(reversed[0]);
      })
      .catch(() => setError('Failed to load sessions.'))
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    setLoadingScores(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/api/scores-by-session/${encodeURIComponent(selectedSession)}/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch scores.');
        return res.json();
      })
      .then(data => {
        const sorted = [...data].sort((a, b) => b.marks - a.marks);
        setEntries(sorted);
      })
      .catch(() => setError('Failed to load scores for selected session.'))
      .finally(() => setLoadingScores(false));
  }, [selectedSession]);

  // Calculate stats
  const totalParticipants = entries.length;
  const passedCount = entries.filter(e => e.percentage >= 80).length;
  const averageMarks = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.marks, 0) / entries.length) : 0;
  const topPerformer = entries.length > 0 ? entries[0] : null;

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.employee_id.toString().includes(searchTerm);

    const matchesLevel = selectedLevel === '' ||
                        (e.level_number && e.level_number.toString() === selectedLevel) ||
                        (e.level_name && e.level_name.includes(selectedLevel));

    const matchesSkill = selectedSkill === '' ||
                        (e.skill_name && e.skill_name.toLowerCase().includes(selectedSkill.toLowerCase())) ||
                        (e.skill && e.skill.toLowerCase().includes(selectedSkill.toLowerCase()));

    return matchesSearch && matchesLevel && matchesSkill;
  });

  // Get unique levels and skills for filter options
  const uniqueLevels = [...new Set(entries.map(e => e.level_number || e.level_name).filter(Boolean))];
  const uniqueSkills = [...new Set(entries.map(e => e.skill_name || e.skill).filter(Boolean))];


  if (loadingSessions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Sessions</h3>
              <p className="text-gray-600">Please wait while we fetch your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <><Nav />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-10">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Quiz Results Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Track performance and analyze results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Session Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Session Selection</h3>
                <p className="text-sm text-gray-600">Choose a quiz session to view results</p>
              </div>
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:shadow-lg transition-all min-w-[250px]"
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
              >
                {sessions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalParticipants}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{((passedCount / totalParticipants) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{averageMarks.toFixed(1)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Score</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{topPerformer?.marks}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Results for <span className="text-blue-600">{selectedSession}</span>
                  </h2>
                  <p className="text-gray-600 mt-1">Detailed performance breakdown</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {/* Level Filter */}
                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Levels</option>
                    {uniqueLevels.map((level, index) => (
                      <option key={index} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill Filter */}
                <div className="relative">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Skills</option>
                    {uniqueSkills.map((skill, index) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loadingScores ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  </div>
                  <p className="text-gray-600 font-medium">Loading scores...</p>
                </div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600">No entries available for the selected session.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <span>Rank</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Section</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Skill</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEntries.map((e, i) => {
                        const passed = e.percentage >= 80;
                        const isTopPerformer = i === 0;
                        const isTop3 = i < 3;

                        return (
                          <tr key={i} className={`hover:bg-blue-50 transition-all duration-200 ${isTopPerformer ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {isTop3 && (
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-yellow-600'}`}>
                                    {i + 1}
                                  </div>
                                )}
                                {!isTop3 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                                    {i + 1}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {e.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{e.name}</div>
                                  <div className="text-sm text-gray-500">ID: {e.employee_id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {e.section}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {e.skill_name || e.skill || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {e.level_number !== undefined && e.level_number !== null
                                  ? String(e.level_number)
                                  : e.level_name
                                    ? e.level_name.replace('Level ', '')
                                    : 'N/A'
                                }
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-lg font-bold text-gray-900">{e.marks}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center">
                                <div className="text-lg font-bold text-gray-900">{e.percentage.toFixed(1)}%</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${passed
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                {passed ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Pass
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Fail
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default QuizResults;