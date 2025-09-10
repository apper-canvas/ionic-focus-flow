import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const PrioritySelector = ({ value, onChange, className }) => {
  const priorities = [
    { value: "low", label: "Low", color: "from-success-500 to-success-600" },
    { value: "medium", label: "Medium", color: "from-warning-500 to-warning-600" },
    { value: "high", label: "High", color: "from-error-500 to-error-600" }
  ];

  return (
    <div className={cn("flex gap-2", className)}>
      {priorities.map((priority) => (
        <motion.button
          key={priority.value}
          type="button"
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all duration-200",
            value === priority.value
              ? `bg-gradient-to-r ${priority.color} text-white border-transparent shadow-md`
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
          onClick={() => onChange(priority.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {priority.label}
        </motion.button>
      ))}
    </div>
  );
};

export default PrioritySelector;