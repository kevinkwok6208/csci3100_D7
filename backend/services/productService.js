const Product = require('../models/Products');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config({ path: './config/cloudinary.env' });

class ProductService {
  constructor() {
    // Configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Configure multer for memory storage
    const storage = multer.memoryStorage();
    this.uploadMiddleware = multer({
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      }
    }).array('productImages', 3); // Changed to array with max 3 images
  }

  // Get upload middleware
  getUploadMiddleware() {
    return this.uploadMiddleware;
  }

  // Upload multiple images to Cloudinary
  async uploadImagesToCloudinary(files) {
    if (!files || files.length === 0) {
      throw new Error('At least one product image is required');
    }

    const uploadPromises = files.map(async (file) => {
      // Convert buffer to base64 string
      const fileStr = file.buffer.toString('base64');
      const fileType = file.mimetype;
      
      // Upload to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${fileType};base64,${fileStr}`,
        {
          folder: 'products',
          resource_type: 'auto'
        }
      );
      
      return uploadResponse.secure_url;
    });
    
    return Promise.all(uploadPromises);
  }

  // Create new product
  async createProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  // Create new product with multiple image uploads
  async createProductWithImage(productData, files) {
    if (!files || files.length === 0) {
      throw new Error('At least one product image is required');
    }

    try {
      // Upload images to Cloudinary
      const imageUrls = await this.uploadImagesToCloudinary(files);
      
      // Add the image URLs to the product data
      productData.productImages = imageUrls;
      // Keep the first image as the main product image for backward compatibility
      productData.productImage = imageUrls[0];

      // Create and save the product
      return await this.createProduct(productData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update product  
  async updateProduct(productID, updateData) {
    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      updateData,
      { new: true, runValidators: true }
    );
    
    return updatedProduct;
  }

  // Update product with optional multiple image uploads
  async updateProductWithImage(productID, updateData, files) {
    try {
      // If files were provided, upload them to Cloudinary
      if (files && files.length > 0) {
        const imageUrls = await this.uploadImagesToCloudinary(files);
        // Add the image URLs to the update data
        updateData.productImages = imageUrls;
        // Keep the first image as the main product image for backward compatibility
        updateData.productImage = imageUrls[0];
      }
      
      // Update the product in the database
      const updatedProduct = await Product.findOneAndUpdate(
        { productID },
        updateData,
        { new: true, runValidators: true }
      );
      
      return updatedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update a specific image at a given index and also update other product data
async updateSpecificImage(productID, index, file, updateData) {
  try {
    // First get the existing product
    const product = await Product.findOne({ productID });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check if index is valid
    if (!product.productImages || index < 0 || index >= product.productImages.length) {
      throw new Error('Invalid image index');
    }
    
    // Upload new image to Cloudinary
    const [newImageUrl] = await this.uploadImagesToCloudinary([file]);
    
    // Create a copy of the images array
    const updatedImages = [...(product.productImages || [])];
    
    // Replace the image at the specified index
    updatedImages[index] = newImageUrl;
    
    // Add the updated images array to the update data
    updateData.productImages = updatedImages;
    
    // If we're replacing the main product image, update it too
    if (product.productImage === product.productImages[index]) {
      updateData.productImage = newImageUrl;
    }
    
    // Remove imageIndex from updateData as it's not a product property
    delete updateData.imageIndex;
    
    // Update the product in the database
    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      updateData,
      { new: true, runValidators: true }
    );
    
    return updatedProduct;
  } catch (error) {
    throw new Error(`Failed to update product with specific image: ${error.message}`);
    }
  }

  // Delete product
  async deleteProduct(productID) {
    const deleteProduct = await Product.findOneAndDelete({ productID:productID });
    if (!deleteProduct) {
      throw new Error('Product not found');
    }
    return deleteProduct;
  }

  // Update product storage
  async updateProductStorage(productID, productStorage){
    //Find the target product
    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      { productStorage },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  //update product price
  async updateProductPrice(productID, productPrice){
    //Find the target product
    const updatedProduct = await Product.findOneAndUpdate(
      { productID },
      { productPrice },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async updateProductCategory(productID, categoryName) {
    try {
      // 1. Find the category (case-insensitive, exact match)
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
      });
  
      if (!category) {
        console.log(`[DEBUG] Category not found: ${categoryName}`);
        return null;
      }
  
      // 2. Update the product's category reference
      const updatedProduct = await Product.findOneAndUpdate(
        { productID: productID },
        { $set: { category: category._id } },
        { new: true }
      ).populate('category');
  
      if (!updatedProduct) {
        console.log(`[DEBUG] Product not found: ${productID}`);
        return null;
      }
  
      console.log(`[DEBUG] Updated product ${productID} to category ${category.name}`);
      return updatedProduct;
    } catch (error) {
      console.error('[ERROR] Failed to update category:', error);
      throw error;
    }
  }
}
module.exports = new ProductService();