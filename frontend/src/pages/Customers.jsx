import React from 'react';
import CustomerOverview from '../components/CustomerOverview';

const Customers = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <CustomerOverview />
      </div>
    </div>
  );
};

export default Customers;
