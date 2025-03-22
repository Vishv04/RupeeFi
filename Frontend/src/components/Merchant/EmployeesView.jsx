import React, { useState } from 'react';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { employeesData } from './merchantData';

const EmployeesView = ({ darkMode, cardShadow }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Style for the card components
  const cardStyle = {
    boxShadow: cardShadow,
    transition: 'all 0.3s ease'
  };
  
  // Style for buttons
  const buttonStyle = {
    boxShadow: darkMode 
      ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
      : '0 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease'
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg text-white bg-primary-DEFAULT hover:bg-primary-dark flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
          style={buttonStyle}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>
      
      <div 
        className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 mb-6`}
        style={cardStyle}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search employees..." 
              className={`pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all w-full sm:w-64`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center space-x-2">
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Roles</option>
              <option>Manager</option>
              <option>Cashier</option>
              <option>Sales</option>
            </select>
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left text-xs uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Joined Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {employeesData.map((employee, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                        employee.name.charAt(0).toLowerCase() <= 'h' 
                          ? 'bg-primary-light' 
                          : employee.name.charAt(0).toLowerCase() <= 'p' 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                      } shadow-sm`}>
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{employee.role}</td>
                  <td className="py-3">{employee.phone}</td>
                  <td className="py-3 text-muted-foreground">{employee.joinedDate}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors hover:shadow-sm p-1 rounded-full">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors hover:shadow-sm p-1 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 6 of 6 employees
          </div>
          <div className="flex items-center space-x-1">
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Previous
            </button>
            <button className="px-3 py-1 rounded-md text-sm bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md">
              1
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)}></div>
          <div 
            className={`relative w-full max-w-md p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 z-10 animate-fadeIn`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  >
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Sales</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm text-white bg-primary-DEFAULT hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView; 