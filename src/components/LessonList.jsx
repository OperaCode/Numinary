import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const LessonsList = ({
  availableLessons,
  selectedTopic,
  startLesson,
  setAvailableLessons,
  startPractice,
  generateProblem,
}) => {
  return (
    <>
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
    </>
  );
};

export default LessonsList;
