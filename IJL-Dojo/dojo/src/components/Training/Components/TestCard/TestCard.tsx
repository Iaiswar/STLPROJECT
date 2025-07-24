import React, { useState, useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface TestCardProps {
  selectedProfile: string;
}

interface AssignedTest {
  id: number;
  operator: number;
  test: {
    id: number;
    test_name: string;
    questions_file: string;
    questions: any[];
    training_skill: number;
  };
  assigned_date: string;
}

interface QuizResult {
  id: number;
  profile: string;
  test_id: string;
  date: string;
  score: string;
  total_questions: string;
  status: string;
}

const TestCard: React.FC<TestCardProps> = ({ selectedProfile }) => {
  const [assignedTests, setAssignedTests] = useState<AssignedTest[]>([]);
  const [testResults, setTestResults] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedTests = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tests/${selectedProfile}/`);
      if (!response.ok) throw new Error("Failed to fetch assigned tests");
      const data = await response.json();
      setAssignedTests(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load assigned tests.");
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/quiz-results/profile/${selectedProfile}/`);
      if (!response.ok) throw new Error("Failed to fetch test results");
      const profileResults: QuizResult[] = await response.json();

      const resultsMap: Record<number, string> = {};
      profileResults.forEach(result => {
        const testIdNum = parseInt(result.test_id, 10);
        if (!isNaN(testIdNum)) {
          resultsMap[testIdNum] = result.status;
        }
      });

      setTestResults(resultsMap);
    } catch (err) {
      console.error(err);
      setError("Failed to load test results.");
    }
  };

  useEffect(() => {
    fetchAssignedTests();
    fetchTestResults();
  }, [selectedProfile]);

  const handleStartTest = (testId: number) => {
    window.open(`/mcqquiz?profile=${selectedProfile}&testId=${testId}`, "_blank");
  };

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="flex-1 min-w-[250px] p-5 rounded-lg shadow-md text-center bg-white">
      <h2 className="text-lg mb-4 text-[#16163e]">Form Submission for {selectedProfile}</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="max-h-[300px] overflow-y-auto flex flex-col gap-4">
        {assignedTests.map(({ id, test }) => (
          <div key={id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleViewPdf(test.questions_file)}
            >
              <FaFileAlt className="text-2xl text-blue-500" />
              <span className="text-base">{test.test_name}</span>
            </div>

            {loading ? (
              <span>Loading...</span>
            ) : testResults[test.id] ? (
              <div className="flex items-center">
                {testResults[test.id] === "Passed" ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-red-600 mr-2" />
                )}
                <span>{testResults[test.id]}</span>
              </div>
            ) : (
              <button
                className="py-2 px-3 border-none bg-blue-500 text-white cursor-pointer rounded transition-colors duration-300 hover:bg-blue-700"
                onClick={() => handleStartTest(test.id)}
              >
                Start Test
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCard;
