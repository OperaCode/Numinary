import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Calculator, History, Trophy, House } from "lucide-react";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";

import CalculatorPage from "../components/Calculator";
import LessonsList from "../components/LessonList";
import HistoryPanel from "../components/HistoryPanel";
import generateProblem from "../utils/generateProblem";

const Home = () => {
  // State Management
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("calcHistory")) || []
  );
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState("calculate");
  const [lessons, setLessons] = useState(
    JSON.parse(localStorage.getItem("lessons")) || { completed: 0, streak: 0 }
  );
  const [currentLesson, setCurrentLesson] = useState(null);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [availableLessons, setAvailableLessons] = useState(
    JSON.parse(localStorage.getItem("availableLessons")) ||
      Array.from({ length: 5 }, () => generateProblem())
  );

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
    localStorage.setItem("lessons", JSON.stringify(lessons));
    localStorage.setItem("availableLessons", JSON.stringify(availableLessons));
  }, [history, lessons, availableLessons]);

  // Handle keyboard input shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;

      if (/[0-9+\-*/.()]/.test(key)) handleClick(key);
      else if (key === "Enter") mode === "practice" ? handlePracticeSubmit() : handleCalculate();
      else if (key === "Backspace") handleBackspace();
      else if (key === "Escape") handleClear();
      else if (key === "s") handleClick("sin(");
      else if (key === "c") handleClick("cos(");
      else if (key === "l") handleClick("log(");
      else if (key === "q") handleClick("sqrt(");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [input, mode]);

  // Handlers
  const handleClick = (value) => setInput((prev) => prev + value);

  const handleClear = () => {
    setInput("");
    setPracticeProblem(null);
    toast.info("Cleared", { autoClose: 2000 });
  };

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

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
    } catch {
      setInput("Error");
      toast.error("Invalid expression", { autoClose: 3000 });
    }
  };

  const handlePracticeSubmit = () => {
    if (!input || (!practiceProblem && !currentLesson)) {
      toast.error("Please enter an answer", { autoClose: 3000 });
      return;
    }
    try {
      const result = evaluate(input).toString();
      const correctAnswer =
        mode === "practice" ? practiceProblem.answer : currentLesson.answer;

      if (
        result === correctAnswer ||
        Math.abs(parseFloat(result) - parseFloat(correctAnswer)) < 0.0001
      ) {
        // Correct answer handling
        setLessons((prev) => ({
          completed: prev.completed + 1,
          streak: prev.streak + 1,
        }));
        toast.success("Correct! Great job! 🎉", { autoClose: 3000 });
        setInput("");

        if (mode === "practice") {
          startPractice();
        } else {
          setCurrentLesson(null);
          setMode("calculate");
          setAvailableLessons((prev) =>
            [...prev, generateProblem(selectedTopic)].slice(-5)
          );
        }
      } else {
        // Incorrect answer handling
        setLessons((prev) => ({ ...prev, streak: 0 }));
        toast.error(`Incorrect. The answer is ${correctAnswer}. Try again!`, {
          autoClose: 5000,
        });
      }
    } catch {
      toast.error("Invalid input", { autoClose: 3000 });
    }
  };

  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
    setMode("learn");
    setInput("");
  };

  const startPractice = () => {
    const newProblem = generateProblem(selectedTopic);
    setPracticeProblem(newProblem);
    setMode("practice");
    setInput("");
  };

  // Navigation buttons config
  const navButtons = [
    { label: "Home", icon: <House size={20} />, href: "/" },
    { label: "History", icon: <History size={20} /> },
  ];

  // Component Render
  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white transition-colors duration-500">
      {/* Header Section */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
          <Calculator size={28} /> Numinary
        </h1>

        <nav className="flex gap-6 items-center">
          {navButtons.map((btn) =>
            btn.label === "History" ? (
              <button
                key={btn.label}
                onClick={() => setShowHistory((prev) => !prev)}
                className="font-medium px-5 py-2 rounded-full flex items-center gap-2 transition bg-teal-600 text-white hover:bg-white/20"
              >
                {btn.icon}
                {btn.label}
              </button>
            ) : (
              <Link
                key={btn.label}
                to={btn.href}
                className="font-medium px-5 py-2 rounded-full flex items-center gap-2 transition bg-teal-600 text-white hover:bg-white/20"
              >
                {btn.icon}
                {btn.label}
              </Link>
            )
          )}
        </nav>
      </header>

      {/* Main Content Section */}
      <motion.div
        className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* History Panel */}
        <HistoryPanel history={history} showHistory={showHistory} />

        {/* Calculator Component */}
        <CalculatorPage
          input={input}
          setInput={setInput}
          history={history}
          setHistory={setHistory}
          mode={mode}
          setMode={setMode}
          currentLesson={currentLesson}
          setCurrentLesson={setCurrentLesson}
          practiceProblem={practiceProblem}
          setPracticeProblem={setPracticeProblem}
          handleClear={handleClear}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          handlePracticeSubmit={handlePracticeSubmit}
        />

        {/* Lessons & Progress */}
        <div className="space-y-6">
          {/* Progress Dashboard */}
          <motion.div
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy size={24} /> Your Progress
            </h3>
            <p>Lessons Completed: {lessons.completed}</p>
            <p>
              Learning Streak: {lessons.streak} {lessons.streak > 0 && "🔥"}
            </p>
            {lessons.completed >= 3 && (
              <p className="mt-2 text-sm bg-green-500/20 p-2 rounded">
                Badge: Math Enthusiast 🏆
              </p>
            )}
          </motion.div>

          {/* Lessons List */}
          <motion.div
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <LessonsList
              setAvailableLessons={setAvailableLessons}
              availableLessons={availableLessons}
              selectedTopic={selectedTopic}
              startLesson={startLesson}
              startPractice={startPractice}
              generateProblem={generateProblem}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Footer*/}
      <footer className="w-full py-8 px-6 text-center bg-white/10 backdrop-blur-md mt-12">
        <p className="text-sm opacity-80">
          © 2025 Numinary. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
