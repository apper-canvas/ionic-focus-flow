import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TaskFilters = ({ 
  statusFilter, 
  priorityFilter, 
  categoryFilter,
  onStatusChange, 
  onPriorityChange,
  onCategoryChange,
  categories = [],
  className 
}) => {
  const statusOptions = [
    { value: "all", label: "All Tasks", icon: "List" },
    { value: "pending", label: "Pending", icon: "Clock" },
    { value: "completed", label: "Completed", icon: "CheckCircle" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const FilterButton = ({ active, onClick, children, icon }) => (
    <motion.button
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        active
          ? "bg-primary-500 text-white shadow-md"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <ApperIcon name={icon} size={16} />}
      {children}
    </motion.button>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={statusFilter === option.value}
              onClick={() => onStatusChange(option.value)}
              icon={option.icon}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={priorityFilter === option.value}
              onClick={() => onPriorityChange(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={categoryFilter === "all"}
              onClick={() => onCategoryChange("all")}
            >
              All Categories
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category.Id}
                active={categoryFilter === category.name.toLowerCase()}
                onClick={() => onCategoryChange(category.name.toLowerCase())}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </FilterButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;