import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History } from "lucide-react";

const HistoryPanel = ({ history, showHistory }) => (
  <AnimatePresence>
    {showHistory && (
      <motion.div
        className="col-span-2 mt-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-gray-100/20"
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
        </div>

        {history.length ? (
          <ul className="text-sm space-y-2 max-h-48 overflow-y-auto">
            {history.map((entry, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
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
);

export default HistoryPanel;
