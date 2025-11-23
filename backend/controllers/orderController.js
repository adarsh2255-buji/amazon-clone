import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // 1. FETCH REAL PRODUCTS (Security Step)
    // We only trust the ID and Qty from the frontend.
    const ids = orderItems.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: ids } });

    // Verify we found all products
    if (dbProducts.length !== ids.length) {
        res.status(404);
        throw new Error('One or more products not found');
    }

    // 2. CONSTRUCT SAFE ORDER ITEMS & CALCULATE PRICES
    // Map for fast lookup to match DB product with Request quantity
    // Why? Because DB returns array in random order usually.
    const dbProductsMap = new Map();
    dbProducts.forEach((p) => dbProductsMap.set(p._id.toString(), p));

    const safeOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
        const dbProduct = dbProductsMap.get(item.product);
        
        // Check Stock (Optimistic Locking could be added here)
        if (dbProduct.countInStock < item.qty) {
            res.status(400);
            throw new Error(`Product ${dbProduct.name} is out of stock`);
        }

        safeOrderItems.push({
            product: item.product,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price, // Trust DB price, not Frontend
            qty: item.qty
        });

        itemsPrice += dbProduct.price * item.qty;
    }

    // 3. CALCULATE TOTALS
    // Amazon logic: Free shipping over $100, else $10
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    // Simple 15% tax calculation (Replace with Tax API later)
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // 4. CREATE ORDER
    const order = new Order({
      orderItems: safeOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // 5. DECREMENT STOCK (Should be in a Transaction for ACID compliance)
    // For now, we do it simply. In Production, wrap #4 and #5 in `session.withTransaction`
    for (const item of safeOrderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: -item.qty }
        });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    // Populate user name and email for Admin visibility
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Security: Only Admin or the Order Owner can see it
      if(req.user.role === 'admin' || order.user._id.equals(req.user._id)) {
         res.json(order);
      } else {
         res.status(403);
         throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({}).populate('user', 'id name');
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Only the order owner or admin can mark as paid
    if (!(req.user.role === 'admin' || order.user.equals(req.user._id))) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};