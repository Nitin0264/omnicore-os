const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  sku: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, required: true, min: 0 },
  version: { type: Number, default: 0 } // Optimistic locking version key
}, { timestamps: true });

productSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

const orderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

const createProduct = async (tenantId, data) => {
  return await Product.create({ tenantId, ...data });
};

module.exports = { Product, Order, createProduct };