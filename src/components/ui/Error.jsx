import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong while loading your tasks.",
  onRetry,
  title = "Oops! Something went wrong"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-4"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <ApperIcon name="AlertTriangle" size={32} className="text-error-600" />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Need help? Here are some things you can try:
        </p>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Refresh the page</li>
          <li>• Clear your browser cache</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Error;