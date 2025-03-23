import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, BarChart, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardImg from "../../assets/Dashboard.png";
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
    <div className={`relative w-full bg-white pt-24 pb-16 flex flex-col items-center justify-center transition-all duration-500 ${
      scrolled ? "mt-16" : "mt-20"
    }`}>
      
      {/* Background decorative elements - subtle and light */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#4552e3]/5 to-[#888feb]/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-tr from-[#1e2cc8]/5 to-[#15229c]/5 blur-3xl" />
        <div className="absolute top-40 right-0 w-40 h-[500px] rounded-l-full bg-gradient-to-b from-[#888feb]/3 to-[#4552e3]/3" />
      </div>


      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Left indicator line like in original but with fintech colors */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-[#888feb]/20">
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 150 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-32 h-40 w-px bg-gradient-to-b from-transparent via-[#4552e3] to-transparent" 
        />
      </div>
      
      {/* Right indicator line */}
      <div className="absolute inset-y-0 right-0 h-full w-px bg-[#888feb]/20">
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 150 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute top-64 h-40 w-px bg-gradient-to-b from-transparent via-[#4552e3] to-transparent" 
        />
      </div>
      
      {/* Content wrapper - expanded width */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* Main heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="relative z-10 mx-auto max-w-5xl text-blue-700 text-center text-3xl font-bold md:text-5xl lg:text-7xl bg-clip-text  bg-gradient-to-r from-[#0d1152] to-[#4552e3]">
            {"Financial   freedom   begins  with RupeeFi"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto text-blue-700max-w-2xl py-6 text-center text-lg font-normal text-gray-600"
          >
            Empower your financial journey with smart banking solutions, investment opportunities, and personalized financial insights — all in one secure platform.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/login" className="group flex items-center justify-center w-64 transform rounded-full bg-gradient-to-r from-[#15229c] to-[#4552e3] px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#4552e3]/20 hover:-translate-y-0.5">
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 1.2,
          }}
          className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
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

        {/* Dashboard preview - larger and more prominent */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 1.5,
          }}
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
                e.target.src = {DashboardImg};
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

