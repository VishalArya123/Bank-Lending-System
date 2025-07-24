import React from 'react';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Bank Lending System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage loans, track payments, and view customer portfolios with our comprehensive lending platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loan Management</h3>
          <p className="text-gray-600">
            Create new loans, calculate EMIs, and manage loan portfolios efficiently.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Tracking</h3>
          <p className="text-gray-600">
            Record EMI payments and lump sum payments with automatic balance calculations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
          <p className="text-gray-600">
            View detailed ledgers and customer overviews with comprehensive analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
