const { Product, Order } = require('./inventoryModel');
const mongoose = require('mongoose');

// Place an order securely using MongoDB Transactions to prevent race conditions (Pillar 6)
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body; // Array of { productId, quantity }
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Find product within session lock
      const product = await Product.findOne({ _id: item.productId, tenantId: req.user.tenantId }).session(session);
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ status: 'fail', message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ status: 'fail', message: `Insufficient stock for SKU: ${product.sku}` });
      }

      // Deduct stock safely inside transaction
      product.stock -= item.quantity;
      await product.save({ session });

      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: product._id, quantity: item.quantity });
    }

    // Create the order record
    const order = await Order.create([{
      tenantId: req.user.tenantId,
      items: orderItems,
      totalAmount,
      status: 'fulfilled'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Broadcast real-time stock update via Socket.io if available
    const io = req.app.get('io');
    if (io) {
      io.to(`tenant_${req.user.tenantId}`).emit('inventory_updated', { orderId: order[0]._id });
    }

    res.status(201).json({ status: 'success', data: order[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ status: 'error', message: error.message });
  }
};