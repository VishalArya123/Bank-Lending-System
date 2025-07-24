import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Search, AlertCircle } from 'lucide-react';

const LoanLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLedger(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/loans/${loanId}/ledger`);
      setLedger(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Loan Ledger</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            required
            placeholder="Enter loan ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          <span>{loading ? 'Loading...' : 'View Ledger'}</span>
        </button>
      </form>

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {ledger && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${ledger.principal?.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Principal</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${ledger.amount_paid?.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Amount Paid</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">${ledger.balance_amount?.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{ledger.emis_left}</div>
                <div className="text-sm text-gray-600">EMIs Left</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
            {ledger.transactions && ledger.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ledger.transactions.map((transaction) => (
                      <tr key={transaction.transaction_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.transaction_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.amount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'EMI' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions found for this loan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanLedger;
