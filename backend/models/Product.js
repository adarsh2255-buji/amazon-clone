import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Relationship to the Seller/Admin who created it
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true // Single field index for category filtering
  },
  description: {
    type: String,
    required: true,
  },
  // The Attribute Pattern
  // Allows storing specific specs: [{ key: "RAM", value: "16GB" }, { key: "Color", value: "Red" }]
  attributes: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  reviews: [reviewSchema], 
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

// TEXT INDEX for Search functionality (Name and Description)
productSchema.index({ name: 'text', description: 'text' });

// COMPOUND INDEX for Attribute Filtering
// Find products where attributes.key = "Color" AND attributes.value = "Red"
productSchema.index({ "attributes.key": 1, "attributes.value": 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;