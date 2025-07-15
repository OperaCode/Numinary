import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { evaluate } from "mathjs";

const Calculator = ({
  input,
  setInput,
  history,
  setHistory,
  mode,
  setMode,
  currentLesson,
  setCurrentLesson,

  practiceProblem,
  setPracticeProblem,
  selectedTopic,
  setSelectedTopic,
  handlePracticeSubmit,
}) => {

    console.log("input:", input, "setInput:", setInput);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setPracticeProblem(null);
    toast.info("Cleared", { autoClose: 2000 });
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
      const entry = `${input} = ${result}`;
      setHistory((prev) => [...prev, entry].slice(-10));
      toast.success("Calculation successful!", { autoClose: 2000 });
    } catch (error) {
      setInput("Error");
      toast.error("Invalid expression", { autoClose: 3000 });
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
        {mode === "calculate"
          ? "Calculate"
          : mode === "learn"
          ? "Learn Math"
          : "Practice Math"}
      </h2>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-6 justify-center">
        {["calculate", "practice"].map((m) => (
          <motion.button
            key={m}
            onClick={() => {
              setMode(m);
              setCurrentLesson(null);
              setPracticeProblem(null);
              setInput("");
            }}
            className="px-4 py-2 rounded-full capitalize bg-gray-500 hover:bg-gray-600 text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {m}
          </motion.button>
        ))}
      </div>

      {/* Topic Selector */}
      {mode === "practice" && (
        <motion.div
          className="mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">Select Topic</h3>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white"
          >
            <option value="all">All Topics</option>
            <option value="arithmetic">Arithmetic</option>
            <option value="algebra">Algebra</option>
            <option value="trigonometry">Trigonometry</option>
          </select>
        </motion.div>
      )}

      {/* Display & Buttons */}
      <motion.div
        className="rounded-2xl p-6 shadow-2xl bg-white/10 backdrop-blur-md border border-gray-100/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Display */}
        <div className="text-2xl p-4 rounded-xl mb-4 h-16 flex items-center justify-end bg-gray-800">
          {input || "0"}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-5 gap-2">
          <motion.button
            onClick={handleClear}
            className="col-span-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            C
          </motion.button>
          <motion.button
            onClick={handleBackspace}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            ⌫
          </motion.button>
          <motion.button
            onClick={() => handleClick("/")}
            className="text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            ÷
          </motion.button>

          <motion.button
            onClick={() => handleClick("sin(")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            sin
          </motion.button>
          <motion.button
            onClick={() => handleClick("(")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            (
          </motion.button>
          <motion.button
            onClick={() => handleClick(")")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            )
          </motion.button>
          <motion.button
            onClick={() => handleClick("*")}
            className="text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            ×
          </motion.button>
          <motion.button
            onClick={() => handleClick("-")}
            className="text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            -
          </motion.button>

          <motion.button
            onClick={() => handleClick("cos(")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            cos
          </motion.button>

          {[7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleClick(num.toString())}
              className="py-4 rounded-xl font-semibold shadow-sm transition-all"
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            onClick={() => handleClick("+")}
            className="text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            +
          </motion.button>

          <motion.button
            onClick={() => handleClick("sqrt(")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            √
          </motion.button>

          {[4, 5, 6].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleClick(num.toString())}
              className="py-4 rounded-xl font-semibold shadow-sm transition-all"
            >
              {num}
            </motion.button>
          ))}

          <motion.button
            onClick={handleCalculate}
            className="row-span-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            =
          </motion.button>

          <motion.button
            onClick={() => handleClick("log(")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            log
          </motion.button>

          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleClick(num.toString())}
              className="py-4 rounded-xl font-semibold shadow-sm transition-all"
            >
              {num}
            </motion.button>
          ))}

          <motion.button
            onClick={() => handleClick("0")}
            className="col-span-2 py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            0
          </motion.button>
          <motion.button
            onClick={() => handleClick(".")}
            className="py-4 rounded-xl font-semibold shadow-sm transition-all"
          >
            .
          </motion.button>
        </div>

        {/* Practice Mode Problem */}
        {mode === "practice" && practiceProblem && (
          <div className="p-4 mt-4">
            <h3 className="text-xl font-semibold mb-2">
              Practice: {practiceProblem.title}
            </h3>
            <p className="mb-4">{practiceProblem.question}</p>
            <motion.button
              onClick={handlePracticeSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Calculator;
