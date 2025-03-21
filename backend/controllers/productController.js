const Product = require('../models/Products');

// Add new product
exports.addProduct = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.isadmin !== 1) {
      return res.status(403).json({ message: 'Only sellers can add products' });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message
    });
  }
};

// Update product information
exports.updateProduct = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.isadmin !== 1) {
      return res.status(403).json({ message: 'Only sellers can update products' });
    }

    const { productID } = req.params;
    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      req.body,
      { new: true, runValidators: true }
    );

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
};

// Set product price
exports.updatePrice = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.isadmin !== 1) {
      return res.status(403).json({ message: 'Only sellers can update product prices' });
    }

    const { productID } = req.params;
    const { productPrice } = req.body;

    if (!productPrice) {
      return res.status(400).json({
        success: false,
        message: 'Product price is required'
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      { productPrice },
      { new: true }
    );

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
};

// Manage product storage
exports.updateStorage = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.isadmin !== 1) {
      return res.status(403).json({ message: 'Only sellers can update product storage' });
    }

    const { productID } = req.params;
    const { productStorage } = req.body;

    if (productStorage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product storage is required'
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      { productStorage },
      { new: true }
    );

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
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
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
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const { productID } = req.params;
    const product = await Product.findOne({ productID });

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
};



// Delete product
exports.deleteProduct = async (req, res) => {
    try {
      // Check if user is a seller
      if (req.user.isadmin !== 1) {
        return res.status(403).json({ message: 'Only sellers can delete products' });
      }
  
      const { productID } = req.params;
      
      const deletedProduct = await Product.findOneAndDelete({ productID });
      
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
  };
  