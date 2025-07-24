import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "../../../../store/store";
import { useNavigate } from "react-router-dom";


interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  test: number;
}

interface Test {
  id: number;
  test_name: string;
  questions: Question[];
}

interface OperatorTest {
  id: number;
  test: Test;
}

const OperatorTestsViewer: React.FC = () => {
  const operator = useSelector((state: RootState) => state.operatorLoginData);
  const [tests, setTests] = useState<OperatorTest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!operator?.sessionId) return;

    axios
      .get("http://127.0.0.1:8000/operator/tests/", {
        headers: { "Session-Id": operator.sessionId },
      })
      .then((res) => {
        const uniqueTests = deduplicateByTestId(res.data.results || res.data);
        setTests(uniqueTests);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch operator tests:", err);
        setLoading(false);
      });
  }, [operator?.sessionId]);

  const deduplicateByTestId = (data: OperatorTest[]): OperatorTest[] => {
    const seen = new Set();
    return data.filter((item) => {
      const isNew = !seen.has(item.test.id);
      seen.add(item.test.id);
      return isNew;
    });
  };

  const handleStartTest = (testId: number) => {
    console.log("Test ID:", testId); // 👈 Print test ID
      navigate(`/questionsList?testId=${testId}`);
    // window.open(`/mcqquiz?profile=${operator.id}&testId=${testId}`, "_blank");
  };

  if (loading) return <div className="p-4">Loading tests...</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Available Tests</h2>

      {tests.length === 0 ? (
        <p className="text-gray-500">No tests assigned.</p>
      ) : (
        <div className="space-y-4">
          {tests.map((item) => (
            <div
              key={item.test.id}
              className="flex justify-between items-center border p-4 rounded bg-gray-50"
            >
              <span className="font-medium text-blue-800">
                {item.test.test_name}
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                onClick={() => handleStartTest(item.test.id)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperatorTestsViewer;
