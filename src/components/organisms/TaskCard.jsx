import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatTaskDate, isOverdue } from "@/utils/dateHelpers";

const TaskCard = ({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete,
  category,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    onToggle(task.Id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.Id);
  };

  const priorityVariant = {
    high: "high",
    medium: "medium", 
    low: "low"
  }[task.priority] || "default";

  const isTaskOverdue = task.dueDate && !task.completed && isOverdue(task.dueDate);

  return (
    <motion.div
      className={cn(
        "group bg-white rounded-xl border border-gray-200 p-4 shadow-sm transition-all duration-200 cursor-pointer",
        task.completed ? "opacity-75" : "hover:shadow-md hover:-translate-y-1",
        isTaskOverdue && "border-error-300 bg-error-50",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      {/* Task Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggle}
            size="md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              "text-base font-semibold text-gray-900 leading-tight",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={priorityVariant} size="sm">
                {task.priority}
              </Badge>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="p-1.5 h-8 w-8"
                >
                  <ApperIcon name="Edit2" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="p-1.5 h-8 w-8 text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Task Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {category && (
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1.5",
                isTaskOverdue && "text-error-600 font-medium"
              )}>
                <ApperIcon name="Calendar" size={14} />
                <span>{formatTaskDate(task.dueDate)}</span>
                {isTaskOverdue && (
                  <ApperIcon name="AlertTriangle" size={14} className="text-error-500" />
                )}
              </div>
            )}
            
            <div className="flex items-center gap-1.5">
              <ApperIcon name="Clock" size={14} />
              <span>{formatTaskDate(task.createdAt)}</span>
            </div>
          </div>

          {/* Task Description - Always visible if exists, expandable for longer text */}
          {task.description && (
            <motion.div
              initial={false}
              animate={{ height: "auto" }}
              className="overflow-hidden"
            >
              <p className={cn(
                "text-gray-600 text-sm leading-relaxed",
                task.completed && "line-through",
                !isExpanded && task.description.length > 120 && "line-clamp-2"
              )}>
                {task.description}
              </p>
              
              {task.description.length > 120 && (
                <button
                  className="text-primary-600 text-sm mt-1 hover:text-primary-700 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Category Border */}
      {category && (
        <div 
          className="absolute left-0 top-0 w-1 h-full rounded-l-xl"
          style={{ backgroundColor: category.color }}
        />
      )}
    </motion.div>
  );
};

export default TaskCard;