const Order = require('../models/Order');

// Add order
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

           //get all order
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

           //get order by id
           const getOrderById = async (req, res) => {
            try {
              const order = await Order.findById(req.params.id).populate('user', 'name email');
          
              if (order) {
                // Allow access if the user is the owner or an admin
                if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
                  res.json(order);
                } else {
                  res.status(403).json({ message: 'Not authorized to view this order' });
                }
              } else {
                res.status(404).json({ message: 'Order not found' });
              }
            } catch (error) {
              console.error('Get order by ID error:', error);
              res.status(500).json({ message: 'Server error' });
            }
          };

              

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
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
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order payment error:', error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Deliver error:', error);
    res.status(500).json({ message: 'Failed to update order to delivered' });
  }
};



const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus, paymentDetails } = req.body;

    // Find the order by orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    // Update order payment status and details
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = paymentDetails;

    await order.save();

    res.status(200).send({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid, 
  updateOrderToDelivered, 
  updatePaymentStatus,
  getAllOrders,
};
