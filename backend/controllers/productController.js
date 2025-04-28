const Product = require('../models/Products');
const Category = require('../models/Category');
const productService = require('../services/productService');
const ProductDisplayService = require('../services/ProductDisplayService');
const multer = require('multer');

class ProductController {
    // Add this method to your existing controller
  async getAllOrders(req, res) {
    try {
        const orders = await this.orderHistoryService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  // Add this method for Excel export
  async exportOrdersToExcel(req, res) {
    try {
        const orders = await this.orderHistoryService.getAllOrders();
        
        // You'll need to install the exceljs package: npm install exceljs
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Orders');
        
        // Define columns
        worksheet.columns = [
            { header: 'Order ID', key: 'orderId', width: 20 },
            { header: 'User', key: 'username', width: 20 },
            { header: 'Customer Name', key: 'Name', width: 20 },
            { header: 'Shipping Address', key: 'ShippingAddress', width: 30 },
            { header: 'Total Price', key: 'totalPrice', width: 15 },
            { header: 'Order Date', key: 'createdAt', width: 20 },
            { header: 'Products', key: 'products', width: 50 }
        ];
        
        // Add rows
        orders.forEach(order => {
            const productsList = order.products.map(p => 
                `${p.productId.productName} (${p.quantity} x $${p.price})`
            ).join(', ');
            
            worksheet.addRow({
                orderId: order.orderId,
                username: order.username || (order.userId && order.userId.username) || 'Unknown',
                Name: order.Name,
                ShippingAddress: order.ShippingAddress,
                totalPrice: `$${order.totalPrice.toFixed(2)}`,
                createdAt: new Date(order.createdAt).toLocaleDateString(),
                products: productsList
            });
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=all-orders.xlsx');
        
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }


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

  // Get all products with optional filtering
  async getAllProducts(req, res) {
    try {
      // Extract query parameters
      const { category, minPrice, maxPrice, rating } = req.query;
      
      // Build filter object
      const filter = {};
      
      // Add category filter if provided
      if (category) {
        // First find the category by name (case insensitive)
        const categoryObj = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        
        if (categoryObj) {
          filter.category = categoryObj._id;
        } else {
          // If category doesn't exist, return empty results
          return res.status(200).json({
            success: true,
            message: 'Category not found',
            count: 0,
            products: []
          });
        }
      }
      
      // Add price range filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.productPrice = {};
        if (minPrice !== undefined) filter.productPrice.$gte = Number(minPrice);
        if (maxPrice !== undefined) filter.productPrice.$lte = Number(maxPrice);
      }
      
      // Add rating filter if provided
      if (rating !== undefined) {
        filter.rating = { $gte: Number(rating) };
      }
      
      console.log('Filter:', filter); // Debug log
      
      // Use the filter to get products
      let query = Product.find(filter);
      
      // Handle sorting if provided in query
      const { sort } = req.query;
      if (sort) {
        let sortOption = {};
        
        switch (sort) {
          case 'price-asc':
            sortOption = { productPrice: 1 };
            break;
          case 'price-desc':
            sortOption = { productPrice: -1 };
            break;
          case 'rating':
            sortOption = { rating: -1 };
            break;
          case 'popularity':
            sortOption = { popularity: -1 };
            break;
          default:
            sortOption = { productName: 1 }; // Default sort by name
        }
        
        query = query.sort(sortOption);
      }
      
      // Populate category information
      query = query.populate('category');
      
      // Execute the query
      const products = await query;
      
      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  }

  // Get single product by ID
  async getProductById(req, res) {
    try {
      const { productID } = req.params;
      
      const product = await Product.findOne({ productID }).populate('category');
      
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
  
  // Update product category
  async updateCategory(req, res) {
    try {
      const { productID } = req.params;
      const { categoryName } = req.body;
  
      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required in request body'
        });
      }
  
      // Use service to update product category
      const updatedProduct = await productService.updateProductCategory(
        productID, 
        categoryName
      );
  
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or category does not exist'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Product category updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product category',
        error: error.message
      });
    }
  } 
}

module.exports = new ProductController();