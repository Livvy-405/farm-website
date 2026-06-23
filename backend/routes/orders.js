const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const {
  sendOrderConfirmation,
  sendAdminNewOrderAlert,
  sendFulfillmentNotification,
} = require('../config/email');

const router = express.Router();

// ── Public ──────────────────────────────────────────────────────────────────

/**
 * POST /api/orders
 * Place a new order. Sends confirmation emails to customer + admin.
 */
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      items,
      total,
      status: 'Pending',
    });

    // Fire emails in the background — don't block the response
    Promise.allSettled([
      sendOrderConfirmation(order),
      sendAdminNewOrderAlert(order),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Email ${i === 0 ? 'confirmation' : 'admin alert'} failed:`, r.reason);
        }
      });
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Admin-only (JWT required) ────────────────────────────────────────────────

/**
 * GET /api/orders
 * Query params: status (Pending|Fulfilled), page, limit
 */
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/orders/stats
 * Returns summary stats for the dashboard overview.
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const [totalOrders, pendingOrders, fulfilledOrders, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Fulfilled' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      fulfilledOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/orders/:id
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Body: { status: 'Pending' | 'Fulfilled' }
 * Sends fulfilment email when status changes to Fulfilled.
 */
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Fulfilled'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending or Fulfilled' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status === 'Fulfilled') {
      sendFulfillmentNotification(order).catch((err) =>
        console.error('Fulfilment email failed:', err)
      );
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * DELETE /api/orders/:id
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
