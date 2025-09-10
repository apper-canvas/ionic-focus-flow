import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";

export const formatTaskDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatFullDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting full date:", error);
    return "";
  }
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch (error) {
    return false;
  }
};