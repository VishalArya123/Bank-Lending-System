import React, { useState } from 'react';
import axios from 'axios';
import { Users, Search, AlertCircle, CreditCard } from 'lucide-react';

const CustomerOverview = () => {
  const [customerId, setCustomerId] = useState('');
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOverview(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/customers/${customerId}/overview`);
      setOverview(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Customer Overview</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Customer</option>
            <option value="CUST001">CUST001 - John Doe</option>
            <option value="CUST002">CUST002 - Jane Smith</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          <span>{loading ? 'Loading...' : 'View Overview'}</span>
        </button>
      </form>

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {overview && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer: {overview.customer_id}</h3>
              <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-1 rounded-lg">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span className="text-indigo-800 font-medium">{overview.total_loans} Total Loans</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overview.loans.map((loan) => (
                <div key={loan.loan_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Loan ID: {loan.loan_id}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      loan.emis_left === 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.emis_left === 0 ? 'Paid Off' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="font-medium">${loan.principal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">${loan.total_amount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">${loan.amount_paid?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly EMI:</span>
                      <span className="font-medium">${loan.emi_amount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EMIs Left:</span>
                      <span className="font-medium">{loan.emis_left}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOverview;
