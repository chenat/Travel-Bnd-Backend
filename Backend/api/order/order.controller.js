const orderService = require('./order.service.js');
const logger = require('../../services/logger.service');
const { log } = require('../../middlewares/logger.middleware.js');
const socketService = require('../../services/socket.service')

async function getOrders(req, res) {
  try {
    logger.debug('Getting orders')
    var queryParams = req.query
    const orders = await orderService.query(queryParams)
    res.json(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

async function addOrder(req, res) {
  try {
    const order = req.body
    const addedOrder = await orderService.add(order)
    socketService.broadcast({ type: 'order-added', data:addedOrder  })

    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}


async function updateOrder(req, res) {
  try {
    const order = req.body;
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
    // const orders= await orderService.query()
    socketService.broadcast({ type: 'order-update', data:updatedOrder  })

  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })

  }
}

async function removeOrder(req, res) {
  try {
    const orderId = req.params.id;
    const removedId = await orderService.remove(orderId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}

async function getOrderById(req, res) {
  try {
    const orderId = req.params.id
    const order = await orderService.getById(orderId)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

module.exports = {
  getOrders,
  addOrder,
  removeOrder,
  updateOrder,
  getOrderById
}
