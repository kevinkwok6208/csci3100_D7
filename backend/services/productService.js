const Product = require('../models/Products');

class ProductService {
  // Add new product
  static async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  }

  // Update product
  static async updateProduct(productID, updateData) {
    try {
      const product = await Product.findOneAndUpdate(
        { productID },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  // Get product by ID
  static async getProductById(productID) {
    try {
      const product = await Product.findOne({ productID });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Get all products
  static async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }
}

module.exports = ProductService;
