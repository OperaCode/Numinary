import React, { useState, useEffect } from "react";
import { href, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Calculator,
  History,
  BookOpen,
  Trophy,
  Download,
  House,
} from "lucide-react";
import { evaluate } from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("calcHistory")) || []
  );
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [themes, setThemes] = useState("dark");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [mode, setMode] = useState("calculate"); 
  const [lessons, setLessons] = useState(
    JSON.parse(localStorage.getItem("lessons")) || { completed: 0, streak: 0 }
  );
  const [currentLesson, setCurrentLesson] = useState(null);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const navigate = useNavigate();

  // Dynamic problem generator
  const generateProblem = (topic = "all") => {
    const topics =
      topic === "all" ? ["arithmetic", "algebra", "trigonometry"] : [topic];
    const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
    let problem, answer;

    switch (selectedTopic) {
      case "arithmetic":
        const a = Math.floor(Math.random() * 10) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
        problem = `${a} ${op} ${d}`;
        answer = evaluate(problem).toString();
        return {
          id: Date.now(),
          title: "Arithmetic",
          question: `Solve: ${problem}`,
          answer,
        };
      case "algebra":
        const x = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 20) - 10;
        const b = Math.floor(Math.random() * 10) + 1;
        problem = `${b}x + ${c} = ${b * x + c}`;
        answer = x.toString();
        return {
          id: Date.now(),
          title: "Linear Equations",
          question: `Solve for x: ${problem}`,
          answer,
        };
      case "trigonometry":
        const angle = [0, 30, 45, 60, 90][Math.floor(Math.random() * 5)];
        const func = ["sin", "cos"][Math.floor(Math.random() * 2)];
        problem = `${func}(${angle}°)`;
        answer = evaluate(`${func}(${angle} * pi / 180)`).toFixed(4).toString();
        return {
          id: Date.now(),
          title: "Trigonometry",
          question: `Find: ${problem}`,
          answer,
        };
      default:
        return {
          id: Date.now(),
          title: "Arithmetic",
          question: "Solve: 2 + 2",
          answer: "4",
        };
    }
  };

  // Generate lesson list (cached in localStorage)
  const [availableLessons, setAvailableLessons] = useState(
    JSON.parse(localStorage.getItem("availableLessons")) ||
      Array.from({ length: 5 }, () => generateProblem())
  );

  // Persist data
  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
    localStorage.setItem("lessons", JSON.stringify(lessons));
    localStorage.setItem("availableLessons", JSON.stringify(availableLessons));
    // document.documentElement.className = themes[theme].bg;
  }, [history, lessons, availableLessons, theme]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (/[0-9+\-*/.()]/.test(key)) {
        handleClick(key);
      } else if (key === "Enter") {
        mode === "practice" || mode === "learn"
          ? handlePracticeSubmit()
          : handleCalculate();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        handleClear();
      } else if (key === "s") {
        handleClick("sin(");
      } else if (key === "c") {
        handleClick("cos(");
      } else if (key === "l") {
        handleClick("log(");
      } else if (key === "q") {
        handleClick("sqrt(");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [input, mode]);

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
        setLessons((prev) => ({
          completed: prev.completed + 1,
          streak: prev.streak + 1,
        }));
        toast.success("Correct! Great job! 🎉", { autoClose: 3000 });
        handleClear();
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
        setLessons((prev) => ({ ...prev, streak: 0 }));
        toast.error(`Incorrect. The answer is ${correctAnswer}. Try again!`, {
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Invalid input", { autoClose: 3000 });
    }
  };

  const handleExportHistory = () => {
    if (!history.length) {
      toast.info("No history to export", { autoClose: 2000 });
      return;
    }
    const blob = new Blob([history.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "numinary_history.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("History exported!", { autoClose: 2000 });
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

  // Dynamic graph based on lesson or practice problem
  const generateGraphData = () => {
    const equation =
      mode === "learn" && currentLesson?.title === "Trigonometry"
        ? currentLesson.question
        : "y = x^2";
    const isTrig = equation.includes("sin") || equation.includes("cos");
    const labels = Array.from(
      { length: 21 },
      (_, i) => (i - 10) * (isTrig ? 30 : 1)
    );
    const data = labels.map((x) => {
      try {
        if (isTrig) {
          const func = equation.includes("sin") ? "sin" : "cos";
          const angle = (x * Math.PI) / 180; // Convert degrees to radians
          return evaluate(`${func}(${angle})`).toFixed(4);
        }
        return evaluate(equation.replace("x", x)).toFixed(4);
      } catch {
        return x * x; // Fallback: y = x^2
      }
    });
    return {
      labels: labels.map((x) => x.toString()),
      datasets: [
        {
          label: `Function: ${equation}`,
          data,
          borderColor: "#6366F1",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          fill: false,
          tension: 0.4,
        },
      ],
    };
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        ticks: { stepSize: 1 },
        grid: {
          color: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      x: { grid: { display: false } },
    },
  };

  const navButtons = [
    {
      label: "Home",
      icon: <House size={20} />,
      href: "/",
    },
    {
      label: "History",
      icon: <History size={20} />,
      href: "/history",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white transition-colors duration-500">
      {/* Header */}
    
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
          <Calculator size={28} />
          Numinary
        </h1>
        <nav className="flex gap-6 items-center">
          {navButtons.map((btn) => (
            <a
              key={btn.label}
             href={btn.href}
              className=
                "font-medium px-5 py-2 cursor-pointer rounded-full flex items-center gap-2 transition-all duration-300 bg-teal-600 text-white hover:bg-white/20"     
            >
              {btn.icon}
              {btn.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <motion.div
        className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Column: Calculator and Controls */}
        <div>
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

          {/* Topic Selector for Practice Mode */}
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
                className={`w-full p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <option value="all">All Topics</option>
                <option value="arithmetic">Arithmetic</option>
                <option value="algebra">Algebra</option>
                <option value="trigonometry">Trigonometry</option>
              </select>
            </motion.div>
          )}

          {/* Calculator / Lesson / Practice */}
          <motion.div
            className={`rounded-2xl p-6 shadow-2xl bg-white/10 backdrop-blur-md border border-gray-100/20 `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {mode === "calculate" && (
              <>
                <div
                  className={`text-2xl p-4 rounded-xl mb-4 h-16 flex items-center justify-end  'dark' ? 'bg-gray-800' : 'bg-gray-100'`}
                >
                  {input || "0"}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <motion.button
                    onClick={handleClear}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Clear calculator"
                  >
                    C
                  </motion.button>
                  <motion.button
                    onClick={handleBackspace}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Backspace"
                  >
                    ⌫
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("/")}
                    className={` text-white py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Divide"
                  >
                    ÷
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("sin(")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sine"
                  >
                    sin
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("(")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Left parenthesis"
                  >
                    (
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick(")")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Right parenthesis"
                  >
                    )
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("*")}
                    className={` text-white py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Multiply"
                  >
                    ×
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("-")}
                    className={` text-white py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Subtract"
                  >
                    -
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("cos(")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cosine"
                  >
                    cos
                  </motion.button>
                  {[7, 8, 9].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => handleClick(num.toString())}
                      className={` py-4 rounded-xl font-semibold shadow-sm transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Number ${num}`}
                    >
                      {num}
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={() => handleClick("+")}
                    className={` text-white py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add"
                  >
                    +
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("sqrt(")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Square root"
                  >
                    √
                  </motion.button>
                  {[4, 5, 6].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => handleClick(num.toString())}
                      className={`  py-4 rounded-xl font-semibold shadow-sm transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Number ${num}`}
                    >
                      {num}
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={handleCalculate}
                    className="row-span-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Calculate"
                  >
                    =
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick("log(")}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Logarithm"
                  >
                    log
                  </motion.button>
                  {[1, 2, 3].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => handleClick(num.toString())}
                      className={`  py-4 rounded-xl font-semibold shadow-sm transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Number ${num}`}
                    >
                      {num}
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={() => handleClick("0")}
                    className={`col-span-2   py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Number 0"
                  >
                    0
                  </motion.button>
                  <motion.button
                    onClick={() => handleClick(".")}
                    className={`  py-4 rounded-xl font-semibold shadow-sm transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Decimal point"
                  >
                    .
                  </motion.button>
                </div>
              </>
            )}

            {mode === "practice" && practiceProblem && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  Practice: {practiceProblem.title}
                </h3>
                <p className="mb-4">{practiceProblem.question}</p>
                <div
                  className={`text-2xl p-4 rounded-xl mb-4 h-16 flex items-center justify-end ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  {input || "Enter answer"}
                </div>
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

        {/* Right Column: Lessons, Progress, and Graph */}
        <div className="space-y-6">
          {/* Progress Dashboard */}
          <motion.div
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy size={24} />
              Your Progress
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
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              Available Lessons
            </h3>
            <ul className="space-y-2">
              {availableLessons.map((lesson) => (
                <motion.li
                  key={lesson.id}
                  className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startLesson(lesson)}
                >
                  {lesson.title}: {lesson.question}
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={() =>
                setAvailableLessons((prev) =>
                  [...prev, generateProblem(selectedTopic)].slice(-5)
                )
              }
              className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate New Lesson
            </motion.button>
            <motion.button
              onClick={startPractice}
              className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Practice
            </motion.button>
          </motion.div>

          {/* Graph Visualization */}
          {(mode === "learn" && currentLesson?.title === "Trigonometry") ||
          (mode === "practice" && practiceProblem?.title === "Trigonometry") ? (
            <motion.div
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4">Function Graph</h3>
              <Line data={generateGraphData()} options={graphOptions} />
            </motion.div>
          ) : null}
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              className={`col-span-2 mt-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20 ${themes[theme].text}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <History size={24} />
                  Calculation History
                </h3>
                <motion.button
                  onClick={handleExportHistory}
                  className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  Export
                </motion.button>
              </div>
              {history.length ? (
                <ul className="text-sm space-y-2 max-h-48 overflow-y-auto">
                  {history.map((entry, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {entry}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p>No calculations yet</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 text-center bg-white/10 backdrop-blur-md mt-12">
        <p className="text-sm opacity-80">
          © 2025 Numinary. All rights reserved.
        </p>
        <div className="mt-4 space-x-6">
          <a
            href="/about"
            className="text-sm opacity-80 hover:opacity-100 transition-all"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm opacity-80 hover:opacity-100 transition-all"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
