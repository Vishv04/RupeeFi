// ModernNavbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

function Navbar({ isAuthenticated, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const navItems = [
    {
      title: "Personal",
      hasDropdown: true,
      items: [
        { title: "Banking", href: "/personal/banking" },
        { title: "Investing", href: "/personal/investing" },
        { title: "Insurance", href: "/personal/insurance" },
        { title: "Loans", href: "/personal/loans" },
      ],
    },
    {
      title: "Business",
      hasDropdown: true,
      items: [
        { title: "Accounts", href: "/business/accounts" },
        { title: "Payments", href: "/business/payments" },
        { title: "Financing", href: "/business/financing" },
        { title: "Treasury", href: "/business/treasury" },
      ],
    },
    {
      title: "Company",
      hasDropdown: true,
      items: [
        { title: "About", href: "/company/about" },
        { title: "Careers", href: "/company/careers" },
        { title: "Press", href: "/company/press" },
        { title: "Investors", href: "/company/investors" },
      ],
    },
  ];

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  return (
    <nav className="w-full flex justify-center">
      <header 
        className={`rounded-xl shadow-2xl w-[85%] fixed mt-4 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white shadow-lg py-4" 
            : "bg-white py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  className="flex items-center text-gray-700 hover:text-black font-medium transition-colors duration-300"
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="relative overflow-hidden group-hover:text-black">
                    {item.title}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                {item.hasDropdown && (
                  <div className="absolute left-0 mt-2 w-52 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <div className="py-2">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.href}
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 relative overflow-hidden"
                        >
                          <span className="relative z-10">{subItem.title}</span>
                          <span className="absolute bottom-0 left-0 w-0 h-full bg-gray-100 -z-10 transition-all duration-200 ease-out hover:w-full"></span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          </div>

          {/* Logo (Center) */}
          <div className="flex-1 flex justify-center md:flex-none md:justify-start">
            <Link 
              to="/" 
              className="font-bold text-2xl tracking-tight relative group"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-300">RupeeFi</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/help" className="text-gray-700 hover:text-black transition-colors duration-300 relative group">
              Help
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-black transition-colors duration-300 relative group">
              Blog
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
                    <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                      Settings
                    </Link>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Link to="/login">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Login</button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen 
              ? "max-h-[1000px] opacity-100" 
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-6">
            {/* Mobile Navigation Items */}
            {navItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <button
                  className="flex items-center justify-between w-full text-gray-700 font-medium p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  onClick={() => toggleDropdown(index)}
                >
                  {item.title}
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === index ? "transform rotate-180" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`pl-4 space-y-2 border-l-2 border-indigo-200 mt-2 overflow-hidden transition-all duration-300 ${
                    activeDropdown === index && item.hasDropdown 
                      ? "max-h-[500px] opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile Action Items */}
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <Link to="/help" className="block text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Help
              </Link>
              <Link to="/blog" className="block text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Blog
              </Link>
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link to="/profile" className="block text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    Profile
                  </Link>
                  <Link to="/settings" className="block text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    Settings
                  </Link>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="block w-full text-left p-2 text-red-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Login</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export { Navbar };