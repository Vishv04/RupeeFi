import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, BarChart, Shield, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardImg from "../../assets/Dashboard.png";
import OneCoin from "../../assets/1coin.png";
import fiftyPaisa from "../../assets/50paiseCoin.png";
import twoRupee from "../../assets/2rupee.png";
import fiveRupee from "../../assets/5rupee.png";
import tenRupee from "../../assets/10rupee.png";
import twentyRupee from "../../assets/20rupee.png";
import fiftyRupee from "../../assets/50rupee.png";
import hundredRupee from "../../assets/100rupee.png";
import twoHundredRupee from "../../assets/200rupee.png";
import fiveHundredRupee from "../../assets/500rupee.png";


export default function Herosection() {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect - similar to Navbar
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

  return (
    <div className={`relative w-full min-h-[90vh] bg-white pt-24 pb-16 flex flex-col items-center justify-center transition-all duration-500 ${
      scrolled ? "mt-16" : "mt-20"
    }`}>
      
      {/* Enhanced background decorative elements with more vibrant gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#4552e3]/10 to-[#888feb]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[#1e2cc8]/10 to-[#15229c]/10 blur-3xl" />
        <div className="absolute top-40 right-0 w-40 h-[500px] rounded-l-full bg-gradient-to-b from-[#888feb]/5 to-[#4552e3]/5" />
        <div className="absolute bottom-40 left-0 w-40 h-[300px] rounded-r-full bg-gradient-to-t from-[#4552e3]/5 to-[#888feb]/5" />
      </div>

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* New floating elements */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-[30%] left-[15%] w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60"
        />
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-[25%] right-[20%] w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-60"
        />
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-15, 15, -15] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-[60%] right-[25%] w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60"
        />
      </div>
      
      {/* Decorative patterns - added coin-like circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-20 left-[10%] w-24 h-24 rounded-full border-4 border-[#4552e3]/20"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-[30%] right-[15%] w-16 h-16 rounded-full border-2 border-[#4552e3]/30"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-40 left-[20%] w-32 h-32 rounded-full border-8 border-[#4552e3]/10"
        />
      </div>
      
      {/* Left indicator line */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-[#888feb]/20">
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 200 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-32 h-40 w-px bg-gradient-to-b from-transparent via-[#4552e3] to-transparent" 
        />
      </div>
      
      {/* Right indicator line */}
      <div className="absolute inset-y-0 right-0 h-full w-px bg-[#888feb]/20">
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 200 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute top-64 h-40 w-px bg-gradient-to-b from-transparent via-[#4552e3] to-transparent" 
        />
      </div>
      
      {/* Main content wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Centered RupeeFi title with huge font */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center mb-12"
        >
          {/* Sparkle decorations */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-0 left-[30%] transform -translate-x-1/2"
          >
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute top-8 right-[30%] transform translate-x-1/2"
          >
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#15229c] via-[#4552e3] to-[#6972f8]"
          >
            RupeeFi
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl text-[#0d1152]/80 mt-4 max-w-3xl mx-auto font-light"
          >
            Reimagining India's Digital Currency Experience
          </motion.p>

          {/* Secondary tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto"
          >
            Empowering financial freedom through secure, accessible, and revolutionary digital Rupee solutions
          </motion.p>
        </motion.div>

        {/* Custom Rupee Display with wave-like size variations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full max-w-6xl mx-auto my-12"
        >
          <div className="flex flex-row items-center justify-center gap-[1px] sm:gap-2 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory">
            {/* High to low */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[85px] sm:h-[180px] md:h-[220px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={twoRupee} 
                alt="₹2 Coin" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[75px] sm:h-[160px] md:h-[200px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={fiveRupee} 
                alt="₹5 Coin" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[65px] sm:h-[140px] md:h-[180px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={tenRupee} 
                alt="₹10 Coin" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[55px] sm:h-[120px] md:h-[160px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={twentyRupee} 
                alt="₹20 Note" 
              />
            </motion.div>
            
            {/* Smallest elements (stacked) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex-shrink-0 flex flex-col items-center justify-center p-1 overflow-visible snap-center"
            >
              <div className="transform transition-transform duration-300 hover:scale-110 origin-center">
                <img className="h-[30px] sm:h-[60px] md:h-[80px] object-contain mb-1" src={OneCoin} alt="₹1 Coin" />
                <img className="h-[30px] sm:h-[60px] md:h-[80px] object-contain mt-1" src={fiftyPaisa} alt="50 Paise Coin" />
              </div>
            </motion.div>
            
            {/* Low to high */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[55px] sm:h-[120px] md:h-[160px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={fiftyRupee} 
                alt="₹50 Note" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[65px] sm:h-[140px] md:h-[180px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={hundredRupee} 
                alt="₹100 Note" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[75px] sm:h-[160px] md:h-[200px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={twoHundredRupee} 
                alt="₹200 Note" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="flex-shrink-0 p-1 overflow-visible snap-center"
            >
              <img 
                className="h-[85px] sm:h-[180px] md:h-[220px] object-contain transform transition-transform duration-300 hover:scale-110 origin-center" 
                src={fiveHundredRupee} 
                alt="₹500 Note" 
              />
            </motion.div>
          </div>
          
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          
          {/* Mobile scroll indicator */}
          <div className="mt-2 flex justify-center md:hidden">
            <div className="w-12 h-1 rounded-full bg-[#4552e3]/20"></div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          <Link to="/login" className="group flex items-center justify-center w-64 transform rounded-full bg-gradient-to-r from-[#15229c] to-[#4552e3] px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#4552e3]/30 hover:-translate-y-1">
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          
          <Link to="/about" className="group flex items-center justify-center w-64 transform rounded-full bg-white px-6 py-3 font-medium text-[#4552e3] border-2 border-[#4552e3]/20 transition-all duration-300 hover:border-[#4552e3] hover:shadow-lg hover:shadow-[#4552e3]/10 hover:-translate-y-1">
            Learn More
          </Link>
        </motion.div>

        {/* Feature highlights section - comes after the main hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: <Wallet className="text-[#4552e3]" />, title: "Smart Banking", description: "Seamless transactions with intelligent insights" },
            { icon: <BarChart className="text-[#4552e3]" />, title: "Investments", description: "Grow your wealth with personalized strategies" },
            { icon: <Shield className="text-[#4552e3]" />, title: "Security", description: "Advanced protection for your financial data" },
            { icon: <CreditCard className="text-[#4552e3]" />, title: "Credit Tools", description: "Build and optimize your credit score" },
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.4 + (index * 0.1) }}
              className="group flex flex-col items-center p-6 rounded-xl bg-white border border-[#888feb]/10 hover:border-[#4552e3]/20 hover:shadow-lg hover:shadow-[#888feb]/5 transition-all duration-300"
            >
              <div className="mb-4 p-3 rounded-full bg-[#888feb]/5 group-hover:bg-[#4552e3]/10 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#0d1152] mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Digital Rupee Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="relative z-10 mt-20 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* CBDC Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0d1152]">
                  Digital Rupee (e₹) - India's CBDC
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  The Digital Rupee (e₹) is India's Central Bank Digital Currency (CBDC), launched by the Reserve Bank of India. It represents a direct liability of the RBI and serves as a digital version of physical cash.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#888feb]/20 hover:border-[#4552e3]/30 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#0d1152] mb-2">Retail e₹</h3>
                    <p className="text-sm text-gray-600">
                      Designed for everyday transactions by individuals and businesses, offering the same experience as physical cash but in digital form.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl border border-[#888feb]/20 hover:border-[#4552e3]/30 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#0d1152] mb-2">Wholesale e₹</h3>
                    <p className="text-sm text-gray-600">
                      Used for interbank transfers and large-value transactions in financial markets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-gradient-to-br from-[#f8f9ff] to-white p-6 rounded-2xl border border-[#888feb]/20">
              <h3 className="text-xl font-semibold text-[#0d1152] mb-6">
                Benefits of Digital Rupee
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Reduced Operational Costs",
                    description: "Lower costs of printing, storing, and distributing physical currency"
                  },
                  {
                    title: "Real-time Settlements",
                    description: "Instant payment settlements without intermediary delays"
                  },
                  {
                    title: "Financial Inclusion",
                    description: "Easier access to financial services for unbanked populations"
                  },
                  {
                    title: "Programmable Money",
                    description: "Smart contracts and automated payments capabilities"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.8 + (index * 0.1) }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#4552e3]/5 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-[#4552e3]" />
                    <div>
                      <h4 className="font-medium text-[#0d1152]">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link 
                to="/learn-more" 
                className="mt-6 inline-flex items-center text-[#4552e3] hover:text-[#15229c] transition-colors duration-300"
              >
                Learn more about Digital Rupee
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="relative z-10 mt-20 rounded-2xl border border-[#888feb]/20 bg-white p-4 shadow-lg shadow-[#4552e3]/5"
        >
          <div className="w-full overflow-hidden rounded-xl border border-[#888feb]/10">
            <div className="bg-[#0d1152]/90 px-4 py-2 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 text-center text-xs text-white/70">RupeeFi Dashboard</div>
            </div>
            <img
              src={DashboardImg}
              alt="RupeeFi dashboard preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              onError={(e) => {
                e.target.src = DashboardImg;
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

