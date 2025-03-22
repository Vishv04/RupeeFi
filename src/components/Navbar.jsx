import { useEffect, useState } from 'react';
import Button from './Button';
import { userAPI } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getProfile();
        setUser(response.data.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 px-6 py-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-cyan-500">codePirates</h1>
        {!loading && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-400">
                  Visits: {user.visitCount}
                </span>
                <Button variant="secondary">
                  Dashboard
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <span className="text-gray-400">
                Please sign in to continue
              </span>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 