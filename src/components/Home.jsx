import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  History, Sun, Moon, House, Calculator } from 'lucide-react';
import { evaluate } from 'mathjs';

const Home = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (/[0-9+\-*/.()]/.test(key)) {
        handleClick(key);
      } else if (key === 'Enter') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [input]);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
   
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!input) {
      toast.error("Please enter an expression", { autoClose: 3000 });
      return;
    }
    try {
      const result = evaluate(input).toString();
      setInput(result);
      setHistory((prev) => [...prev, `${input} = ${result}`].slice(-10)); 
      
    } catch (error) {
      setInput("Error");
      toast.error("Invalid expression", { autoClose: 3000 });
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
   
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br text-white from-gray-800 via-gray-900 to-blue-900' : 'bg-gradient-to-br from-blue-100 via-white to-green-100'} px-4 py-8 transition-colors duration-300`}>
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator size={24} />
          Calcify
        </h1>
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300 flex items-center gap-2"
            aria-label="Back to landing page"
          >
            {/* <Home size={20} /> */}
            Home
          </button>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="cursor-pointer font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300 flex items-center gap-2"
            aria-label={showHistory ? "Hide history" : "Show history"}
          >
            {/* <History size={20} /> */}
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300 flex items-center gap-2"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-sm mx-auto mt-8 animate-fadeIn">
        <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Calcify: Your Smart Calculator
        </h2>

        {/* History Panel */}
        {showHistory && (
          <div className={`mb-4 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} animate-scaleIn`}>
            <h3 className="text-lg font-semibold mb-2">Calculation History</h3>
            {history.length ? (
              <ul className="text-sm space-y-1">
                {history.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            ) : (
              <p>No calculations yet</p>
            )}
          </div>
        )}

        {/* Calculator */}
        <div className={`rounded-lg p-4 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`text-2xl p-4 rounded mb-4 h-16 flex items-center justify-end ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
            {input || "0"}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleClear}
              className="cursor-pointer col-span-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Clear calculator"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Backspace"
            >
              ⌫
            </button>
            <button
              onClick={() => handleClick("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Divide"
            >
              ÷
            </button>

            <button
              onClick={() => handleClick("(")}
              className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Left parenthesis"
            >
              (
            </button>
            <button
              onClick={() => handleClick(")")}
              className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Right parenthesis"
            >
              )
            </button>
            <button
              onClick={() => handleClick("*")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Multiply"
            >
              ×
            </button>
            <button
              onClick={() => handleClick("-")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Subtract"
            >
              -
            </button>

            {[7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num.toString())}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${darkMode ? 'white' : 'gray-800'} py-4 rounded font-semibold shadow-sm transition`}
                aria-label={`Number ${num}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleClick("+")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Add"
            >
              +
            </button>

            {[4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num.toString())}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${darkMode ? 'white' : 'gray-800'} py-4 rounded font-semibold shadow-sm transition`}
                aria-label={`Number ${num}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleCalculate}
              className="row-span-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded font-semibold shadow-sm transition"
              aria-label="Calculate"
            >
              =
            </button>

            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num.toString())}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${darkMode ? 'white' : 'gray-800'} py-4 rounded font-semibold shadow-sm transition`}
                aria-label={`Number ${num}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => handleClick("0")}
              className={`col-span-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${darkMode ? 'white' : 'gray-800'} py-4 rounded font-semibold shadow-sm transition`}
              
            >
              0
            </button>
            <button
              onClick={() => handleClick(".")}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-${darkMode ? 'white' : 'gray-800'} py-4 rounded font-semibold shadow-sm transition`}
              
            >
              .
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home
