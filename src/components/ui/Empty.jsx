import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet",
  message = "Create your first task to get started with Focus Flow. Stay organized and boost your productivity!",
  icon = "CheckSquare"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative mb-6"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={icon} size={40} className="text-primary-600" />
        </div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute -top-2 -right-2 w-3 h-3 bg-warning-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-3 w-2 h-2 bg-success-400 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: 1
          }}
        />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md leading-relaxed mb-6">
        {message}
      </p>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ApperIcon name="Lightbulb" size={16} className="text-warning-600" />
          Pro Tips
        </h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <span>Use priority levels to focus on what matters most</span>
          </li>
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <span>Set due dates to stay on track with deadlines</span>
          </li>
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <span>Organize tasks with categories for better workflow</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Empty;