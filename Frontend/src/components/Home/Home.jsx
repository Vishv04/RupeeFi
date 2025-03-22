import React from 'react';
import { BarChart, LineChart, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer } from 'recharts';

const InvestmentDashboard = () => {
  // Sample data for charts
  const barData = [
    { name: 'Mon', value: 30 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 40 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 70 },
    { name: 'Sun', value: 50 }
  ];

  const lineData = [
    { name: '01 Apr', line1: 400, line2: 300, line3: 200 },
    { name: '08 Apr', line1: 350, line2: 450, line3: 300 },
    { name: '15 Apr', line1: 500, line2: 400, line3: 350 },
    { name: '22 Apr', line1: 450, line2: 470, line3: 250 },
    { name: '29 Apr', line1: 550, line2: 400, line3: 300 },
    { name: '06 May', line1: 500, line2: 380, line3: 400 },
    { name: '13 May', line1: 480, line2: 450, line3: 380 }
  ];

  // Calendar data
  const months = ['June 2021', 'July 2021'];
  
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      {/* Top banner */}
      <div className="bg-gray-800 rounded-lg p-3 mb-8 flex items-center">
        <div className="bg-blue-600 text-white py-1 px-3 rounded-md mr-2">New</div>
        <div className="flex items-center">
          <span className="mr-1">Flowbite is out! See what's new</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Main heading */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4">We invest in the<br />world's potential</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Here at Flowbite we focus on markets where innovation can unlock long-term value and drive economic growth.
        </p>
      </div>
      
      {/* Search */}
      <div className="flex mb-12 max-w-lg">
        <input
          type="text"
          placeholder="Search Mockups, Logos..."
          className="flex-grow bg-gray-800 text-white p-3 rounded-l-lg border-0"
        />
        <button className="bg-blue-600 px-6 rounded-r-lg flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Card 1 - Bar Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold">5,897</h2>
              <p className="text-sm text-gray-400">New products this week</p>
            </div>
            <div className="text-green-500 flex items-center">
              <span>4.3%</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <div>Last 7 days</div>
            <div>PRODUCTS REPORT</div>
          </div>
        </div>
        
        {/* Card 2 - Calendar */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            {months.map((month, index) => (
              <div key={index} className="bg-gray-900 p-2 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <button className="text-gray-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="text-sm">{month}</div>
                  <button className="text-gray-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  <div className="text-gray-500">Sun</div>
                  <div className="text-gray-500">Mon</div>
                  <div className="text-gray-500">Tue</div>
                  <div className="text-gray-500">Wed</div>
                  <div className="text-gray-500">Thu</div>
                  <div className="text-gray-500">Fri</div>
                  <div className="text-gray-500">Sat</div>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`p-1 rounded-sm ${i === 11 ? 'bg-blue-600' : ''}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button className="bg-blue-600 text-white text-center p-2 rounded-lg w-full mr-2">OK</button>
            <button className="bg-gray-700 text-white text-center p-2 rounded-lg w-full">Cancel</button>
          </div>
        </div>
        
        {/* Card 3 - Line Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold">$45,385</h2>
              <p className="text-sm text-gray-400">Sales this week</p>
            </div>
            <div className="text-green-500 flex items-center">
              <span>16%</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <Tooltip />
              <Line type="monotone" dataKey="line1" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line2" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line3" stroke="#6b7280" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <div>Last 7 days</div>
            <div>SALES REPORT</div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex">
          <div className="mr-4 mt-1 text-blue-500">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Customizable Categories</h3>
            <p className="text-gray-400">Host code that you don't want to share with the world in private.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="mr-4 mt-1 text-blue-500">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Private repos</h3>
            <p className="text-gray-400">Host code that you don't want to share with the world in private.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="mr-4 mt-1 text-blue-500">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Tracking Saving Rate</h3>
            <p className="text-gray-400">Host code that you don't want to share with the world in private.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;