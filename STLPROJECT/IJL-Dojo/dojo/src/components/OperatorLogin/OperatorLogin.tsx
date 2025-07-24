import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOperatorData } from './Slice/OperatorLoginSlice';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const OperatorLogin: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize navigate

  const handleLogin = async () => {
    if (!employeeCode || !password) {
      alert('Please enter both employee code and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/operator_login/', {
        employee_code: employeeCode,
        password: password,
      });
      console.log('Login Response:', res.data);
      alert(`Welcome ${res.data.operator_name}!`);

      // Dispatching operator data to Redux
      dispatch(setOperatorData({
        operatorName: res.data.operator_name,
        sessionId: res.data.session_id,
        employeeCode: res.data.employee_code,  // Include employeeCode here
      }));

      // Redirect to OperatorDashboard after successful login
      navigate('/operatordashboard');  // Navigate to the OperatorDashboard page

      // Reset fields
      setEmployeeCode('');
      setPassword('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Operator Login</h1>

        <p className="text-sm text-gray-500 text-center mb-8">Please enter your credentials to continue</p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Employee Code"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default OperatorLogin;
