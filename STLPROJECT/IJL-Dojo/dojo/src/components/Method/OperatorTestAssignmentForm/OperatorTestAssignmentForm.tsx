import React, { useEffect, useState } from "react";
import axios from "axios";

interface Operator {
  id: number;
  name: string;
}

interface Test {
  id: number;
  test_name: string;
}

const AssignTestsForm: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [opRes, testRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/operators/"),
        axios.get("http://127.0.0.1:8000/tests/"),
      ]);
      setOperators(opRes.data);
      setTests(testRes.data);
      console.log(testRes)
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperator || selectedTests.length === 0) {
      setMessage("Please select both an operator and at least one test.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/test-assignments/", {
        operator: selectedOperator,
        tests: selectedTests,
      });
      setMessage(response.data.message || "Tests assigned successfully.");
    } catch (error: any) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Failed to assign tests.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (testId: number) => {
    setSelectedTests(prev =>
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Assign Tests to Operator</h2>

      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Operator</label>
          <select
            value={selectedOperator ?? ""}
            onChange={(e) => setSelectedOperator(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">-- Choose an Operator --</option>
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Tests</label>
          <div className="flex flex-wrap gap-2">
            {tests.map(test => (
              <label key={test.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => handleTestSelect(test.id)}
                />
                <span className="text-sm">{test.test_name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600  text-white rounded hover:bg-green-700 text-sm"
        >
          {loading ? "Assigning..." : "Assign Tests"}
        </button>
      </form>
    </div>
  );
};

export default AssignTestsForm;
