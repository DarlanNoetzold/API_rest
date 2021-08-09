const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders-controller');

router.get('/', OrdersController.getOrders);

router.post('/', OrdersController.postOrders); 

router.get('/:orderId', OrdersController.getOneOrder);

router.delete('/', OrdersController.deleteOrder);

module.exports = router;
