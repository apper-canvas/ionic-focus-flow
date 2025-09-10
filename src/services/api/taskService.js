import { toast } from 'react-toastify';

const taskService = {
  getApperClient: () => {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  getAll: async () => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Task with id ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (taskData) => {
    try {
      const apperClient = taskService.getApperClient();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: taskData.title || taskData.Name || "New Task",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          priority_c: taskData.priority || "medium",
          category_c: taskData.category || "personal",
          completed_c: false,
          created_at_c: new Date().toISOString(),
          due_date_c: taskData.dueDate || null,
          Tags: taskData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Task created successfully");
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, taskData) => {
    try {
      const apperClient = taskService.getApperClient();
      
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (taskData.title !== undefined) updateData.title_c = taskData.title;
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.category !== undefined) updateData.category_c = taskData.category;
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed;
      if (taskData.dueDate !== undefined) updateData.due_date_c = taskData.dueDate;
      if (taskData.title !== undefined) updateData.Name = taskData.title;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Task updated successfully");
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = taskService.getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Task deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  },

  toggle: async (id) => {
    try {
      // First get current task to get completed status
      const currentTask = await taskService.getById(id);
      
      // Update with toggled completed status
      return await taskService.update(id, {
        completed: !currentTask.completed_c
      });
    } catch (error) {
      console.error("Error toggling task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  getByCategory: async (category) => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  getByPriority: async (priority) => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error);
      return [];
    }
  },

  getCompleted: async () => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [true]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching completed tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  getPending: async () => {
    try {
      const apperClient = taskService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "due_date_c"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching pending tasks:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default taskService;