import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, CheckCircle, AlertCircle } from 'lucide-react';

const LoanForm = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/loans', {
        ...formData,
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseInt(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
      });

      setResult(response.data);
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Create New Loan</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer ID
            </label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Customer</option>
              <option value="CUST001">CUST001 - John Doe</option>
              <option value="CUST002">CUST002 - Jane Smith</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount ($)
            </label>
            <input
              type="number"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              required
              min="1000"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Period (Years)
            </label>
            <input
              type="number"
              name="loan_period_years"
              value={formData.loan_period_years}
              onChange={handleChange}
              required
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (% per year)
            </label>
            <input
              type="number"
              name="interest_rate_yearly"
              value={formData.interest_rate_yearly}
              onChange={handleChange}
              required
              min="0.1"
              max="30"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating Loan...' : 'Create Loan'}
        </button>
      </form>

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Loan Created Successfully!</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Loan ID:</span> {result.loan_id}
            </div>
            <div>
              <span className="font-medium">Customer ID:</span> {result.customer_id}
            </div>
            <div>
              <span className="font-medium">Total Amount Payable:</span> ${result.total_amount_payable?.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Monthly EMI:</span> ${result.monthly_emi?.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanForm;
