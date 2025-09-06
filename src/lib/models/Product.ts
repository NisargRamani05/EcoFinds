import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description.'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category.'],
    enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Other'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a price.'],
  },
  images: [{
    type: String, // Array of URLs to product images
    required: true,
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: true,
  },
}, {
  timestamps: true
});

const Product = models.Product || model('Product', ProductSchema);
export default Product;