import { Link } from 'react-router-dom';

const Navbar = ({ userName }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#7494ec]">RupeeFi</span>
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Welcome, {userName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 