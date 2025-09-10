import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({
  className,
  checked,
  onChange,
  size = "md",
  ...props
}, ref) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className="relative inline-block">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <motion.div
        className={cn(
          "rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200",
          sizes[size],
          checked 
            ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-500 shadow-md" 
            : "bg-white border-gray-300 hover:border-gray-400",
          className
        )}
        onClick={() => onChange && onChange({ target: { checked: !checked } })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: checked ? 1 : 0, 
            opacity: checked ? 1 : 0 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.3
          }}
        >
          <ApperIcon 
            name="Check" 
            size={size === "sm" ? 12 : size === "md" ? 14 : 16}
            className="text-white"
          />
        </motion.div>
      </motion.div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;