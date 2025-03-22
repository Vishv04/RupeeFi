// ModernNavbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    <nav className="w-full flex justify-center ">
    <header 
      className={`rounded-xl  shadow-2xl w-[85%] fixed mt-4 z-50 transition-all duration-500 ${
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-300">RUPEE</span>
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
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-black transition-colors duration-300">
              EN
              <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 mt-2 w-36 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                  English
                </button>
                <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                  Spanish
                </button>
                <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                  French
                </button>
              </div>
            </div>
          </div>
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-black transition-colors duration-300 relative group"
          >
            Log in
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
          >
            Sign up
          </Link>
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
            <div className="space-y-2">
              <button
                className="flex items-center justify-between w-full text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => toggleDropdown("lang")}
              >
                Language
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeDropdown === "lang" ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div 
                className={`pl-4 space-y-2 border-l-2 border-indigo-200 overflow-hidden transition-all duration-300 ${
                  activeDropdown === "lang" 
                    ? "max-h-[500px] opacity-100" 
                    : "max-h-0 opacity-0"
                }`}
              >
                <button className="block w-full text-left py-2 text-gray-600 hover:text-black hover:translate-x-1 transform transition-all duration-200">
                  English
                </button>
                <button className="block w-full text-left py-2 text-gray-600 hover:text-black hover:translate-x-1 transform transition-all duration-200">
                  Spanish
                </button>
                <button className="block w-full text-left py-2 text-gray-600 hover:text-black hover:translate-x-1 transform transition-all duration-200">
                  French
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-3 pt-2">
              <Link
                to="/login"
                className="text-center border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2.5 rounded-full hover:shadow-md hover:shadow-indigo-200 transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>    

      
    </header>
    </nav>
  );
}

export { Navbar };