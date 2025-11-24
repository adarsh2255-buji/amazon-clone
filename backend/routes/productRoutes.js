import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect, sellerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Read, Private Write
router.route('/')
    .get(getProducts)
    .post(protect, sellerOrAdmin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, sellerOrAdmin, updateProduct)
    .delete(protect, sellerOrAdmin, deleteProduct);
router.route('/category/:category')
    .get(getProductsByCategory);

router.route("/:id/reviews")
    .post(protect,createProductReview);   

export default router;