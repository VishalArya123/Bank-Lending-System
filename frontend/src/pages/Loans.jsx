import React, { useState } from 'react';
import LoanForm from '../components/LoanForm';
import PaymentForm from '../components/PaymentForm';
import LoanLedger from '../components/LoanLedger';

const Loans = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'create', name: 'Create Loan' },
              { id: 'payment', name: 'Record Payment' },
              { id: 'ledger', name: 'View Ledger' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'create' && <LoanForm />}
          {activeTab === 'payment' && <PaymentForm />}
          {activeTab === 'ledger' && <LoanLedger />}
        </div>
      </div>
    </div>
  );
};

export default Loans;
