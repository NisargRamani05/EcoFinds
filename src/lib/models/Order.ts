import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;