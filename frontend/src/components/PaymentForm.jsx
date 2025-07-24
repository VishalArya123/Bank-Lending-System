import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
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
      const response = await axios.post(
        `http://localhost:3000/api/v1/loans/${formData.loan_id}/payments`,
        {
          amount: parseFloat(formData.amount),
          payment_type: formData.payment_type
        }
      );

      setResult(response.data);
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
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
        <CreditCard className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Record Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan ID
            </label>
            <input
              type="text"
              name="loan_id"
              value={formData.loan_id}
              onChange={handleChange}
              required
              placeholder="Enter loan ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="EMI">EMI</option>
              <option value="LUMP_SUM">Lump Sum</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Recording Payment...' : 'Record Payment'}
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
            <span className="font-medium text-green-800">{result.message}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Payment ID:</span> {result.payment_id}
            </div>
            <div>
              <span className="font-medium">Remaining Balance:</span> ${result.remaining_balance?.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">EMIs Left:</span> {result.emis_left}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
