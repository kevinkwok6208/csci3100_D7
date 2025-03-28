const Product = require('../models/Products');
const productService = require('../services/productService');
const ProductDisplayService=require('../services/ProductDisplayService');
const multer = require('multer');

class ProductController {
  // Add new product with image upload
  async addProduct(req, res) {
    // Use multer middleware from the service
    const upload = productService.getUploadMiddleware();
    
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
          success: false,
          message: 'Unknown error',
          error: err.message
        });
      }
      
      try {
        // Call service to handle product creation with image uploads
        const savedProduct = await productService.createProductWithImage(req.body, req.files);
        
        res.status(201).json({
          success: true,
          message: 'Product added successfully',
          product: savedProduct
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || 'Failed to add product',
          error: error.message
        });
      }
    });
  }

  // Update product information
  // Update product information with optional specific image update
async updateProduct(req, res) {
  // Use multer middleware from the service
  const upload = productService.getUploadMiddleware();
  
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        success: false,
        message: 'Unknown error',
        error: err.message
      });
    }
    
    try {
      const { productID } = req.params;
      const { imageIndex } = req.body; // Get optional image index from request body
      
      let updatedProduct;
      
      // If imageIndex is provided and files are uploaded, update specific image
      if (imageIndex !== undefined && req.files && req.files.length > 0) {
        // Update specific image at the given index
        updatedProduct = await productService.updateSpecificImage(
          productID,
          parseInt(imageIndex),
          req.files[0], // Use the first uploaded file
          req.body // Include other product data for regular update
        );
      } else if (req.files && req.files.length > 0) {
        // Regular update with new images (replaces all images)
        updatedProduct = await productService.updateProductWithImage(
          productID,
          req.body,
          req.files
        );
      } else {
        // Regular update without images
        updatedProduct = await productService.updateProduct(
          productID,
          req.body
        );
      }

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  });
}

  // Set product price
  async updatePrice(req, res) {
    try {

      const { productID } = req.params;
      const { productPrice } = req.body;

      if (!productPrice) {
        return res.status(400).json({
          success: false,
          message: 'Product price is required'
        });
      }

      // Use service to update product price
      const updatedProduct = await productService.updateProductPrice(productID, productPrice);

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product price updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product price',
        error: error.message
      });
    }
  }

  // Manage product storage
  async updateStorage(req, res) {
    try {

      const { productID } = req.params;
      const { productStorage } = req.body;

      if (productStorage === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Product storage is required'
        });
      }

      // Use service to update product storage
      const updatedProduct = await productService.updateProductStorage(productID, productStorage);

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product storage updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product storage',
        error: error.message
      });
    }
  }

  // Get all products
  async getAllProducts(req, res) {
    try {
      // Use service to get all products
      const products = await Product.find();
      
      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  }

  // Get single product
  async getProductById(req, res) {
    try {
      const { productID } = req.params;
      
      // Use service to get product by ID
      const product = await ProductDisplayService.getProductById(productID);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      if (req.user,isadmin!==1){
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete products'
        });
      }
      const { productID } = req.params;
      
      // Use service to delete product
      const deletedProduct = await productService.deleteProduct(productID);
      
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        product: deletedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
}

module.exports = new ProductController();
