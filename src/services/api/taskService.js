import tasksData from "@/services/mockData/tasks.json";
import { storage } from "@/utils/storage";

// Initialize with mock data if localStorage is empty
const initializeTasks = () => {
  const existingTasks = storage.getTasks();
  if (existingTasks.length === 0) {
    storage.saveTasks(tasksData);
    return tasksData;
  }
  return existingTasks;
};

const taskService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return initializeTasks();
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    const task = tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = storage.getTasks();
    const maxId = tasks.reduce((max, task) => Math.max(max, task.Id), 0);
    
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      category: taskData.category || "personal",
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
      ...taskData
    };
    
    const updatedTasks = [...tasks, newTask];
    storage.saveTasks(updatedTasks);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = storage.getTasks();
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData,
      Id: parseInt(id)
    };
    
    tasks[taskIndex] = updatedTask;
    storage.saveTasks(tasks);
    return { ...updatedTask };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = storage.getTasks();
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTasks = tasks.filter(task => task.Id !== parseInt(id));
    storage.saveTasks(updatedTasks);
    return true;
  },

  toggle: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id));
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    storage.saveTasks(tasks);
    return { ...tasks[taskIndex] };
  },

  getByCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    return tasks.filter(task => task.category === category).map(task => ({ ...task }));
  },

  getByPriority: async (priority) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    return tasks.filter(task => task.priority === priority).map(task => ({ ...task }));
  },

  getCompleted: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    return tasks.filter(task => task.completed).map(task => ({ ...task }));
  },

  getPending: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = storage.getTasks();
    return tasks.filter(task => !task.completed).map(task => ({ ...task }));
  }
};

export default taskService;