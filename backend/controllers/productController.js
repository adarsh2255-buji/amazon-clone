import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    // 1. Filtering Logic
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (gte, lte, etc.)
    // Example: ?price[gte]=100
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    // Base Query
    let query = Product.find(JSON.parse(queryStr));

    // 2. Keyword Search (Text Search)
    if (req.query.keyword) {
        query = Product.find({
            ...JSON.parse(queryStr),
            $text: { $search: req.query.keyword }
        });
    }

    // 3. Attribute Filtering (Special Handling)
    // Example URL: ?attr_Color=Red&attr_RAM=16GB
    // This part manually constructs the attribute query if needed, 
    // but the generic JSON parser above handles basic cases if frontend sends properly formatted JSON.
    // For strict attribute matching, we can add custom logic here.

    // 4. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default new to old
    }

    // 5. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execution
    const products = await query;
    const count = await Product.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
        success: true,
        count: products.length,
        total: count,
        pagination: { page, limit },
        data: products
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name email');

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
        name, price, description, image, brand, category, countInStock, attributes
    } = req.body;

    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        numReviews: 0,
        description,
        attributes: attributes || [] // Expecting array of {key, value}
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};
// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    // Regex for case-insensitive matching
    const products = await Product.find({ 
      category: { $regex: new RegExp(category, "i") } 
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const {
      name, price, description, image, brand, category, countInStock, attributes
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check ownership if just a seller (Admins can edit anything)
      if(req.user.role !== 'admin' && product.user.toString() !== req.user._id.toString()) {
          res.status(403);
          throw new Error('Not authorized to edit this product');
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;
      product.attributes = attributes || product.attributes;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (product) {
        // Check ownership
        if(req.user.role !== 'admin' && product.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this product');
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
    } catch (error) {
      next(error);
    }
  };

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // 1. Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      // 2. Create Review Object
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        createdAt: Date.now() // Timestamps: true doesn't apply to sub-docs automatically in array
      };
    // 3. Add to array
      product.reviews.push(review);

    // 4. Recalculate Metadata (The Math part)
      product.numReviews = product.reviews.length;

    // Sum all ratings / Total count
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};