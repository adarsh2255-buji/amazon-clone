import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders
  , updateOrderToPaid
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';



const router = express.Router();

// Create Order (Any auth user) & Get All Orders (Admin)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Get Logged in User Orders
router.route('/myorders').get(protect, getMyOrders);

// Update order to paid
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Get Order by ID (Dynamic routes go last to avoid collision)
router.route('/:id').get(protect, getOrderById);

export default router;