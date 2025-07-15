import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calculator, Sun, Moon, ArrowRight, House } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Landing = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode((prev) => {
      toast.info(`Switched to ${!prev ? "Dark" : "Light"} Mode`, {
        autoClose: 2000,
      });
      return !prev;
    });
  };

  const testimonials = [
    {
      name: "Alex T.",
      quote: "Numinary makes calculations a breeze with its sleek design!",
    },
    {
      name: "Samantha R.",
      quote: "The best calculator app I've used. Fast and intuitive!",
    },
    { name: "Jordan M.", quote: "Love the dark mode and quick calculations!" },
  ];

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white transition-colors duration-500"
    >
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
          <Calculator size={28} />
          Numinary
        </h1>
        <nav className="flex gap-6 items-center">
          <a href="/home">
            <button className="font-medium px-5 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2">
              <Calculator size={20} />
              Get Started
            </button>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 text-center py-16">
        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r darkMode from-teal-400 to-cyan-400 text-transparent bg-clip-text`}
          >
            Illuminate Your Calculations with Numinary
          </h1>
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${
              darkMode ? "text-gray-200" : "text-gray-700"
            } opacity-90`}
          >
            Experience lightning-fast calculations with a sleek, intuitive
            interface. From simple sums to complex expressions, Numinary shines
            bright.
          </p>

          {/* Calculator Preview */}
          <motion.div
            className="relative w-80 h-96 mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-4 gap-2">
              {[
                "1",
                "2",
                "3",
                "+",
                "4",
                "5",
                "6",
                "-",
                "7",
                "8",
                "9",
                "*",
                "0",
                ".",
                "=",
                "/",
              ].map((btn, index) => (
                <motion.button
                  key={index}
                  className={`p-4 rounded-lg 'bg-gray-700 hover:bg-gray-600 transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {btn}
                </motion.button>
              ))}
            </div>
            <div
              className={`mt-4 p-4 rounded-lgbg-gray-600 text-right text-xl`}
            >
              0
            </div>
          </motion.div>

          <Link to="/home" aria-label="Start calculating now">
            <motion.button
              className={`font-semibold px-8 py-4 rounded-full shadow-2xl bg-gradient-to-r  from-teal-500 to-cyan-500 text-white hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 mx-auto`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calculator size={24} />
              Start Calculating Now
              <ArrowRight size={24} />
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <motion.h2
          className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r from-teal-400 to-cyan-400  text-transparent bg-clip-text`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Numinary Shines
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Blazing Fast",
              description:
                "Instant calculations with a robust math engine for precision and speed.",
              icon: <Calculator size={40} className="text-teal-400" />,
            },
            {
              title: "Intuitive Design",
              description:
                "Clean, user-friendly interface with keyboard support and responsive layout.",
              icon: <House size={40} className="text-teal-400" />,
            },
            {
              title: "Smart Features",
              description:
                "History tracking, customizable themes, and advanced functions for all your needs.",
              icon: <Sun size={40} className={"text-teal-400"} />,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20 text-white`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-90">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <motion.h2
          className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r 'from-teal-400 to-cyan-400 text-transparent bg-clip-text`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Users Say
        </motion.h2>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20 mb-4 text-white "
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg italic mb-2">"{testimonial.quote}"</p>
                <p className="text-sm font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 text-center bg-white/10 backdrop-blur-md">
        <p className="text-sm opacity-80">
          © 2025 Numinary. All rights reserved.
        </p>
        <div className="mt-4 space-x-6">
          <Link
            to="/about"
            className="text-sm opacity-80 hover:opacity-100 transition-all"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm opacity-80 hover:opacity-100 transition-all"
          >
            Contact
          </Link>
        </div>
      </footer>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Landing;
