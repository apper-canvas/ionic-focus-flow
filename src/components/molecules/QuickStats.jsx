import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickStats = ({ tasks = [], className }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(task => task.priority === "high" && !task.completed).length;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "List",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "CheckCircle",
      gradient: "from-success-500 to-success-600",
      bgGradient: "from-success-50 to-success-100"
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: "Clock",
      gradient: "from-warning-500 to-warning-600",
      bgGradient: "from-warning-50 to-warning-100"
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      icon: "AlertCircle",
      gradient: "from-error-500 to-error-600",
      bgGradient: "from-error-50 to-error-100"
    }
  ];

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={cn(
            "p-4 rounded-xl bg-gradient-to-br backdrop-blur-sm border border-white/20 shadow-lg",
            stat.bgGradient
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={cn(
                "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                stat.gradient
              )}>
                {stat.value}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg bg-gradient-to-br shadow-md",
              stat.gradient
            )}>
              <ApperIcon name={stat.icon} size={20} className="text-white" />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Completion Rate */}
      {totalTasks > 0 && (
        <motion.div
          className="col-span-2 lg:col-span-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-white/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuickStats;