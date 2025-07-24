import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Building2, CreditCard, Users } from 'lucide-react';
import Home from './pages/Home';
import Loans from './pages/Loans';
import Customers from './pages/Customers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-gray-800">Bank Lending System</span>
              </div>
              <div className="flex space-x-6">
                <Link 
                  to="/" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/loans" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Loans</span>
                </Link>
                <Link 
                  to="/customers" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
