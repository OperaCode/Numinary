import { evaluate } from "mathjs";

const generateProblem = (topic = "all") => {
  const topics =
    topic === "all" ? ["arithmetic", "algebra", "trigonometry"] : [topic];
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  let problem, answer;

  switch (selectedTopic) {
    case "arithmetic": {
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
    }

    case "algebra": {
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
    }

    case "trigonometry": {
      const angle = [0, 30, 45, 60, 90][Math.floor(Math.random() * 5)];
      const func = ["sin", "cos"][Math.floor(Math.random() * 2)];
      problem = `${func}(${angle}°)`;
      answer = evaluate(`${func}(${angle} * pi / 180)`)
        .toFixed(4)
        .toString();
      return {
        id: Date.now(),
        title: "Trigonometry",
        question: `Find: ${problem}`,
        answer,
      };
    }

    default:
      return {
        id: Date.now(),
        title: "Arithmetic",
        question: "Solve: 2 + 2",
        answer: "4",
      };
  }
};

export default generateProblem;
