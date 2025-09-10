import { toast } from 'react-toastify';

const categoryService = {
  getApperClient: () => {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  getAll: async () => {
    try {
      const apperClient = categoryService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      toast.error("Failed to load categories");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = categoryService.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Category with id ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (categoryData) => {
    try {
      const apperClient = categoryService.getApperClient();
      
      // Only include Updateable fields in create operation
      const params = {
        records: [{
          Name: categoryData.name || "New Category",
          name_c: categoryData.name || "",
          color_c: categoryData.color || "#64748b",
          task_count_c: 0,
          Tags: categoryData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create category:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Category created successfully");
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const apperClient = categoryService.getApperClient();
      
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (categoryData.name !== undefined) {
        updateData.name_c = categoryData.name;
        updateData.Name = categoryData.name;
      }
      if (categoryData.color !== undefined) updateData.color_c = categoryData.color;
      if (categoryData.taskCount !== undefined) updateData.task_count_c = categoryData.taskCount;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update category:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Category updated successfully");
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = categoryService.getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete category:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Category deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      toast.error("Failed to delete category");
      return false;
    }
  },

  updateTaskCount: async (categoryName, count) => {
    try {
      // First find the category by name
      const categories = await categoryService.getAll();
      const category = categories.find(cat => 
        cat.name_c?.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (category) {
        await categoryService.update(category.Id, { taskCount: count });
      }
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error);
    }
  }
};

export default categoryService;