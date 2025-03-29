const Product = require('../models/Products');
const Category = require('../models/Category');

class CategoryAssignmentService {
  // Assign categories to products that don't have one
  static async assignCategoriesToProducts() {
    try {
      // Get all categories
      const categories = await Category.find();
      console.log(`Found ${categories.length} categories`);
      
      if (categories.length === 0) {
        throw new Error('No categories found. Please create categories first.');
      }
      
      // Get all products without a category
      const products = await Product.find({ category: { $exists: false } });
      console.log(`Found ${products.length} products without categories`);
      
      if (products.length === 0) {
        return { success: true, message: 'No products found without categories.' };
      }
      
      // Assign random categories to products
      let assignedCount = 0;
      let failedCount = 0;
      
      for (const product of products) {
        try {
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          
          product.category = randomCategory._id;
          await product.save();
          assignedCount++;
          
          console.log(`Assigned category "${randomCategory.name}" to product "${product.productName}"`);
        } catch (error) {
          failedCount++;
          console.error(`Failed to assign category to product "${product.productName}": ${error.message}`);
        }
      }
      
      return { 
        success: true, 
        message: 'Categories assignment completed',
        assignedCount,
        failedCount,
        totalProducts: products.length
      };
    } catch (error) {
      console.error('Failed to assign categories:', error);
      throw new Error(`Error assigning categories: ${error.message}`);
    }
  }

  // Assign a specific category to a product
  static async assignCategoryToProduct(productId, categoryId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      product.category = category._id;
      await product.save();

      return { 
        success: true, 
        message: `Assigned category "${category.name}" to product "${product.productName}"`,
        product
      };
    } catch (error) {
      throw new Error(`Error assigning category to product: ${error.message}`);
    }
  }
}

module.exports = CategoryAssignmentService;